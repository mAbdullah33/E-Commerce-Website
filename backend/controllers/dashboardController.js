const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// @desc    Get dashboard stats
// @route   GET /api/dashboard/stats
// @access  Admin
exports.getDashboardStats = async (req, res) => {
  try {
    const [totalProducts, totalOrders, totalUsers, orders] = await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(),
      User.countDocuments({ role: 'user' }),
      Order.find().select('total status createdAt')
    ]);

    const totalRevenue = orders
      .filter(o => o.status === 'delivered')
      .reduce((sum, o) => sum + o.total, 0);

    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const processingOrders = orders.filter(o => o.status === 'processing').length;
    const deliveredOrders = orders.filter(o => o.status === 'delivered').length;

    // Monthly sales for chart (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlySales = await Order.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo }, status: { $ne: 'cancelled' } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          revenue: { $sum: '$total' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Low stock products
    const lowStockProducts = await Product.find({ stock: { $lte: 5, $gt: 0 } })
      .select('name stock category images')
      .limit(5);

    // Out of stock count
    const outOfStockCount = await Product.countDocuments({ inStock: false });

    res.json({
      success: true,
      stats: {
        totalProducts,
        totalOrders,
        totalUsers,
        totalRevenue,
        pendingOrders,
        processingOrders,
        deliveredOrders,
        outOfStockCount,
        monthlySales,
        lowStockProducts
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get most sold products
// @route   GET /api/dashboard/top-products
// @access  Admin
exports.getTopProducts = async (req, res) => {
  try {
    const topProducts = await Product.find()
      .sort({ sold: -1 })
      .limit(10)
      .select('name sold price images category');

    res.json({ success: true, topProducts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get sales by category
// @route   GET /api/dashboard/category-sales
// @access  Admin
exports.getCategorySales = async (req, res) => {
  try {
    const categorySales = await Order.aggregate([
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items.product',
          foreignField: '_id',
          as: 'productInfo'
        }
      },
      { $unwind: { path: '$productInfo', preserveNullAndEmpty: true } },
      {
        $group: {
          _id: '$productInfo.category',
          totalSold: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
        }
      }
    ]);

    res.json({ success: true, categorySales });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get recent orders
// @route   GET /api/dashboard/recent-orders
// @access  Admin
exports.getRecentOrders = async (req, res) => {
  try {
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('orderNumber customer.name total status createdAt items');

    res.json({ success: true, recentOrders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};