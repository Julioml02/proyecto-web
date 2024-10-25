import Products, { Product } from '@/models/Product';
import Users, { User } from '@/models/User';
import Orders, { Order } from '@/models/Order';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt'

dotenv.config({ path: `.env.local`, override: true });
const MONGODB_URI = process.env.MONGODB_URI;

const products: Product[] = [
  {
    name: 'Cazadora de cuero negra',
    price: 39.95,
    img: 'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-01.jpg',
    description: 'Es cuero sintético',
  },
  {
    name: 'Botas Cowboy',
    price: 45.99,
    img: 'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-02.jpg',
    description: 'Made in Spain',
  },
  {
    name: 'Pantalones flare',
    price: 25.99,
    img: 'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-03.jpg',
    description: 'Son de tiro alto',
  },
];



async function seed() {
  if (!MONGODB_URI) {
    throw new Error(
      'Please define the MONGODB_URI environment variable inside .env.local'
    );
  }

  const opts = {
    bufferCommands: false,
  };
  const conn = await mongoose.connect(MONGODB_URI, opts);

  await conn.connection.db.dropDatabase();


  const insertedProducts = await Products.insertMany(products);

  const order: Order = {
    date: new Date('2024-03-20'),
    address: 'New Street',
    cardHolder: 'Julio Monteagudo López',
    cardNumber: '234567',
    orderItems: [
      {
        product: insertedProducts[0]._id,
        qty: 2,
        price: 20.99
      },
      {
        product: insertedProducts[1]._id,
        qty: 5,
        price: 17.98
      },
    ],
  };
  const insertedOrders = await Orders.insertMany(order);

  const user: User = {
    email: 'julio.monteagudo1@alu.uclm.es',
    password: (await bcrypt.hash('password', 10)),
    name: 'Julio',
    surname: 'Monteagudo López',
    address: '123 Main St, 12345 New York, United States',
    birthdate: new Date('2002-09-17'),
    cartItems: [
      {
        product: insertedProducts[0]._id,
        qty: 2,
      },
      {
        product: insertedProducts[1]._id,
        qty: 5,
      },
    ],
    orders: [insertedOrders[0]._id],
  };


  await Orders.createCollection();
  
  const res = await Users.create(user);
  console.log(JSON.stringify(res, null, 2));

  const retrievedUser = await Users
  .findOne({ email: 'johndoe@example.com' })
  .populate('cartItems.product');
  console.log(JSON.stringify(retrievedUser, null, 2));

  await conn.disconnect();
}

seed().catch(console.error);