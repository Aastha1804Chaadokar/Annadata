import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { SoilReport } from '../models/SoilReport.js';
import { SoilHealthService } from '../services/soilHealth.service.js';
import { SoilDocumentParserService } from '../services/soilDocumentParser.service.js';
import { isDatabaseConnected } from '../db/connection.js';

export const uploadSoilReportDocument = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, error: 'Please upload a PDF, JPG, JPEG, or PNG soil report file.' });
      return;
    }

    const file = req.file;
    const allowedMimeTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'image/webp'];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      // Remove temporary uploaded file
      if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
      res.status(400).json({
        success: false,
        error: 'Unsupported file format. Please upload a PDF, JPG, JPEG, or PNG document.',
      });
      return;
    }

    // Process and extract soil report information
    const extraction = await SoilDocumentParserService.parseDocument(file.path, file.mimetype, file.originalname);

    const fileUrl = `/api/v1/soil-reports/file/${path.basename(file.path)}`;

    res.status(200).json({
      success: true,
      fileInfo: {
        fileName: file.filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        fileSize: file.size,
        fileUrl,
      },
      extraction,
    });
  } catch (error: any) {
    console.error('Error in uploadSoilReportDocument:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to process the soil report document.',
    });
  }
};

export const verifyAndSaveSoilReport = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!isDatabaseConnected()) {
      res.status(503).json({ success: false, error: 'Database service is temporarily unavailable.' });
      return;
    }

    const authenticatedUser = (req as any).user;

    const {
      farmerId = authenticatedUser ? `farmer_${authenticatedUser.mobile}` : 'default_farmer',
      farmId = 'default_farm',
      userId = authenticatedUser?.id,
      farmerName = authenticatedUser?.name,
      sampleId,
      labName,
      sampleDate,
      reportDate,
      village,
      district = authenticatedUser?.district,
      state = authenticatedUser?.state,
      soilType = 'Unknown',
      irrigationType = 'Rain-fed',
      crop,
      ph,
      nitrogen,
      phosphorus,
      potassium,
      organicCarbon,
      electricalConductivity,
      sulfur,
      zinc,
      iron,
      copper,
      manganese,
      boron,
      testDate,
      source = 'report_upload',
      reportFile,
      extractionConfidence = 100,
    } = req.body;

    // Validation
    const numericPh = Number(ph);
    if (isNaN(numericPh) || numericPh < 0 || numericPh > 14) {
      res.status(400).json({ success: false, error: 'Valid pH between 0 and 14 is required.' });
      return;
    }

    if (!nitrogen || isNaN(Number(nitrogen.value))) {
      res.status(400).json({ success: false, error: 'Valid Nitrogen (N) value is required.' });
      return;
    }

    if (!phosphorus || isNaN(Number(phosphorus.value))) {
      res.status(400).json({ success: false, error: 'Valid Phosphorus (P) value is required.' });
      return;
    }

    if (!potassium || isNaN(Number(potassium.value))) {
      res.status(400).json({ success: false, error: 'Valid Potassium (K) value is required.' });
      return;
    }

    if (!organicCarbon || isNaN(Number(organicCarbon.value))) {
      res.status(400).json({ success: false, error: 'Valid Organic Carbon (OC) value is required.' });
      return;
    }

    // Run scientific interpretation
    const interpretation = SoilHealthService.interpretSoilHealth({
      ph: numericPh,
      nitrogen,
      phosphorus,
      potassium,
      organicCarbon,
      electricalConductivity,
      sulfur,
      zinc,
      iron,
      copper,
      manganese,
      boron,
      soilType,
      irrigationType,
      crop,
    });

    const report = new SoilReport({
      farmerId: authenticatedUser ? `farmer_${authenticatedUser.mobile}` : farmerId,
      farmId,
      userId: authenticatedUser?.id || userId,
      farmerName: farmerName || authenticatedUser?.name,
      sampleId,
      labName,
      sampleDate: sampleDate ? new Date(sampleDate) : undefined,
      reportDate: reportDate ? new Date(reportDate) : undefined,
      village,
      district,
      state,
      soilType,
      irrigationType,
      crop,
      ph: numericPh,
      nitrogen: {
        value: Number(nitrogen.value),
        unit: String(nitrogen.unit || 'kg/ha'),
        status: nitrogen.status || 'Normal',
        source: nitrogen.source || source,
        confidence: nitrogen.confidence || 100,
      },
      phosphorus: {
        value: Number(phosphorus.value),
        unit: String(phosphorus.unit || 'kg/ha'),
        status: phosphorus.status || 'Normal',
        source: phosphorus.source || source,
        confidence: phosphorus.confidence || 100,
      },
      potassium: {
        value: Number(potassium.value),
        unit: String(potassium.unit || 'kg/ha'),
        status: potassium.status || 'Normal',
        source: potassium.source || source,
        confidence: potassium.confidence || 100,
      },
      organicCarbon: {
        value: Number(organicCarbon.value),
        unit: String(organicCarbon.unit || '%'),
        status: organicCarbon.status || 'Normal',
        source: organicCarbon.source || source,
        confidence: organicCarbon.confidence || 100,
      },
      electricalConductivity:
        electricalConductivity && typeof electricalConductivity.value === 'number'
          ? {
              value: Number(electricalConductivity.value),
              unit: String(electricalConductivity.unit || 'dS/m'),
              status: electricalConductivity.status || 'Normal',
              source: electricalConductivity.source || source,
              confidence: electricalConductivity.confidence || 100,
            }
          : undefined,
      sulfur:
        sulfur && typeof sulfur.value === 'number'
          ? {
              value: Number(sulfur.value),
              unit: String(sulfur.unit || 'ppm'),
              status: sulfur.status || 'Normal',
              source: sulfur.source || source,
              confidence: sulfur.confidence || 100,
            }
          : undefined,
      zinc:
        zinc && typeof zinc.value === 'number'
          ? {
              value: Number(zinc.value),
              unit: String(zinc.unit || 'ppm'),
              status: zinc.status || 'Normal',
              source: zinc.source || source,
              confidence: zinc.confidence || 100,
            }
          : undefined,
      iron:
        iron && typeof iron.value === 'number'
          ? {
              value: Number(iron.value),
              unit: String(iron.unit || 'ppm'),
              status: iron.status || 'Normal',
              source: iron.source || source,
              confidence: iron.confidence || 100,
            }
          : undefined,
      copper:
        copper && typeof copper.value === 'number'
          ? {
              value: Number(copper.value),
              unit: String(copper.unit || 'ppm'),
              status: copper.status || 'Normal',
              source: copper.source || source,
              confidence: copper.confidence || 100,
            }
          : undefined,
      manganese:
        manganese && typeof manganese.value === 'number'
          ? {
              value: Number(manganese.value),
              unit: String(manganese.unit || 'ppm'),
              status: manganese.status || 'Normal',
              source: manganese.source || source,
              confidence: manganese.confidence || 100,
            }
          : undefined,
      boron:
        boron && typeof boron.value === 'number'
          ? {
              value: Number(boron.value),
              unit: String(boron.unit || 'ppm'),
              status: boron.status || 'Normal',
              source: boron.source || source,
              confidence: boron.confidence || 100,
            }
          : undefined,
      testDate: testDate ? new Date(testDate) : new Date(),
      source,
      isVerified: true,
      verificationStatus: source === 'manual_entry' ? 'manual_entry' : 'verified',
      extractionConfidence,
      overallHealthStatus: interpretation.overallStatus,
      summaryText: interpretation.summaryExplanation,
      recommendations: interpretation.practicalGuidance,
      reportFile,
    });

    const saved = await report.save();

    res.status(201).json({
      success: true,
      data: saved,
      report: saved,
      interpretation,
    });
  } catch (error: any) {
    console.error('Error saving soil report:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to save verified soil report' });
  }
};

