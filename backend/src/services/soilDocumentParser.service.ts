import { createRequire } from 'module';
import { createWorker } from 'tesseract.js';
import fs from 'fs';

const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

export interface ExtractedParameter {
  value?: number;
  unit: string;
  confidence: number;
  source: 'ocr_extracted' | 'lab_digital' | 'manual_entry';
  isAvailable: boolean;
  rawMatchedText?: string;
}

export interface ExtractedSoilDocument {
  success: boolean;
  extractedTextLength: number;
  overallConfidence: number;
  metadata: {
    farmerName?: string;
    sampleId?: string;
    labName?: string;
    sampleDate?: string;
    reportDate?: string;
    village?: string;
    district?: string;
    state?: string;
    soilType?: string;
    crop?: string;
  };
  parameters: {
    ph?: ExtractedParameter;
    nitrogen?: ExtractedParameter;
    phosphorus?: ExtractedParameter;
    potassium?: ExtractedParameter;
    organicCarbon?: ExtractedParameter;
    electricalConductivity?: ExtractedParameter;
    sulfur?: ExtractedParameter;
    zinc?: ExtractedParameter;
    iron?: ExtractedParameter;
    copper?: ExtractedParameter;
    manganese?: ExtractedParameter;
    boron?: ExtractedParameter;
  };
  warning?: string;
  isVisualPhotoOnly?: boolean;
}

export class SoilDocumentParserService {
  /**
   * Parse a PDF or image soil health report file buffer
   */
  public static async parseDocument(
    filePath: string,
    mimeType: string,
    originalName: string
  ): Promise<ExtractedSoilDocument> {
    let rawText = '';
    let isOcr = false;

    try {
      const fileBuffer = fs.readFileSync(filePath);

      if (mimeType === 'application/pdf' || originalName.toLowerCase().endsWith('.pdf')) {
        try {
          if (pdfParse.PDFParse) {
            const parser = new pdfParse.PDFParse({ data: fileBuffer });
            const pdfData = await parser.getText();
            rawText = pdfData?.text || '';
          } else if (typeof pdfParse === 'function') {
            const pdfData = await pdfParse(fileBuffer);
            rawText = pdfData?.text || '';
          }
        } catch (pdfErr) {
          console.warn('Direct PDF text extraction failed:', pdfErr);
        }
      } else if (
        mimeType.startsWith('image/') ||
        /\.(jpe?g|png|webp|bmp|tiff)$/i.test(originalName)
      ) {
        isOcr = true;
        rawText = await this.performTesseractOcr(fileBuffer);
      }

      if (!rawText || rawText.trim().length < 15) {
        return {
          success: false,
          extractedTextLength: 0,
          overallConfidence: 0,
          metadata: {},
          parameters: {},
          warning:
            "We couldn't reliably read this report. Please upload a clearer image/PDF or enter the values manually.",
        };
      }

      // Check if uploaded image appears to be an ordinary landscape/field photo rather than a document
      const isDocKeywords = /(soil|test|report|health|card|ph|nitrogen|potassium|phosphorus|icar|shc|lab|krishi|sample|nutrient|npk|carbon|ec)/i.test(
        rawText
      );

      if (!isDocKeywords && isOcr) {
        return {
          success: false,
          extractedTextLength: rawText.length,
          overallConfidence: 20,
          metadata: {},
          parameters: {},
          isVisualPhotoOnly: true,
          warning:
            'A photograph can provide visual observations, but laboratory testing is required for reliable chemical soil measurements such as pH and NPK. Please upload a certified soil test report or enter values manually.',
        };
      }

      return this.extractSoilDataFromText(rawText, isOcr ? 'ocr_extracted' : 'lab_digital');
    } catch (err: any) {
      console.error('Soil document parsing error:', err);
      return {
        success: false,
        extractedTextLength: 0,
        overallConfidence: 0,
        metadata: {},
        parameters: {},
        warning:
          "We couldn't reliably process this document. Please verify the file or enter the values manually.",
      };
    }
  }

  /**
   * Run OCR via Tesseract.js worker
   */
  private static async performTesseractOcr(buffer: Buffer): Promise<string> {
    try {
      const worker = await createWorker('eng');
      const ret = await worker.recognize(buffer);
      await worker.terminate();
      return ret.data?.text || '';
    } catch (e) {
      console.warn('Tesseract OCR error:', e);
      return '';
    }
  }

