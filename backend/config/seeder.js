const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

// Load models
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Wishlist = require('../models/Wishlist');
const Contact = require('../models/Contact');

// ─── Placeholder image URLs (Picsum, always available) ────────────────────────
const makePanelImgs = (ids) =>
  ids.map((id) => ({
    url: `https://picsum.photos/seed/${id}/800/800`,
    publicId: `seed-${id}`
  }));

// ─── Seed Data ─────────────────────────────────────────────────────────────────
const adminUser = {
  name: 'Admin',
  email: process.env.ADMIN_EMAIL || 'admin@pvcpanels.com',
  password: process.env.ADMIN_PASSWORD || 'Admin@123456',
  role: 'admin',
  phone: '+92-300-0000000'
};

const products = [
  // ── PVC PANELS ──────────────────────────────────────────────────────────────
  {
    name: '3D Marble White PVC Wall Panel',
    description:
      'Elegant 3D marble texture PVC wall panel. Waterproof, easy to install, and gives your walls a luxurious marble finish without the high cost. Perfect for living rooms, bedrooms, and feature walls.',
    price: 1200,
    originalPrice: 1500,
    category: 'PVC Panel',
    stock: 150,
    isNewDesign: false,
    isFeatured: true,
    isHotSale: true,
    specifications: { size: '60cm x 60cm', thickness: '8mm', material: 'PVC', finish: 'Glossy', color: 'White', pattern: 'Marble' },
    tags: ['marble', 'white', '3d', 'glossy', 'luxury'],
    sold: 320,
    images: makePanelImgs(['pvc-marble-white', 'pvc-marble-white-2'])
  },
  {
    name: 'Geometric Diamond PVC Panel – Gold',
    description:
      'Stunning geometric diamond pattern in warm gold tones. This premium PVC panel adds a contemporary and stylish accent to any interior space. Moisture-resistant and scratch-proof.',
    price: 1450,
    originalPrice: 1800,
    category: 'PVC Panel',
    stock: 90,
    isNewDesign: true,
    isFeatured: true,
    isHotSale: true,
    specifications: { size: '60cm x 60cm', thickness: '9mm', material: 'PVC', finish: 'Metallic', color: 'Gold', pattern: 'Geometric' },
    tags: ['geometric', 'gold', 'diamond', 'metallic', 'modern'],
    sold: 210,
    images: makePanelImgs(['pvc-gold-geo', 'pvc-gold-geo-2'])
  },
  {
    name: 'Wood Grain Oak PVC Panel',
    description:
      'Natural oak wood grain texture at a fraction of the cost of real wood. UV-resistant, moisture-proof and easy to clean. Suitable for feature walls, ceilings, and commercial spaces.',
    price: 980,
    originalPrice: 1200,
    category: 'PVC Panel',
    stock: 200,
    isNewDesign: false,
    isFeatured: true,
    isHotSale: false,
    specifications: { size: '20cm x 300cm', thickness: '7mm', material: 'PVC', finish: 'Matte', color: 'Oak Brown', pattern: 'Wood Grain' },
    tags: ['wood', 'oak', 'natural', 'matte', 'ceiling'],
    sold: 185,
    images: makePanelImgs(['pvc-wood-oak', 'pvc-wood-oak-2'])
  },
  {
    name: 'Floral Embossed PVC Panel – Cream',
    description:
      'Beautiful floral embossed design in a soft cream colour. Adds elegance and warmth to bedrooms and living areas. 100% waterproof and fire-retardant grade B1.',
    price: 1100,
    originalPrice: 1350,
    category: 'PVC Panel',
    stock: 120,
    isNewDesign: true,
    isFeatured: false,
    isHotSale: false,
    specifications: { size: '60cm x 60cm', thickness: '8mm', material: 'PVC', finish: 'Satin', color: 'Cream', pattern: 'Floral' },
    tags: ['floral', 'cream', 'embossed', 'bedroom', 'elegant'],
    sold: 98,
    images: makePanelImgs(['pvc-floral-cream', 'pvc-floral-cream-2'])
  },
  {
    name: 'Brick Texture PVC Panel – Red',
    description:
      'Realistic brick texture PVC panel perfect for creating an industrial loft aesthetic. Lightweight, easy to install, and no plastering required.',
    price: 850,
    originalPrice: 1050,
    category: 'PVC Panel',
    stock: 175,
    isNewDesign: false,
    isFeatured: false,
    isHotSale: true,
    specifications: { size: '60cm x 120cm', thickness: '10mm', material: 'PVC', finish: 'Textured', color: 'Red Brick', pattern: 'Brick' },
    tags: ['brick', 'industrial', 'red', 'loft', 'textured'],
    sold: 267,
    images: makePanelImgs(['pvc-brick-red', 'pvc-brick-red-2'])
  },
  {
    name: 'Hexagon 3D PVC Panel – Silver',
    description:
      'Modern hexagon 3D design in a sleek silver finish. Creates a stunning feature wall effect. Ideal for offices, lobbies, and contemporary homes.',
    price: 1600,
    originalPrice: 2000,
    category: 'PVC Panel',
    stock: 60,
    isNewDesign: true,
    isFeatured: true,
    isHotSale: true,
    specifications: { size: '60cm x 60cm', thickness: '12mm', material: 'PVC', finish: 'Metallic Silver', color: 'Silver', pattern: 'Hexagon 3D' },
    tags: ['hexagon', '3d', 'silver', 'modern', 'office'],
    sold: 143,
    images: makePanelImgs(['pvc-hex-silver', 'pvc-hex-silver-2'])
  },
  {
    name: 'Abstract Wave PVC Panel – Grey',
    description:
      'Contemporary abstract wave design in cool grey. Low-maintenance, moisture-resistant surface perfect for bathrooms and kitchens as well as living spaces.',
    price: 1050,
    originalPrice: 1300,
    category: 'PVC Panel',
    stock: 130,
    isNewDesign: true,
    isFeatured: false,
    isHotSale: false,
    specifications: { size: '60cm x 60cm', thickness: '8mm', material: 'PVC', finish: 'Semi-Gloss', color: 'Grey', pattern: 'Abstract Wave' },
    tags: ['wave', 'grey', 'abstract', 'bathroom', 'kitchen'],
    sold: 77,
    images: makePanelImgs(['pvc-wave-grey', 'pvc-wave-grey-2'])
  },
  {
    name: 'Classic White Gloss PVC Panel',
    description:
      'Timeless plain white high-gloss PVC panel. A versatile choice for any room. Reflects light beautifully to make spaces feel larger and brighter.',
    price: 700,
    originalPrice: 900,
    category: 'PVC Panel',
    stock: 300,
    isNewDesign: false,
    isFeatured: false,
    isHotSale: false,
    specifications: { size: '20cm x 300cm', thickness: '7mm', material: 'PVC', finish: 'High Gloss', color: 'White', pattern: 'Plain' },
    tags: ['white', 'plain', 'gloss', 'classic', 'ceiling'],
    sold: 412,
    images: makePanelImgs(['pvc-white-plain', 'pvc-white-plain-2'])
  },
  {
    name: 'Tropical Palm Leaf PVC Panel',
    description:
      'Bold tropical palm leaf print PVC wall panel. Makes a stunning statement in living rooms, cafes, and hospitality interiors. Eco-friendly production.',
    price: 1300,
    originalPrice: 1600,
    category: 'PVC Panel',
    stock: 85,
    isNewDesign: true,
    isFeatured: true,
    isHotSale: false,
    specifications: { size: '60cm x 60cm', thickness: '8mm', material: 'PVC', finish: 'Satin', color: 'Green/White', pattern: 'Tropical' },
    tags: ['tropical', 'palm', 'green', 'bold', 'cafe'],
    sold: 56,
    images: makePanelImgs(['pvc-tropical', 'pvc-tropical-2'])
  },
  {
    name: 'Chevron Pattern PVC Panel – Black & White',
    description:
      'Bold black and white chevron (herringbone) pattern PVC panel. Extremely popular for feature walls in modern homes, restaurants and retail stores.',
    price: 1150,
    originalPrice: 1400,
    category: 'PVC Panel',
    stock: 110,
    isNewDesign: false,
    isFeatured: false,
    isHotSale: true,
    specifications: { size: '60cm x 60cm', thickness: '8mm', material: 'PVC', finish: 'Matte', color: 'Black & White', pattern: 'Chevron' },
    tags: ['chevron', 'herringbone', 'black', 'white', 'bold'],
    sold: 189,
    images: makePanelImgs(['pvc-chevron-bw', 'pvc-chevron-bw-2'])
  },
  // ── HARD PANELS ─────────────────────────────────────────────────────────────
  {
    name: 'Premium WPC Hard Panel – Walnut',
    description:
      'High-density Wood Plastic Composite (WPC) hard panel in walnut finish. Extremely durable, waterproof and ideal for high-traffic areas, commercial spaces, and wet rooms.',
    price: 2200,
    originalPrice: 2700,
    category: 'Hard Panel',
    stock: 70,
    isNewDesign: false,
    isFeatured: true,
    isHotSale: true,
    specifications: { size: '30cm x 180cm', thickness: '15mm', material: 'WPC', finish: 'Wood Texture', color: 'Walnut Brown', pattern: 'Wood Grain' },
    tags: ['wpc', 'walnut', 'hard', 'commercial', 'durable'],
    sold: 134,
    images: makePanelImgs(['hard-wpc-walnut', 'hard-wpc-walnut-2'])
  },
  {
    name: 'Solid Grey Concrete Hard Panel',
    description:
      'Industrial concrete-look hard panel. Incredibly durable surface suitable for feature walls, flooring underlay, and commercial cladding. Fire rated Class A.',
    price: 2800,
    originalPrice: 3200,
    category: 'Hard Panel',
    stock: 45,
    isNewDesign: true,
    isFeatured: true,
    isHotSale: false,
    specifications: { size: '60cm x 120cm', thickness: '18mm', material: 'Fiber Cement', finish: 'Concrete Texture', color: 'Charcoal Grey', pattern: 'Concrete' },
    tags: ['concrete', 'grey', 'industrial', 'fire-rated', 'commercial'],
    sold: 89,
    images: makePanelImgs(['hard-concrete-grey', 'hard-concrete-grey-2'])
  },
  {
    name: 'Black Gloss Hard Panel',
    description:
      'Sophisticated high-gloss black hard panel. Delivers a premium finish for luxury residential and commercial interiors. Scratch-resistant coating.',
    price: 3100,
    originalPrice: 3800,
    category: 'Hard Panel',
    stock: 35,
    isNewDesign: true,
    isFeatured: true,
    isHotSale: true,
    specifications: { size: '60cm x 120cm', thickness: '16mm', material: 'HDF', finish: 'High Gloss', color: 'Jet Black', pattern: 'Plain' },
    tags: ['black', 'gloss', 'luxury', 'hdf', 'premium'],
    sold: 62,
    images: makePanelImgs(['hard-black-gloss', 'hard-black-gloss-2'])
  },
  {
    name: 'Beige Travertine Hard Panel',
    description:
      'Classic travertine stone look hard panel in warm beige. Gives the feel of natural stone at a much lower weight and cost. Perfect for bathrooms and feature walls.',
    price: 2500,
    originalPrice: 3000,
    category: 'Hard Panel',
    stock: 55,
    isNewDesign: false,
    isFeatured: false,
    isHotSale: false,
    specifications: { size: '60cm x 120cm', thickness: '15mm', material: 'Calcium Silicate', finish: 'Stone Texture', color: 'Beige', pattern: 'Travertine' },
    tags: ['travertine', 'stone', 'beige', 'bathroom', 'classic'],
    sold: 48,
    images: makePanelImgs(['hard-travertine-beige', 'hard-travertine-beige-2'])
  },
  {
    name: 'Marine Ply Veneer Hard Panel – Teak',
    description:
      'Marine-grade plywood with real teak veneer surface. Suitable for exterior cladding, boat interiors and damp environments. Pre-oiled finish included.',
    price: 3500,
    originalPrice: 4200,
    category: 'Hard Panel',
    stock: 25,
    isNewDesign: false,
    isFeatured: false,
    isHotSale: false,
    specifications: { size: '120cm x 240cm', thickness: '18mm', material: 'Marine Ply + Teak Veneer', finish: 'Oiled', color: 'Teak', pattern: 'Wood Grain' },
    tags: ['teak', 'veneer', 'marine', 'exterior', 'plywood'],
    sold: 31,
    images: makePanelImgs(['hard-teak-veneer', 'hard-teak-veneer-2'])
  },
  // ── ACCESSORIES ─────────────────────────────────────────────────────────────
  {
    name: 'PVC Panel Adhesive – 500ml',
    description:
      'High-strength specially formulated adhesive for PVC and WPC panels. One tube covers approximately 4–6 square meters. Waterproof and temperature-resistant.',
    price: 350,
    originalPrice: 420,
    category: 'Accessories',
    stock: 500,
    isNewDesign: false,
    isFeatured: false,
    isHotSale: false,
    specifications: { size: '500ml tube', material: 'Polymer Adhesive' },
    tags: ['adhesive', 'glue', 'installation', 'accessories'],
    sold: 620,
    images: makePanelImgs(['acc-adhesive', 'acc-adhesive-2'])
  },
  {
    name: 'PVC Panel Trim / Edge Strip – White (2m)',
    description:
      'Finishing trim/edge strip to give a clean professional look to PVC panel installations. Matches standard white PVC panels. Sold per 2-metre length.',
    price: 180,
    originalPrice: 220,
    category: 'Accessories',
    stock: 400,
    isNewDesign: false,
    isFeatured: false,
    isHotSale: false,
    specifications: { size: '2m length', material: 'PVC', color: 'White' },
    tags: ['trim', 'edge', 'finishing', 'white', 'accessories'],
    sold: 890,
    images: makePanelImgs(['acc-trim-white', 'acc-trim-white-2'])
  }
];

