const Wishlist = require('../models/Wishlist');

const getIdentifier = (req) => {
  return req.user ? { user: req.user._id } : { sessionId: req.headers['x-session-id'] || 'guest' };
};

// @desc    Get wishlist
exports.getWishlist = async (req, res) => {
  try {
    const identifier = getIdentifier(req);
    const wishlist = await Wishlist.findOne(identifier).populate('products', 'name images price inStock category');

    if (!wishlist) {
      return res.json({ success: true, wishlist: { products: [] } });
    }
    res.json({ success: true, wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle product in wishlist
exports.toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const identifier = getIdentifier(req);

    let wishlist = await Wishlist.findOne(identifier);
    if (!wishlist) {
      wishlist = new Wishlist({ ...identifier, products: [] });
    }

    const index = wishlist.products.findIndex(p => p.toString() === productId);
    let action;

    if (index > -1) {
      wishlist.products.splice(index, 1);
      action = 'removed';
    } else {
      wishlist.products.push(productId);
      action = 'added';
    }

    await wishlist.save();
    await wishlist.populate('products', 'name images price inStock category');

    res.json({
      success: true,
      message: `Product ${action} from wishlist`,
      action,
      wishlist
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Remove from wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    const identifier = getIdentifier(req);
    const wishlist = await Wishlist.findOne(identifier);

    if (!wishlist) {
      return res.status(404).json({ success: false, message: 'Wishlist not found' });
    }

    wishlist.products = wishlist.products.filter(p => p.toString() !== req.params.productId);
    await wishlist.save();
    await wishlist.populate('products', 'name images price inStock category');

    res.json({ success: true, message: 'Removed from wishlist', wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};