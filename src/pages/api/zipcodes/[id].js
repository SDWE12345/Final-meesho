import dbConnect from '@/utils/mongodb';
import ZipCode from '@/models/ZipCode';
import { verifyToken } from '@/utils/auth';

export default async function handler(req, res) {
  await dbConnect();

  const { method } = req;
  const { id } = req.query;

  // Verify admin for all operations except GET
  if (method !== 'GET') {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const decoded = verifyToken(token);
    if (!decoded || !decoded.isAdmin) {
      return res.status(403).json({ success: false, error: 'Admin access required' });
    }
  }

  switch (method) {
    case 'GET':
      try {
        const zipcode = await ZipCode.findById(id);
        if (!zipcode) {
          return res.status(404).json({ success: false, error: 'Zip code not found' });
        }
        res.status(200).json({ success: true, data: zipcode });
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
      break;

    case 'PUT':
      try {
        const { zipCode, city, state, deliveryDays, codAvailable, isActive } = req.body;

        const updateData = {};
        if (zipCode) updateData.zipCode = zipCode;
        if (city) updateData.city = city;
        if (state) updateData.state = state;
        if (deliveryDays) updateData.deliveryDays = deliveryDays;
        if (codAvailable !== undefined) updateData.codAvailable = codAvailable;
        if (isActive !== undefined) updateData.isActive = isActive;

        const updatedZipCode = await ZipCode.findByIdAndUpdate(
          id,
          updateData,
          { new: true, runValidators: true }
        );

        if (!updatedZipCode) {
          return res.status(404).json({ success: false, error: 'Zip code not found' });
        }

        res.status(200).json({ success: true, data: updatedZipCode });
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
      break;

    case 'DELETE':
      try {
        const deletedZipCode = await ZipCode.findByIdAndDelete(id);
        if (!deletedZipCode) {
          return res.status(404).json({ success: false, error: 'Zip code not found' });
        }
        res.status(200).json({ success: true, message: 'Zip code deleted successfully' });
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
      break;

    default:
      res.status(405).json({ success: false, error: 'Method not allowed' });
      break;
  }
}
