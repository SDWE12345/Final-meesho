  // pages/api/products/index.js
  import connectToDatabase from '../../../utils/mongodb';
  import Product from '../../../models/Product';
  import { requireAdmin } from '../../../utils/auth';

  connectToDatabase();

  async function handler(req, res) {
    const { method } = req;

    try {
      switch (method) {
        case 'GET':
          return await handleGet(req, res);
        
        case 'POST':
          return requireAdmin(handlePost)(req, res);
        
        default:
          return res.status(405).json({
            success: false,
            message: 'Method not allowed',
          });
      }
    } catch (error) {
      console.error('Products API error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }

  async function handleGet(req, res) {
    const {
      page = 1,
      limit = 20,
      search = '',
      category = '',
      sortBy = 'createdAt',
      order = 'desc',
      isActive,
      isFeatured,
    } = req.query;

    const query = {};
    
    // Search filter
    if (search) {
      query.$text = { $search: search };
    }
    
    // Category filter
    if (category) {
      query.category = category;
    }
    
    // Active filter
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }
    
    // Featured filter
    if (isFeatured !== undefined) {
      query.isFeatured = isFeatured === 'true';
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOrder = order === 'asc' ? 1 : -1;

    const [products, total] = await Promise.all([
      Product.find(query)
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Product.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      data: products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  }

  async function handlePost(req, res) {
    const {
      title,
      title2,
      description,
      features,
      color,
      size,
      storage,
      mrp,
      sellingPrice,
      images,
      mainImage,
      category,
      subCategory,
      brand,
      sku,
      stock,
      variants,
      displayOrder,
      isActive,
      isFeatured,
      tags,
    } = req.body;

    // Validation
    if (!title || !mrp || !sellingPrice) {
      return res.status(400).json({
        success: false,
        message: 'Title, MRP, and selling price are required',
      });
    }

    if (sellingPrice > mrp) {
      return res.status(400).json({
        success: false,
        message: 'Selling price cannot be greater than MRP',
      });
    }

    const product = new Product({
      title,
      title2: title2 || title,
      description,
      features,
      color,
      size,
      storage,
      mrp: parseFloat(mrp),
      sellingPrice: parseFloat(sellingPrice),
      images: images || [],
      mainImage: mainImage || (images && images[0]) || '',
      category,
      subCategory,
      brand,
      sku,
      stock: stock || 0,
      variants: variants || [],
      displayOrder: displayOrder || 0,
      isActive: isActive !== false,
      isFeatured: isFeatured || false,
      tags: tags || [],
    });

    const savedProduct = await product.save();

    return res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: savedProduct,
    });
  }

  export default handler;
