const mongoose = require('mongoose');
require('dotenv').config({ path: './config/config.env' });
const Restaurant = require('./models/restaurant');

(async () => {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGO_ATLAS_URI;
    console.log('Connecting to:', mongoUri.split('@')[1]?.split('/')[0] || 'local');
    
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB');
    
    const updates = [
      { 
        name: /Zyka/, 
        images: [{ public_id: 'zyka', url: 'https://images.unsplash.com/photo-1504674900769-0c55830f3e30?w=500&h=300' }] 
      },
      { 
        name: /Green Leaf/, 
        images: [{ public_id: 'greenleaf', url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=300' }] 
      },
      { 
        name: /Spice Route/, 
        images: [{ public_id: 'spiceroute', url: 'https://images.unsplash.com/photo-1565456200244-4fbdf305efff?w=500&h=300' }] 
      },
      { 
        name: /Pizza House/, 
        images: [{ public_id: 'pizzahouse', url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&h=300&fit=crop' }] 
      },
      { 
        name: /Dosa Corner/, 
        images: [{ public_id: 'dosacorner', url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&h=300&fit=crop' }] 
      }
    ];
    
    for(const update of updates) {
      const result = await Restaurant.updateMany({ name: update.name }, { images: update.images });
      console.log(`✓ Updated ${result.modifiedCount} restaurant(s)`);
    }
    
    console.log('\n✓ All images updated successfully!');
    process.exit(0);
  } catch(err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
})();
