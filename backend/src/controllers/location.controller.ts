import { Request, Response } from 'express';
import { reverseGeocodeCoordinates } from '../services/location.service.js';

export async function handleReverseGeocode(req: Request, res: Response) {
  try {
    const latStr = req.query.lat as string;
    const lngStr = req.query.lng as string;
    const accuracyStr = req.query.accuracy as string;

    if (!latStr || !lngStr) {
      return res.status(400).json({
        success: false,
        error: 'Latitude and Longitude parameters are required.',
      });
    }

    const latitude = parseFloat(latStr);
    const longitude = parseFloat(lngStr);
    const accuracy = accuracyStr ? parseFloat(accuracyStr) : undefined;

    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid numeric latitude or longitude value.',
      });
    }

    const locationData = await reverseGeocodeCoordinates(latitude, longitude, accuracy);

    return res.status(200).json({
      success: true,
      data: locationData,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Location reverse geocoding failed.',
    });
  }
}
