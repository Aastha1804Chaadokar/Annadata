import { Request, Response } from 'express';

export const handleAssistantChat = async (req: Request, res: Response): Promise<void> => {
  try {
    const { message, farmerContext, language = 'Hindi' } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ success: false, error: 'Message text is required.' });
      return;
    }

    const cropName = farmerContext?.currentCrop || farmerContext?.mainCrop || 'Soybean';
    const village = farmerContext?.village || 'Sanwer';
    const district = farmerContext?.district || 'Indore';
    const soilPh = farmerContext?.soilPh || 6.8;

    const reply = `Annadata AI Response for ${cropName} (${village}, ${district}, pH ${soilPh}): Processing agricultural guidance for "${message}".`;

    res.status(200).json({
      success: true,
      messageId: `msg_${Date.now()}`,
      reply,
      farmerContextSummary: `${cropName} in ${village}, ${district} • pH ${soilPh}`,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to process AI assistant chat.' });
  }
};
