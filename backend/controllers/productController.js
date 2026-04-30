const Product = require('../models/Product');
const { cloudinary } = require('../config/cloudinary');

// @desc    Get all products with filters
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
  try {
    const {
      category,
      inStock,
      isNewDesign,
      isHotSale,
      isFeatured,
      minPrice,
      maxPrice,
      sort,
      page = 1,
      limit = 12,
      search
    } = req.query;

    const query = {};

    // Filters
    if (category) query.category = category;
    if (inStock !== undefined) query.inStock = inStock === 'true';
    if (isNewDesign !== undefined) query.isNewDesign = isNewDesign === 'true';
    if (isHotSale !== undefined) query.isHotSale = isHotSale === 'true';
    if (isFeatured !== undefined) query.isFeatured = isFeatured === 'true';

    // Price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Text search
    if (search) {
      query.$text = { $search: search };
    }

    // Sorting
    let sortOption = { createdAt: -1 }; // Default: newest first
    if (sort === 'price_asc') sortOption = { price: 1 };
    else if (sort === 'price_desc') sortOption = { price: -1 };
    else if (sort === 'popular') sortOption = { sold: -1 };
    else if (sort === 'rating') sortOption = { 'ratings.average': -1 };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments(query);

    const products = await Product.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit))
      .lean();

    res.json({
      success: true,
      count: products.length,
      total,
      pages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      products
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get product by slug
// @route   GET /api/products/slug/:slug
// @access  Public
exports.getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create product (Admin)
// @route   POST /api/products
// @access  Admin
exports.createProduct = async (req, res) => {
  try {
    const {
      name, description, price, originalPrice, category,
      stock, isNewDesign, isFeatured, isHotSale, specifications, tags
    } = req.body;

    // Handle uploaded images
    const images = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        images.push({ url: file.path, publicId: file.filename });
      });
    }

    // Handle base64 images (from JSON body)
    if (req.body.images && Array.isArray(req.body.images)) {
      for (const imgData of req.body.images) {
        if (imgData.startsWith('data:image')) {
          const uploaded = await cloudinary.uploader.upload(imgData, {
            folder: 'pvc-panels',
            transformation: [{ width: 800, height: 800, crop: 'limit', quality: 'auto' }]
          });
          images.push({ url: uploaded.secure_url, publicId: uploaded.public_id });
        } else if (imgData.url) {
          images.push(imgData);
        }
      }
    }

    const product = await Product.create({
      name, description, price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      category, stock: Number(stock) || 0,
      isNewDesign: isNewDesign === 'true' || isNewDesign === true,
      isFeatured: isFeatured === 'true' || isFeatured === true,
      isHotSale: isHotSale === 'true' || isHotSale === true,
      images,
      specifications: specifications ? JSON.parse(typeof specifications === 'string' ? specifications : JSON.stringify(specifications)) : {},
      tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim())) : []
    });

    res.status(201).json({ success: true, message: 'Product created successfully', product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update product (Admin)
// @route   PUT /api/products/:id
// @access  Admin
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const updateData = { ...req.body };

    // Handle new image uploads
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => ({
        url: file.path,
        publicId: file.filename
      }));
      updateData.images = [...(product.images || []), ...newImages];
    }

    // Handle base64 image uploads
    if (req.body.newImages && Array.isArray(req.body.newImages)) {
      const uploadedImages = [];
      for (const imgData of req.body.newImages) {
        if (imgData.startsWith('data:image')) {
          const uploaded = await cloudinary.uploader.upload(imgData, {
            folder: 'pvc-panels'
          });
          uploadedImages.push({ url: uploaded.secure_url, publicId: uploaded.public_id });
        }
      }
      updateData.images = [...(product.images || []), ...uploadedImages];
      delete updateData.newImages;
    }

    if (updateData.price) updateData.price = Number(updateData.price);
    if (updateData.stock !== undefined) updateData.stock = Number(updateData.stock);

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({ success: true, message: 'Product updated', product: updatedProduct });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete product (Admin)
// @route   DELETE /api/products/:id
// @access  Admin
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Delete images from Cloudinary
    for (const image of product.images) {
      if (image.publicId) {
        await cloudinary.uploader.destroy(image.publicId).catch(console.error);
      }
    }

    await product.deleteOne();
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete product image
// @route   DELETE /api/products/:id/image/:publicId
// @access  Admin
exports.deleteProductImage = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const publicId = decodeURIComponent(req.params.publicId);
    await cloudinary.uploader.destroy(publicId).catch(console.error);

    product.images = product.images.filter(img => img.publicId !== publicId);
    await product.save();

    res.json({ success: true, message: 'Image deleted', product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get featured/popular products
// @route   GET /api/products/featured
// @access  Public
exports.getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ isFeatured: true }).limit(8).lean();
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get hot sale products
// @route   GET /api/products/hot-sale
// @access  Public
exports.getHotSaleProducts = async (req, res) => {
  try {
    const products = await Product.find({ isHotSale: true }).limit(12).lean();
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};