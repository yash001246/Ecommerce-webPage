// Simple seed script: run with `npm run seed`
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');

const run = async () => {
  await connectDB();

  await User.deleteMany();
  await Category.deleteMany();
  await Product.deleteMany();

  await User.create({
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
  });

  await User.create({
    name: 'Demo Customer',
    email: 'customer@example.com',
    password: 'customer123',
    role: 'user',
  });

  const categories = await Category.insertMany([
    { name: 'Electronics', description: 'Gadgets and devices' },
    { name: 'Fashion', description: 'Clothing and accessories' },
    { name: 'Home & Kitchen', description: 'Home essentials' },
  ]);

  await Product.insertMany([
    {
      name: 'Wireless Headphones',
      description: 'Noise-cancelling over-ear wireless headphones with 30hr battery life.',
      price: 4999,
      discountPrice: 3499,
      category: categories[0]._id,
      brand: 'SoundMax',
      images: ['https://picsum.photos/seed/headphones/500'],
      stock: 50,
      featured: true,
    },
    {
      name: 'Smart Watch',
      description: 'Fitness tracking smart watch with heart rate monitor.',
      price: 6999,
      category: categories[0]._id,
      brand: 'FitTech',
      images: ['https://picsum.photos/seed/watch/500'],
      stock: 30,
      featured: true,
    },
    {
      name: "Men's Denim Jacket",
      description: 'Classic fit denim jacket, machine washable.',
      price: 2499,
      category: categories[1]._id,
      brand: 'UrbanWear',
      images: ['https://picsum.photos/seed/jacket/500'],
      stock: 80,
    },
    {
      name: 'Non-stick Cookware Set',
      description: '10-piece non-stick cookware set, dishwasher safe.',
      price: 3499,
      category: categories[2]._id,
      brand: 'HomeChef',
      images: ['https://picsum.photos/seed/cookware/500'],
      stock: 20,
      featured: true,
    },
  ]);

  console.log('Seed data created successfully!');
  console.log('Admin login: admin@example.com / admin123');
  console.log('Customer login: customer@example.com / customer123');
  mongoose.connection.close();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