export const createSoilReport = async (req: Request, res: Response): Promise<void> => {
  return verifyAndSaveSoilReport(req, res);
};

export const getSoilReportsByFarm = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!isDatabaseConnected()) {
      res.status(503).json({ success: false, error: 'Database service is temporarily unavailable.' });
      return;
    }
    const { farmId } = req.params;
    const { farmerId } = req.query;
    const authenticatedUser = (req as any).user;

    let query: any = {};
    if (authenticatedUser) {
      query.$or = [
        { userId: authenticatedUser.id },
        { farmerId: authenticatedUser.id },
        { farmerId: `farmer_${authenticatedUser.mobile}` },
      ];
    } else if (farmerId) {
      query = { $or: [{ farmerId: String(farmerId) }, { farmId: String(farmId || farmerId) }] };
    } else {
      query = { farmId };
    }

    const reports = await SoilReport.find(query).sort({ testDate: -1, createdAt: -1 });

    const reportsWithInterpretation = reports.map((rep) => {
      const interpretation = SoilHealthService.interpretSoilHealth({
        ph: rep.ph,
        nitrogen: rep.nitrogen,
        phosphorus: rep.phosphorus,
        potassium: rep.potassium,
        organicCarbon: rep.organicCarbon,
        electricalConductivity: rep.electricalConductivity,
        sulfur: rep.sulfur,
        zinc: rep.zinc,
        iron: rep.iron,
        copper: rep.copper,
        manganese: rep.manganese,
        boron: rep.boron,
        soilType: rep.soilType,
        irrigationType: rep.irrigationType,
      });

      return {
        ...rep.toObject(),
        interpretation,
      };
    });

    res.status(200).json({
      success: true,
      count: reports.length,
      data: reportsWithInterpretation,
      reports: reportsWithInterpretation,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to fetch soil reports' });
  }
};

