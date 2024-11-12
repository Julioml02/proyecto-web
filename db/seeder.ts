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
    // img: 'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-01.jpg',
    img: 'https://static.pullandbear.net/assets/public/dfef/c67c/8fc749dda629/9e59b289a084/07710398800-A1M/07710398800-A1M.jpg?ts=1724687313307&w=850',

    description: 'Cazadora biker oversize en 100% piel con cuello solapa, cierre de cremallera, bolsillos y cinturón decorativo con trabillas.',
  },
  {
    name: 'Botas Cowboy',
    price: 45.99,
    img: 'https://static.pullandbear.net/assets/public/3aa0/afc8/cc974234b324/43c1b998fbd3/11258340040-a2p/11258340040-a2p.jpg?ts=1721915053465&w=850',
    description: 'Botas de estilo cowboy de color negro. Costuras decorativas en la caña. Detalle de tiradores en los laterales. Acabado en punta.'
  },
  {
    name: 'Pantalones flare',
    price: 25.99,
    img: 'https://static.pullandbear.net/assets/public/d287/4603/595942739457/bb7c673cc008/07678467800-A6M/07678467800-A6M.jpg?ts=1725292696759&w=850',
    description: 'Pantalón flare con detalle de cintura de encaje, confeccionado en tejido elástico.',
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