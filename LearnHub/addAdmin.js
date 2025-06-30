// addAdmin.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import Admin from './models/admin.js';

dotenv.config();

const addAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('📦 Connected to MongoDB');

    const password = 'karuna@123';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAdmin = new Admin({
      username: 'Karuna_Prakash',
      email: 'prak2804@gmail.com',
      password: hashedPassword,
    });

    await newAdmin.save();
    console.log('✅ Admin created successfully!');
    mongoose.disconnect();
  } catch (err) {
    console.error('❌ Error adding admin:', err.message);
    mongoose.disconnect();
  }
};

addAdmin();

