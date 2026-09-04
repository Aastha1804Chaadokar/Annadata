import { Request, Response } from 'express';
import { CropRecommendation } from '../models/CropRecommendation.js';
import { CropRecommendationService } from '../services/cropRecommendation.service.js';
import { isDatabaseConnected } from '../db/connection.js';

export const generateCropRecommendation = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      farmerId = 'default_farmer',
      farmId = 'default_farm',
      season = 'Kharif',
      irrigation = 'Rain-fed',
      soil,
      location,
      previousCrop,
      currentCrop,
      landSize,
    } = req.body;

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

    res.status(201).json({
      success: true,
      recommendationId: savedDoc?._id || `rec_local_${Date.now()}`,
      season: result.season,
      engineType: result.engineType,
      disclaimer: result.disclaimer,
      inputSnapshot: savedDoc?.inputSnapshot || { season, irrigation, soil, location },
      recommendations: result.recommendations,
      createdAt: savedDoc?.createdAt || new Date().toISOString(),
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
