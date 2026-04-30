const express = require('express');
const router = express.Router();
const {
  getWishlist,
  toggleWishlist,
  removeFromWishlist
} = require('../controllers/wishlistController');
const { optionalAuth } = require('../middleware/auth');

router.use(optionalAuth);

router.get('/', getWishlist);
router.post('/toggle', toggleWishlist);
router.delete('/remove/:productId', removeFromWishlist);

module.exports = router;