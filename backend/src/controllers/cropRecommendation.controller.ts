import { Request, Response } from 'express';
import { CropRecommendation } from '../models/CropRecommendation.js';
import { SoilReport } from '../models/SoilReport.js';
import { CropRecommendationService } from '../services/cropRecommendation.service.js';
import { isDatabaseConnected } from '../db/connection.js';

export const generateCropRecommendation = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      farmerId = 'default_farmer',
      farmId = 'default_farm',
      season = 'Kharif',
      irrigation = 'Rain-fed',
      previousCrop,
      currentCrop,
      landSize,
      state,
      district,
    } = req.body;

    let soil = req.body.soil;
    let location = req.body.location || { state, district };

    // Auto-fetch latest verified soil report if not explicitly provided
    if (!soil && isDatabaseConnected()) {
      const latestSoil = await SoilReport.findOne({
        $or: [{ farmerId: String(farmerId) }, { farmId: String(farmId) }],
        isVerified: true,
      }).sort({ testDate: -1, createdAt: -1 });

      if (latestSoil) {
        soil = {
          ph: latestSoil.ph,
          nitrogen: latestSoil.nitrogen,
          phosphorus: latestSoil.phosphorus,
          potassium: latestSoil.potassium,
          organicCarbon: latestSoil.organicCarbon,
          soilType: latestSoil.soilType,
        };
      }
    }

    const result = CropRecommendationService.generateRecommendations({
      season,
      irrigation,
      soil,
      location,
      previousCrop,
      currentCrop,
      landSize,
    });

    let savedDoc: any = null;
    if (isDatabaseConnected()) {
      // Store recommendation snapshot in DB
      const recDoc = new CropRecommendation({
        farmerId,
        farmId,
        season,
        inputSnapshot: {
          soil,
          location,
          season,
          irrigation,
          previousCrop,
          currentCrop,
          landSize,
        },
        recommendations: result.recommendations.map((r) => ({
          crop: r.crop,
          suitability: r.suitability,
          reasons: r.reasons,
          whyNot: r.whyNot,
        })),
        engineType: result.engineType,
      });

      savedDoc = await recDoc.save();
    }

    const responseData = {
      recommendationId: savedDoc?._id || `rec_local_${Date.now()}`,
      season: result.season,
      engineType: result.engineType,
      disclaimer: result.disclaimer,
      inputSnapshot: savedDoc?.inputSnapshot || { season, irrigation, soil, location },
      soilParameters: soil || null,
      recommendations: result.recommendations,
      createdAt: savedDoc?.createdAt || new Date().toISOString(),
    };

    res.status(201).json({
      success: true,
      data: responseData,
      ...responseData,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to generate crop recommendations' });
  }
};

export const getCropRecommendationsByFarm = async (req: Request, res: Response): Promise<void> => {
  try {
    const { farmId } = req.params;
    const history = await CropRecommendation.find({ farmId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: history.length,
      history,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to fetch recommendation history' });
  }
};

export const getCropRecommendationById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const item = await CropRecommendation.findById(id);

    if (!item) {
      res.status(404).json({ success: false, error: 'Crop recommendation session not found' });
      return;
    }

    res.status(200).json({
      success: true,
      recommendation: item,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to fetch crop recommendation' });
  }
};
