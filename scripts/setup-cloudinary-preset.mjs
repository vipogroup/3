import { config } from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';

// Load environment variables from .env.production
config({ path: '.env.production' });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME?.replace(/"/g, '').trim(),
  api_key: process.env.CLOUDINARY_API_KEY?.replace(/"/g, '').trim(),
  api_secret: process.env.CLOUDINARY_API_SECRET?.replace(/"/g, '').trim(),
  secure: true,
});

async function setupPreset() {
  console.log('🔧 Setting up Cloudinary Upload Preset...');
  console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);

  try {
    // Check if preset already exists
    const existingPresets = await cloudinary.api.upload_presets({ max_results: 100 });
    const presetExists = existingPresets.presets?.some(p => p.name === 'vipo_unsigned');

    if (presetExists) {
      console.log('✅ Upload preset "vipo_unsigned" already exists!');
      return;
    }

    // Create unsigned upload preset
    const result = await cloudinary.api.create_upload_preset({
      name: 'vipo_unsigned',
      unsigned: true,
      folder: 'vipo-products',
      allowed_formats: 'jpg,jpeg,png,webp,gif,mp4,mov,avi,webm',
      resource_type: 'auto',
      use_filename: true,
      unique_filename: true,
      overwrite: false,
    });

    console.log('✅ Upload preset created successfully!');
    console.log('Preset name:', result.name);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

setupPreset();
