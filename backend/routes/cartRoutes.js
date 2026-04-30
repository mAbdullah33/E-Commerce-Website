const express = require('express');
const router = express.Router();
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} = require('../controllers/cartController');
const { optionalAuth } = require('../middleware/auth');

// All cart routes use optional auth (supports guest + logged-in users)
router.use(optionalAuth);

router.get('/', getCart);
router.post('/add', addToCart);
router.put('/update', updateCartItem);
router.delete('/clear', clearCart);
router.delete('/remove/:productId', removeFromCart);

module.exports = router;