export const getLatestVerifiedReport = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!isDatabaseConnected()) {
      res.status(503).json({ success: false, error: 'Database service is temporarily unavailable.' });
      return;
    }
    const { farmId, farmerId } = req.query;
    const authenticatedUser = (req as any).user;
    const query: any = { isVerified: true };

    if (authenticatedUser) {
      query.$or = [
        { userId: authenticatedUser.id },
        { farmerId: authenticatedUser.id },
        { farmerId: `farmer_${authenticatedUser.mobile}` },
      ];
    } else if (farmerId && farmId) {
      query.$or = [{ farmerId: String(farmerId) }, { farmId: String(farmId) }];
    } else if (farmerId) {
      query.farmerId = String(farmerId);
    } else if (farmId) {
      query.farmId = String(farmId);
    } else {
      query.farmId = 'default_farm';
    }

    const latest = await SoilReport.findOne(query).sort({ testDate: -1, createdAt: -1 });

    if (!latest) {
      res.status(200).json({ success: true, data: null, report: null, message: 'No verified soil report available.' });
      return;
    }

    const interpretation = SoilHealthService.interpretSoilHealth({
      ph: latest.ph,
      nitrogen: latest.nitrogen,
      phosphorus: latest.phosphorus,
      potassium: latest.potassium,
      organicCarbon: latest.organicCarbon,
      electricalConductivity: latest.electricalConductivity,
      sulfur: latest.sulfur,
      zinc: latest.zinc,
      iron: latest.iron,
      copper: latest.copper,
      manganese: latest.manganese,
      boron: latest.boron,
      soilType: latest.soilType,
      irrigationType: latest.irrigationType,
    });

    res.status(200).json({
      success: true,
      data: latest,
      report: latest,
      interpretation,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to fetch latest soil report' });
  }
};

export const getSoilTrends = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!isDatabaseConnected()) {
      res.status(503).json({ success: false, error: 'Database service is temporarily unavailable.' });
      return;
    }
    const farmId = req.params.farmId || req.query.farmId;
    const farmerId = req.query.farmerId;
    const authenticatedUser = (req as any).user;
    const query: any = { isVerified: true };

    if (authenticatedUser) {
      query.$or = [
        { userId: authenticatedUser.id },
        { farmerId: authenticatedUser.id },
        { farmerId: `farmer_${authenticatedUser.mobile}` },
      ];
    } else if (farmerId && farmId) {
      query.$or = [{ farmerId: String(farmerId) }, { farmId: String(farmId) }];
    } else if (farmerId) {
      query.farmerId = String(farmerId);
    } else if (farmId) {
      query.farmId = String(farmId);
    } else {
      query.farmId = 'default_farm';
    }

    const reports = await SoilReport.find(query).sort({ testDate: 1, createdAt: 1 });

    const trends = reports.map((r) => ({
      id: r._id,
      testDate: r.testDate,
      ph: r.ph,
      oc: r.organicCarbon?.value,
      n: r.nitrogen?.value,
      p: r.phosphorus?.value,
      k: r.potassium?.value,
      ec: r.electricalConductivity?.value,
      overallStatus: r.overallHealthStatus || 'BALANCED',
    }));

    res.status(200).json({
      success: true,
      count: trends.length,
      data: { trends },
      trends,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to fetch soil trends' });
  }
};

export const getSoilReportById = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!isDatabaseConnected()) {
      res.status(503).json({ success: false, error: 'Database service is temporarily unavailable.' });
      return;
    }
    const { id } = req.params;
    const report = await SoilReport.findById(id);

    if (!report) {
      res.status(404).json({ success: false, error: 'Soil report not found' });
      return;
    }

    const interpretation = SoilHealthService.interpretSoilHealth({
      ph: report.ph,
      nitrogen: report.nitrogen,
      phosphorus: report.phosphorus,
      potassium: report.potassium,
      organicCarbon: report.organicCarbon,
      electricalConductivity: report.electricalConductivity,
      sulfur: report.sulfur,
      zinc: report.zinc,
      iron: report.iron,
      copper: report.copper,
      manganese: report.manganese,
      boron: report.boron,
      soilType: report.soilType,
      irrigationType: report.irrigationType,
    });

    res.status(200).json({
      success: true,
      report,
      interpretation,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to fetch soil report' });
  }
};

export const getSoilReportFile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { filename } = req.params;
    const filePath = path.join(process.cwd(), 'uploads', 'soil-reports', path.basename(filename));

    if (!fs.existsSync(filePath)) {
      res.status(404).json({ success: false, error: 'Report file not found.' });
      return;
    }

    res.sendFile(filePath);
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Failed to retrieve report file.' });
  }
};

export const deleteSoilReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await SoilReport.findByIdAndDelete(id);

    if (!deleted) {
      res.status(404).json({ success: false, error: 'Soil report not found' });
      return;
    }

    // Attempt to remove physical file if exists
    if (deleted.reportFile?.fileName) {
      const filePath = path.join(process.cwd(), 'uploads', 'soil-reports', deleted.reportFile.fileName);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (e) {
          console.warn('Could not delete physical report file:', e);
        }
      }
    }

    res.status(200).json({ success: true, message: 'Soil report deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to delete soil report' });
  }
};
