const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function checkProducts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.MONGODB_DB || 'vipo',
    });

    console.log('✅ Connected to MongoDB');

    const Product = require('../models/Product');
    const ProductModel = Product?.default || Product;

    const products = await ProductModel.find({}).select('name image images videoUrl');

    console.log(`\n📦 Total products: ${products.length}\n`);

    products.forEach((p, i) => {
      console.log(`${i + 1}. ${p.name}`);
      console.log(`   📸 Image: ${p.image ? 'YES ✅' : 'NO ❌'}`);
      console.log(`   🖼️  Images array: ${p.images?.length || 0} images`);
      console.log(`   🎥 Video: ${p.videoUrl ? 'YES ✅' : 'NO ❌'}`);
      if (p.image) {
        console.log(`   URL: ${p.image.substring(0, 60)}...`);
      }
      console.log('');
    });
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('👋 Disconnected from MongoDB');
  }
}

checkProducts();
