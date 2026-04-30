const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getTopProducts,
  getCategorySales,
  getRecentOrders
} = require('../controllers/dashboardController');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect, adminOnly);

router.get('/stats', getDashboardStats);
router.get('/top-products', getTopProducts);
router.get('/category-sales', getCategorySales);
router.get('/recent-orders', getRecentOrders);

module.exports = router;