// ─── Sample Orders ─────────────────────────────────────────────────────────────
const sampleOrders = [
  {
    customer: { name: 'Ahmed Khan', email: 'ahmed@example.com', phone: '+92-300-1234567', address: { street: '45 Model Town', city: 'Lahore', state: 'Punjab', postalCode: '54000', country: 'Pakistan' } },
    subtotal: 5800, shippingCost: 0, total: 5800,
    status: 'delivered', paymentMethod: 'COD', paymentStatus: 'paid',
    statusHistory: [{ status: 'delivered', note: 'Delivered successfully' }]
  },
  {
    customer: { name: 'Sara Malik', email: 'sara@example.com', phone: '+92-321-9876543', address: { street: '12 DHA Phase 5', city: 'Karachi', state: 'Sindh', postalCode: '75500', country: 'Pakistan' } },
    subtotal: 3200, shippingCost: 200, total: 3400,
    status: 'processing', paymentMethod: 'bank_transfer', paymentStatus: 'paid',
    statusHistory: [{ status: 'processing', note: 'Payment confirmed, processing order' }]
  },
  {
    customer: { name: 'Usman Ali', email: 'usman@example.com', phone: '+92-333-5551234', address: { street: '8 F-7/2', city: 'Islamabad', state: 'ICT', postalCode: '44000', country: 'Pakistan' } },
    subtotal: 8400, shippingCost: 0, total: 8400,
    status: 'pending', paymentMethod: 'COD', paymentStatus: 'pending',
    statusHistory: [{ status: 'pending', note: 'Order placed' }]
  },
  {
    customer: { name: 'Fatima Zahra', email: 'fatima@example.com', phone: '+92-311-7778888', address: { street: '33 Gulberg III', city: 'Lahore', state: 'Punjab', postalCode: '54660', country: 'Pakistan' } },
    subtotal: 6500, shippingCost: 0, total: 6500,
    status: 'shipped', paymentMethod: 'COD', paymentStatus: 'pending',
    statusHistory: [{ status: 'shipped', note: 'Dispatched via TCS courier' }]
  }
];

