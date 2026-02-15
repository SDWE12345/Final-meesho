import dbConnect from '@/utils/mongodb';
import ZipCode from '@/models/ZipCode';
import { verifyToken } from '@/utils/auth';

export default async function handler(req, res) {
  await dbConnect();

  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const { search, page = 1, limit = 10, active } = req.query;
        
        let query = {};
        
        if (search) {
          query = {
            $or: [
              { zipCode: { $regex: search, $options: 'i' } },
              { city: { $regex: search, $options: 'i' } },
              { state: { $regex: search, $options: 'i' } }
            ]
          };
        }
        
        if (active !== undefined) {
          query.isActive = active === 'true';
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        const zipcodes = await ZipCode.find(query)
          .sort({ createdAt: -1 })
          .limit(parseInt(limit))
          .skip(skip);
        
        const total = await ZipCode.countDocuments(query);
        
        res.status(200).json({
          success: true,
          data: zipcodes,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / parseInt(limit))
          }
        });
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
      break;

    case 'POST':
      try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
          return res.status(401).json({ success: false, error: 'Unauthorized' });
        }

        const decoded = verifyToken(token);
        if (!decoded || !decoded.isAdmin) {
          return res.status(403).json({ success: false, error: 'Admin access required' });
        }

        const { zipCode, city, state, deliveryDays, codAvailable } = req.body;

        if (!zipCode || !city || !state) {
          return res.status(400).json({
            success: false,
            error: 'ZipCode, city, and state are required'
          });
        }

        const exists = await ZipCode.findOne({ zipCode });
        if (exists) {
          return res.status(400).json({
            success: false,
            error: 'Zip code already exists'
          });
        }

        const newZipCode = await ZipCode.create({
          zipCode,
          city,
          state,
          deliveryDays: deliveryDays || 5,
          codAvailable: codAvailable !== undefined ? codAvailable : true,
          isActive: true
        });

        res.status(201).json({ success: true, data: newZipCode });
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
      break;

    default:
      res.status(405).json({ success: false, error: 'Method not allowed' });
      break;
  }
}
