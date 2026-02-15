import dbConnect from '@/utils/mongodb';
import ZipCode from '@/models/ZipCode';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  await dbConnect();

  try {
    const { zipCode } = req.body;

    if (!zipCode) {
      return res.status(400).json({
        success: false,
        error: 'Zip code is required'
      });
    }

    const zipData = await ZipCode.findOne({ 
      zipCode: zipCode.toString(),
      isActive: true 
    });

    if (!zipData) {
      return res.status(404).json({
        success: false,
        error: 'Service not available in this area',
        available: false
      });
    }

    res.status(200).json({
      success: true,
      available: true,
      data: {
        zipCode: zipData.zipCode,
        city: zipData.city,
        state: zipData.state,
        deliveryDays: zipData.deliveryDays,
        codAvailable: zipData.codAvailable,
        estimatedDelivery: new Date(Date.now() + zipData.deliveryDays * 24 * 60 * 60 * 1000).toLocaleDateString()
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