// ─── Import Function ────────────────────────────────────────────────────────────
const importData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');

    // Clear existing data
    await User.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();
    await Cart.deleteMany();
    await Wishlist.deleteMany();
    await Contact.deleteMany();
    console.log('🗑️  Cleared existing data');

    // Create admin user (password hashing handled by model pre-save hook)
    const createdAdmin = await User.create(adminUser);
    console.log(`👤 Admin created: ${createdAdmin.email}`);

    // Create a regular test user
    await User.create({
      name: 'Test User',
      email: 'user@pvcpanels.com',
      password: 'User@123456',
      role: 'user',
      phone: '+92-300-9999999'
    });
    console.log('👤 Test user created: user@pvcpanels.com');

    // Insert products (use .create to trigger pre-save hooks for slugs)
    const createdProducts = await Product.create(products);
    console.log(`📦 ${createdProducts.length} products seeded`);

    // Create sample orders with actual product references
    for (let i = 0; i < sampleOrders.length; i++) {
      const orderData = { ...sampleOrders[i] };
      // Pick 1-3 random products for each order
      const numItems = Math.floor(Math.random() * 3) + 1;
      const selectedProducts = createdProducts.slice(i * 2, i * 2 + numItems);

      orderData.items = selectedProducts.map(p => ({
        product: p._id,
        name: p.name,
        image: p.images[0]?.url || '',
        price: p.price,
        quantity: Math.floor(Math.random() * 3) + 1
      }));

      const subtotal = orderData.items.reduce((s, item) => s + item.price * item.quantity, 0);
      orderData.subtotal = subtotal;
      orderData.total = subtotal + orderData.shippingCost;

      await Order.create(orderData);
    }
    console.log(`🛒 ${sampleOrders.length} sample orders seeded`);

    console.log('\n✅ Database seeded successfully!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔑 Admin Login:');
    console.log(`   Email:    ${adminUser.email}`);
    console.log(`   Password: ${adminUser.password}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('👤 Test User Login:');
    console.log('   Email:    user@pvcpanels.com');
    console.log('   Password: User@123456');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeder error:', error);
    process.exit(1);
  }
};

// ─── Destroy Function ───────────────────────────────────────────────────────────
const destroyData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await User.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();
    await Cart.deleteMany();
    await Wishlist.deleteMany();
    await Contact.deleteMany();
    console.log('🗑️  All data destroyed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Destroy error:', error);
    process.exit(1);
  }
};

// ─── Run ────────────────────────────────────────────────────────────────────────
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}