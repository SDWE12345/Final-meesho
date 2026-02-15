import dbConnect from '@/utils/mongodb';
import ZipCode from '@/models/ZipCode';
import { verifyToken } from '@/utils/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  await dbConnect();

  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  const decoded = verifyToken(token);
  if (!decoded || !decoded.isAdmin) {
    return res.status(403).json({ success: false, error: 'Admin access required' });
  }

  try {
    const { action, zipcodes } = req.body;

    if (!action || !zipcodes || !Array.isArray(zipcodes)) {
      return res.status(400).json({
        success: false,
        error: 'Action and zipcodes array are required'
      });
    }

    let result;

    switch (action) {
      case 'create':
        const created = [];
        const errors = [];

        for (const zip of zipcodes) {
          try {
            const exists = await ZipCode.findOne({ zipCode: zip.zipCode });
            if (exists) {
              errors.push({ zipCode: zip.zipCode, error: 'Already exists' });
              continue;
            }

            const newZip = await ZipCode.create({
              zipCode: zip.zipCode,
              city: zip.city,
              state: zip.state,
              deliveryDays: zip.deliveryDays || 5,
              codAvailable: zip.codAvailable !== undefined ? zip.codAvailable : true,
              isActive: true
            });
            created.push(newZip);
          } catch (err) {
            errors.push({ zipCode: zip.zipCode, error: err.message });
          }
        }

        result = { created: created.length, errors };
        break;

      case 'activate':
        result = await ZipCode.updateMany(
          { zipCode: { $in: zipcodes } },
          { $set: { isActive: true } }
        );
        break;

      case 'deactivate':
        result = await ZipCode.updateMany(
          { zipCode: { $in: zipcodes } },
          { $set: { isActive: false } }
        );
        break;

      case 'delete':
        result = await ZipCode.deleteMany({ zipCode: { $in: zipcodes } });
        break;

      default:
        return res.status(400).json({
          success: false,
          error: 'Invalid action. Must be one of: create, activate, deactivate, delete'
        });
    }

    res.status(200).json({
      success: true,
      action,
      result
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
