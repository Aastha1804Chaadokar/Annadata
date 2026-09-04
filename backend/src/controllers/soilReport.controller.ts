import { Request, Response } from 'express';
import { SoilReport } from '../models/SoilReport.js';
import { SoilHealthService } from '../services/soilHealth.service.js';
import { isDatabaseConnected } from '../db/connection.js';

export const createSoilReport = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!isDatabaseConnected()) {
      res.status(503).json({ success: false, error: 'Database service is temporarily unavailable.' });
      return;
    }
    const {
      farmerId = 'default_farmer',
      farmId = 'default_farm',
      ph,
      nitrogen,
      phosphorus,
      potassium,
      organicCarbon,
      electricalConductivity,
      soilType = 'Unknown',
      irrigationType = 'Rain-fed',
      testDate,
      source = 'manual_entry',
      reportFile,
      units,
    } = req.body;

    // Basic Input Validations
    if (ph === undefined || ph === null || isNaN(ph) || ph < 0 || ph > 14) {
      res.status(400).json({ error: 'Valid pH between 0 and 14 is required.' });
      return;
    }

    if (!nitrogen || nitrogen.value === undefined || isNaN(nitrogen.value)) {
      res.status(400).json({ error: 'Nitrogen value and unit are required.' });
      return;
    }

    if (!phosphorus || phosphorus.value === undefined || isNaN(phosphorus.value)) {
      res.status(400).json({ error: 'Phosphorus value and unit are required.' });
      return;
    }

    if (!potassium || potassium.value === undefined || isNaN(potassium.value)) {
      res.status(400).json({ error: 'Potassium value and unit are required.' });
      return;
    }

    if (!organicCarbon || organicCarbon.value === undefined || isNaN(organicCarbon.value)) {
      res.status(400).json({ error: 'Organic Carbon value and unit are required.' });
      return;
    }

    const report = new SoilReport({
      farmerId,
      farmId,
      ph: Number(ph),
      nitrogen: { value: Number(nitrogen.value), unit: String(nitrogen.unit || 'kg/ha') },
      phosphorus: { value: Number(phosphorus.value), unit: String(phosphorus.unit || 'kg/ha') },
      potassium: { value: Number(potassium.value), unit: String(potassium.unit || 'kg/ha') },
      organicCarbon: { value: Number(organicCarbon.value), unit: String(organicCarbon.unit || '%') },
      electricalConductivity: electricalConductivity
        ? { value: Number(electricalConductivity.value), unit: String(electricalConductivity.unit || 'dS/m') }
        : undefined,
      soilType,
      irrigationType,
      testDate: testDate ? new Date(testDate) : new Date(),
      source,
      reportFile: reportFile || { storageStatus: 'File storage integration pending' },
      units: units || { N: nitrogen.unit, P: phosphorus.unit, K: potassium.unit, OC: organicCarbon.unit },
    });

    const savedReport = await report.save();

    // Interpret soil health
    const interpretation = SoilHealthService.interpretSoilHealth({
      ph: savedReport.ph,
      nitrogen: savedReport.nitrogen,
      phosphorus: savedReport.phosphorus,
      potassium: savedReport.potassium,
      organicCarbon: savedReport.organicCarbon,
      electricalConductivity: savedReport.electricalConductivity,
      soilType: savedReport.soilType,
      irrigationType: savedReport.irrigationType,
    });

    res.status(201).json({
      success: true,
      report: savedReport,
      interpretation,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to create soil report' });
  }
};

export const getSoilReportsByFarm = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!isDatabaseConnected()) {
      res.status(503).json({ success: false, error: 'Database service is temporarily unavailable.' });
      return;
    }
    const { farmId } = req.params;
    const reports = await SoilReport.find({ farmId }).sort({ testDate: -1, createdAt: -1 });

    const reportsWithInterpretation = reports.map((rep) => {
      const interpretation = SoilHealthService.interpretSoilHealth({
        ph: rep.ph,
        nitrogen: rep.nitrogen,
        phosphorus: rep.phosphorus,
        potassium: rep.potassium,
        organicCarbon: rep.organicCarbon,
        electricalConductivity: rep.electricalConductivity,
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
      reports: reportsWithInterpretation,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to fetch soil reports' });
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

export const deleteSoilReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await SoilReport.findByIdAndDelete(id);

    if (!deleted) {
      res.status(404).json({ success: false, error: 'Soil report not found' });
      return;
    }

    res.status(200).json({ success: true, message: 'Soil report deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to delete soil report' });
  }
};
