import { Request, Response } from 'express';
import { FarmerProfile } from '../models/FarmerProfile.js';
import { Farm } from '../models/Farm.js';
import { isDatabaseConnected } from '../db/connection.js';

export const saveFarmerProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!isDatabaseConnected()) {
      res.status(503).json({ success: false, error: 'Database service is temporarily unavailable.' });
      return;
    }
    const {
      farmerId = 'farmer_local',
      name,
      mobile,
      language = 'Hindi (हिन्दी)',
      channelPreference = 'Smartphone',
      state,
      district,
      village,
      landSize = '3.5',
      landUnit = 'Acres',
      mainCrop = 'Soybean (सोयाबीन)',
      currentCrop,
      irrigation = 'Rain-fed',
      farmingType = 'Small farmer',
      location,
    } = req.body;

    if (!name || !mobile || !state || !district || !village) {
      res.status(400).json({ success: false, error: 'Name, mobile, state, district, and village are required.' });
      return;
    }

    const farmId = `farm_${farmerId}`;

    // Upsert Farmer Profile
    const profile = await FarmerProfile.findOneAndUpdate(
      { farmerId },
      { farmerId, name, mobile, language, channelPreference },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Upsert Farm
    const farm = await Farm.findOneAndUpdate(
      { farmId },
      {
        farmId,
        farmerId,
        farmName: `${village} Farm`,
        state,
        district,
        village,
        landSize,
        landUnit,
        mainCrop,
        currentCrop,
        irrigation,
        farmingType,
        location,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({
      success: true,
      message: 'Farmer profile and farm created successfully',
      farmer: profile,
      farm,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to save farmer profile' });
  }
};

export const getFarmerProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!isDatabaseConnected()) {
      res.status(503).json({ success: false, error: 'Database service is temporarily unavailable.' });
      return;
    }
    const farmerId = req.query.farmerId as string || 'farmer_local';
    const farmId = `farm_${farmerId}`;

    const profile = await FarmerProfile.findOne({ farmerId });
    const farm = await Farm.findOne({ farmId });

    if (!profile || !farm) {
      res.status(404).json({ success: false, error: 'Farmer profile not found' });
      return;
    }

    res.status(200).json({
      success: true,
      farmer: profile,
      farm,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to fetch farmer profile' });
  }
};

export const updateFarmProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!isDatabaseConnected()) {
      res.status(503).json({ success: false, error: 'Database service is temporarily unavailable.' });
      return;
    }
    const farmerId = req.body.farmerId || 'farmer_local';
    const farmId = `farm_${farmerId}`;

    const { name, mobile, language, channelPreference, ...farmUpdates } = req.body;

    let profile;
    if (name || mobile || language || channelPreference) {
      profile = await FarmerProfile.findOneAndUpdate(
        { farmerId },
        { ...(name && { name }), ...(mobile && { mobile }), ...(language && { language }), ...(channelPreference && { channelPreference }) },
        { new: true }
      );
    } else {
      profile = await FarmerProfile.findOne({ farmerId });
    }

    const farm = await Farm.findOneAndUpdate({ farmId }, farmUpdates, { new: true });

    res.status(200).json({
      success: true,
      message: 'Farm profile updated successfully',
      farmer: profile,
      farm,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to update farm profile' });
  }
};