  /**
   * Extract parameters and metadata using multi-pattern regex matching
   */
  public static extractSoilDataFromText(
    text: string,
    source: 'ocr_extracted' | 'lab_digital'
  ): ExtractedSoilDocument {
    const cleaned = text.replace(/\r\n/g, '\n').replace(/[ \t]+/g, ' ');

    const metadata: ExtractedSoilDocument['metadata'] = {};
    const parameters: ExtractedSoilDocument['parameters'] = {};
    let matchedCount = 0;
    let confidenceSum = 0;

    // 1. Metadata Extraction
    // Farmer Name
    const nameMatch = cleaned.match(
      /(?:farmer\s*name|name\s*of\s*farmer|beneficiary\s*name|farmer)\s*[:\-=]\s*([A-Za-z\s.]{3,35})/i
    );
    if (nameMatch && nameMatch[1]) {
      metadata.farmerName = nameMatch[1].trim();
    }

    // Sample / Card ID
    const sampleIdMatch = cleaned.match(
      /(?:sample\s*(?:no|id|code)|card\s*no|registration\s*no|report\s*no)\s*[:\-=]\s*([A-Za-z0-9\-_/]{3,25})/i
    );
    if (sampleIdMatch && sampleIdMatch[1]) {
      metadata.sampleId = sampleIdMatch[1].trim();
    }

    // Dates
    const dateMatch = cleaned.match(
      /(?:date\s*of\s*(?:test|sampling|report)|sample\s*date|test\s*date|date)\s*[:\-=]\s*(\d{1,2}[-/.](?:\d{1,2}|[A-Za-z]{3})[-/.]\d{2,4})/i
    );
    if (dateMatch && dateMatch[1]) {
      metadata.reportDate = dateMatch[1].trim();
    }

    // District / State
    const districtMatch = cleaned.match(/(?:district|dist)\s*[:\-=]\s*([A-Za-z\s]{3,25})/i);
    if (districtMatch && districtMatch[1]) {
      metadata.district = districtMatch[1].trim();
    }

    const stateMatch = cleaned.match(/(?:state)\s*[:\-=]\s*([A-Za-z\s]{3,25})/i);
    if (stateMatch && stateMatch[1]) {
      metadata.state = stateMatch[1].trim();
    }

    // 2. Primary Parameters Extraction

    // (A) pH (Range 3.0 to 11.0)
    const phMatch = cleaned.match(
      /(?:pH\s*(?:\(1:2\.5\)|reaction|value)?|soil\s*reaction\s*\(?pH\)?)\s*[:\-=]?\s*([0-9]{1,2}(?:\.[0-9]{1,2})?)/i
    ) || cleaned.match(/\bpH\s*[:\s=]+([0-9]\.[0-9]{1,2})\b/i);

    if (phMatch && phMatch[1]) {
      const val = parseFloat(phMatch[1]);
      if (val >= 3.0 && val <= 11.0) {
        parameters.ph = {
          value: val,
          unit: '',
          confidence: source === 'lab_digital' ? 95 : 88,
          source,
          isAvailable: true,
          rawMatchedText: phMatch[0],
        };
        matchedCount++;
        confidenceSum += parameters.ph.confidence;
      }
    }

    // (B) Organic Carbon (OC) in % (Range 0.01 to 10.0%)
    const ocMatch = cleaned.match(
      /(?:organic\s*carbon(?:\s*\([a-z0-9\s%]+\))?|O\.?\s*C\.?(?:\s*\([a-z0-9\s%]+\))?|OC\s*\(%\)|OC)\s*[:\-=]?\s*([0-9]{1,2}(?:\.[0-9]{1,3})?)\s*%?/i
    );
    if (ocMatch && ocMatch[1]) {
      const val = parseFloat(ocMatch[1]);
      if (val >= 0.01 && val <= 10.0) {
        parameters.organicCarbon = {
          value: val,
          unit: '%',
          confidence: source === 'lab_digital' ? 95 : 85,
          source,
          isAvailable: true,
          rawMatchedText: ocMatch[0],
        };
        matchedCount++;
        confidenceSum += parameters.organicCarbon.confidence;
      }
    }

    // (C) Available Nitrogen (N) in kg/ha (Range 10 to 1500)
    const nMatch = cleaned.match(
      /(?:available\s*nitrogen(?:\s*\([a-z0-9\s/]+\))?|nitrogen(?:\s*\([a-z0-9\s/]+\))?|avail\.?\s*N|N\s*\(kg\/ha\))\s*[:\-=]?\s*([0-9]{2,4}(?:\.[0-9]{1,2})?)/i
    );
    if (nMatch && nMatch[1]) {
      const val = parseFloat(nMatch[1]);
      if (val >= 10 && val <= 1500) {
        parameters.nitrogen = {
          value: Math.round(val * 10) / 10,
          unit: 'kg/ha',
          confidence: source === 'lab_digital' ? 92 : 82,
          source,
          isAvailable: true,
          rawMatchedText: nMatch[0],
        };
        matchedCount++;
        confidenceSum += parameters.nitrogen.confidence;
      }
    }

    // (D) Available Phosphorus (P / P2O5) in kg/ha (Range 0.5 to 350)
    const pMatch = cleaned.match(
      /(?:available\s*phosphorus(?:\s*\([a-z0-9\s/]+\))?|phosphorus(?:\s*\([a-z0-9\s/]+\))?|avail\.?\s*P|P2O5|P\s*\(kg\/ha\))\s*[:\-=]?\s*([0-9]{1,3}(?:\.[0-9]{1,2})?)/i
    );
    if (pMatch && pMatch[1]) {
      const val = parseFloat(pMatch[1]);
      if (val >= 0.5 && val <= 350) {
        parameters.phosphorus = {
          value: Math.round(val * 10) / 10,
          unit: 'kg/ha',
          confidence: source === 'lab_digital' ? 94 : 84,
          source,
          isAvailable: true,
          rawMatchedText: pMatch[0],
        };
        matchedCount++;
        confidenceSum += parameters.phosphorus.confidence;
      }
    }

    // (E) Available Potassium (K / K2O) in kg/ha (Range 10 to 2000)
    const kMatch = cleaned.match(
      /(?:available\s*potassium(?:\s*\([a-z0-9\s/]+\))?|potassium(?:\s*\([a-z0-9\s/]+\))?|avail\.?\s*K|K2O|K\s*\(kg\/ha\))\s*[:\-=]?\s*([0-9]{2,4}(?:\.[0-9]{1,2})?)/i
    );
    if (kMatch && kMatch[1]) {
      const val = parseFloat(kMatch[1]);
      if (val >= 10 && val <= 2000) {
        parameters.potassium = {
          value: Math.round(val * 10) / 10,
          unit: 'kg/ha',
          confidence: source === 'lab_digital' ? 93 : 83,
          source,
          isAvailable: true,
          rawMatchedText: kMatch[0],
        };
        matchedCount++;
        confidenceSum += parameters.potassium.confidence;
      }
    }

    // (F) Electrical Conductivity (EC) in dS/m (Range 0.01 to 20.0)
    const ecMatch = cleaned.match(
      /(?:electrical\s*conductivity(?:\s*\([a-z0-9\s/]+\))?|E\.?\s*C\.?(?:\s*\([a-z0-9\s/]+\))?|EC\s*\(dS\/m\)|EC|soluble\s*salts)\s*[:\-=]?\s*([0-9]{1,2}(?:\.[0-9]{1,3})?)/i
    );
    if (ecMatch && ecMatch[1]) {
      const val = parseFloat(ecMatch[1]);
      if (val >= 0.01 && val <= 20.0) {
        parameters.electricalConductivity = {
          value: val,
          unit: 'dS/m',
          confidence: source === 'lab_digital' ? 92 : 82,
          source,
          isAvailable: true,
          rawMatchedText: ecMatch[0],
        };
        matchedCount++;
        confidenceSum += parameters.electricalConductivity.confidence;
      }
    }

    // 3. Secondary & Micronutrients Extraction

    // (G) Sulphur (S) in ppm or mg/kg
    const sMatch = cleaned.match(
      /(?:available\s*sulphur(?:\s*\([a-z0-9\s/]+\))?|available\s*sulfur(?:\s*\([a-z0-9\s/]+\))?|sulphur(?:\s*\([a-z0-9\s/]+\))?|sulfur(?:\s*\([a-z0-9\s/]+\))?|S\s*\(ppm\))\s*[:\-=]?\s*([0-9]{1,3}(?:\.[0-9]{1,2})?)/i
    );
    if (sMatch && sMatch[1]) {
      const val = parseFloat(sMatch[1]);
      if (val >= 0.1 && val <= 300) {
        parameters.sulfur = {
          value: val,
          unit: 'ppm',
          confidence: 80,
          source,
          isAvailable: true,
          rawMatchedText: sMatch[0],
        };
        matchedCount++;
        confidenceSum += 80;
      }
    }

    // (H) Zinc (Zn) in ppm
    const znMatch = cleaned.match(
      /(?:available\s*zinc|zinc\s*\(?Zn\)?|DTPA\s*[-–]?\s*Zn|Zn\s*\(ppm\))\s*[:\-=]?\s*([0-9]{1,2}(?:\.[0-9]{1,3})?)\s*(?:ppm|mg\/kg)?/i
    );
    if (znMatch && znMatch[1]) {
      const val = parseFloat(znMatch[1]);
      if (val >= 0.05 && val <= 50) {
        parameters.zinc = {
          value: val,
          unit: 'ppm',
          confidence: 80,
          source,
          isAvailable: true,
          rawMatchedText: znMatch[0],
        };
        matchedCount++;
        confidenceSum += 80;
      }
    }

    // (I) Iron (Fe) in ppm
    const feMatch = cleaned.match(
      /(?:available\s*iron|iron\s*\(?Fe\)?|DTPA\s*[-–]?\s*Fe|Fe\s*\(ppm\))\s*[:\-=]?\s*([0-9]{1,3}(?:\.[0-9]{1,2})?)\s*(?:ppm|mg\/kg)?/i
    );
    if (feMatch && feMatch[1]) {
      const val = parseFloat(feMatch[1]);
      if (val >= 0.1 && val <= 100) {
        parameters.iron = {
          value: val,
          unit: 'ppm',
          confidence: 80,
          source,
          isAvailable: true,
          rawMatchedText: feMatch[0],
        };
        matchedCount++;
        confidenceSum += 80;
      }
    }

    // (J) Copper (Cu) in ppm
    const cuMatch = cleaned.match(
      /(?:available\s*copper|copper\s*\(?Cu\)?|DTPA\s*[-–]?\s*Cu|Cu\s*\(ppm\))\s*[:\-=]?\s*([0-9]{1,2}(?:\.[0-9]{1,3})?)\s*(?:ppm|mg\/kg)?/i
    );
    if (cuMatch && cuMatch[1]) {
      const val = parseFloat(cuMatch[1]);
      if (val >= 0.01 && val <= 30) {
        parameters.copper = {
          value: val,
          unit: 'ppm',
          confidence: 80,
          source,
          isAvailable: true,
          rawMatchedText: cuMatch[0],
        };
        matchedCount++;
        confidenceSum += 80;
      }
    }

    // (K) Manganese (Mn) in ppm
    const mnMatch = cleaned.match(
      /(?:available\s*manganese|manganese\s*\(?Mn\)?|DTPA\s*[-–]?\s*Mn|Mn\s*\(ppm\))\s*[:\-=]?\s*([0-9]{1,3}(?:\.[0-9]{1,2})?)\s*(?:ppm|mg\/kg)?/i
    );
    if (mnMatch && mnMatch[1]) {
      const val = parseFloat(mnMatch[1]);
      if (val >= 0.1 && val <= 100) {
        parameters.manganese = {
          value: val,
          unit: 'ppm',
          confidence: 80,
          source,
          isAvailable: true,
          rawMatchedText: mnMatch[0],
        };
        matchedCount++;
        confidenceSum += 80;
      }
    }

    // (L) Boron (B) in ppm
    const bMatch = cleaned.match(
      /(?:available\s*boron|boron\s*\(?B\)?|hot\s*water\s*[-–]?\s*B|B\s*\(ppm\))\s*[:\-=]?\s*([0-9]{1,2}(?:\.[0-9]{1,3})?)\s*(?:ppm|mg\/kg)?/i
    );
    if (bMatch && bMatch[1]) {
      const val = parseFloat(bMatch[1]);
      if (val >= 0.01 && val <= 20) {
        parameters.boron = {
          value: val,
          unit: 'ppm',
          confidence: 80,
          source,
          isAvailable: true,
          rawMatchedText: bMatch[0],
        };
        matchedCount++;
        confidenceSum += 80;
      }
    }

    const overallConfidence = matchedCount > 0 ? Math.round(confidenceSum / matchedCount) : 0;
    const isSuccessful = matchedCount >= 2; // At least 2 genuine soil parameters extracted

    return {
      success: isSuccessful,
      extractedTextLength: cleaned.length,
      overallConfidence,
      metadata,
      parameters,
      warning: isSuccessful
        ? undefined
        : "We couldn't reliably extract all key soil parameters. Please review and verify the values below before confirming.",
    };
  }
}
