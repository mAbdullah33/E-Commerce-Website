const Cart = require('../models/Cart');
const Product = require('../models/Product');

const getCartIdentifier = (req) => {
  return req.user ? { user: req.user._id } : { sessionId: req.headers['x-session-id'] || 'guest' };
};

// @desc    Get cart
// @route   GET /api/cart
// @access  Public
exports.getCart = async (req, res) => {
  try {
    const identifier = getCartIdentifier(req);
    const cart = await Cart.findOne(identifier).populate('items.product', 'name images price inStock stock');

    if (!cart) {
      return res.json({ success: true, cart: { items: [], totalPrice: 0 } });
    }

    // Filter out unavailable products
    const validItems = cart.items.filter(item => item.product);
    if (validItems.length !== cart.items.length) {
      cart.items = validItems;
      await cart.save();
    }

    res.json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Public
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const identifier = getCartIdentifier(req);

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    if (!product.inStock) {
      return res.status(400).json({ success: false, message: 'Product is out of stock' });
    }

    let cart = await Cart.findOne(identifier);

    if (!cart) {
      cart = new Cart({ ...identifier, items: [] });
    }

    const existingItemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += Number(quantity);
    } else {
      cart.items.push({ product: productId, quantity: Number(quantity), price: product.price });
    }

    await cart.save();
    await cart.populate('items.product', 'name images price inStock');

    res.json({ success: true, message: 'Added to cart', cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/update
// @access  Public
exports.updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const identifier = getCartIdentifier(req);

    if (quantity < 1) {
      return res.status(400).json({ success: false, message: 'Quantity must be at least 1' });
    }

    const cart = await Cart.findOne(identifier);
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: 'Item not in cart' });
    }

    cart.items[itemIndex].quantity = Number(quantity);
    await cart.save();
    await cart.populate('items.product', 'name images price inStock');

    res.json({ success: true, message: 'Cart updated', cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:productId
// @access  Public
exports.removeFromCart = async (req, res) => {
  try {
    const identifier = getCartIdentifier(req);
    const cart = await Cart.findOne(identifier);

    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    cart.items = cart.items.filter(item => item.product.toString() !== req.params.productId);
    await cart.save();
    await cart.populate('items.product', 'name images price inStock');

    res.json({ success: true, message: 'Item removed from cart', cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart/clear
// @access  Public
exports.clearCart = async (req, res) => {
  try {
    const identifier = getCartIdentifier(req);
    await Cart.findOneAndDelete(identifier);
    res.json({ success: true, message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};