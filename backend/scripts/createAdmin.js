
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const connectDB = require('../config/db');

const createAdminUser = async () => {
  try {
    await connectDB();

    const adminUser = new User({
      username: 'admin',
      email: 'admin@example.com',
      password: 'adminpassword123',
      isAdmin: true
    });

    await adminUser.save();
    console.log('Admin user created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
};

createAdminUser();