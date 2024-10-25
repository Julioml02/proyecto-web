import Products, { Product } from '@/models/Product';
import connect from '@/lib/mongoose';
import { Types } from 'mongoose';

import Users, { User, CartItem} from '@/models/User';
import Orders, { Order, OrderItem } from '@/models/Order';


//PRACTICE 2
import bcrypt from 'bcrypt'

export interface ErrorResponse {
  error: string
  message: string
}

// POST /api/users
export async function createUser(user: {
  email: string;
  password: string;
  name: string;
  surname: string;
  address: string;
  birthdate: Date;
}): Promise<CreateUserResponse | null> {
  await connect();

  const prevUser = await Users.find({ email: user.email });

  if (prevUser.length !== 0) {
    return null;
  }


  //PRACTICE 2 
  const hash = await bcrypt.hash(user.password, 10)
  //--------

  const doc: User = {
    ...user,
    password: hash,   // hash for the Practice 2
    birthdate: new Date(user.birthdate),
    cartItems: [],
    orders: [],
  };


  const newUser = await Users.create(doc);

  return {
    _id: newUser._id,
  };
}


export interface GetProductsResponse {
  products: (Product | { _id: Types.ObjectId })[]
}

export async function getProducts(): Promise<GetProductsResponse> {
  await connect()

  const productsProjection = {
    __v: false
  }
  const products = await Products.find({}, productsProjection)

  return {
    products,
  }
}

export interface CreateUserResponse {
  _id: Types.ObjectId
}


export interface GetUserResponse
  extends Pick<User, 'email' | 'name' | 'surname' | 'address' | 'birthdate'> {
  _id: Types.ObjectId
}

export async function getUser(
  userId: Types.ObjectId | string
): Promise<GetUserResponse | null> {
  await connect()

  const userProjection = {
    email: true,
    name: true,
    surname: true,
    address: true,
    birthdate: true,
  }
  const user = await Users.findById(userId, userProjection)

  return user
}

//GET /api/products/[productId] 
export interface GetProductResponse
  extends Pick<Product, 'name' | 'description' | 'img' | 'price' > {
  _id: Types.ObjectId
}

export async function getProduct(
  productId: Types.ObjectId | string
): Promise<GetProductResponse | null> {
  await connect()

  const productProjection = {
    name: true,
    description: true,
    img: true,
    price: true,
  }
  const product = await Products.findById(productId, productProjection)

  return product
}

//GET /api/users/[userId]/cart 
export interface GetCartResponse{
  cartItems: (Omit<CartItem, 'product'> & {
    product: Product & { _id: Types.ObjectId} 
  })[]


}

export async function getCarts(
  userId: Types.ObjectId | string
): Promise<GetCartResponse | null> {
  await connect()

  const userProjection = {
    _id: false,
    cartItems: {
      product: true,
      qty: true,
    }
  }

  const productProjection = {
    _id: true,
    name: true,
    description: true,
    img: true,
    price: true,
  };


  const cart = await Users.findById(userId, userProjection).populate<{
    cartItems: (Omit<CartItem, 'product'> & {
      product: Product & { _id: Types.ObjectId }
    })[]
  }>('cartItems.product', productProjection)

  return cart;
}


// PUT /api/users/[userId]/cart/[productId]
export interface UpdateCartResponse 
{
  cartItems: (Omit<CartItem, 'product'> & {
    product: Product & { _id: Types.ObjectId} 
  })[]
  created: boolean
}

export async function updateCartItem
(
  userId: Types.ObjectId | string,
  productId: Types.ObjectId | string,
  qty: number,
): Promise<UpdateCartResponse | null> 
{
  await connect();

  let created: boolean = false;

  const userCartProjection = {
    _id:true,
    cartItems: {
      product: true,
      qty:true,
    },
  }

  const productProjection = {
    _id: true,
    name:true,
    price:true,
    img: true,
    description: true,
  }

  const user = await Users.findById(userId, userCartProjection).populate('cartItems.product', productProjection);

  if (user === null) 
  {
    return null;
  }

  const product = await Products.findById(productId, productProjection);
  if (product === null)
  {
    return null;
  }

  const newCartItems = user.cartItems.find((cartItem) =>
    cartItem.product.equals(productId));  
  
  if (newCartItems) 
    newCartItems.qty = qty;
  else 
  {
    const newCartItem = 
    {
      product: new Types.ObjectId(productId),
      qty: qty,
    };
    created = true;
    user.cartItems.push(newCartItem);
  }

  await user.save();

  const userProjection = {
    _id: false,
    cartItems: {
      product: true,
      qty: true,
    },
  };


  const updatedUser = await Users.findById(userId, userProjection).populate<{
    cartItems: (Omit<CartItem, 'product'> & {
      product: Product & { _id: Types.ObjectId }
    })[]
  }>('cartItems.product', productProjection);
  
  const response= {
    cartItems: updatedUser,
    created: created
  }

  return response
}


// DELETE /api/users/[userId]/cart/[productId]
export interface DeleteCartResponse 
{
  cartItems: (Omit<CartItem, 'product'> & {
    product: Product & { _id: Types.ObjectId} 
  })[]
}

export async function deleteCartItem
(
  userId: Types.ObjectId | string,
  productId: Types.ObjectId | string,
): Promise< DeleteCartResponse | null> 
{
  await connect();

  const userCartProjection = {
    _id:true,
    cartItems: {
      product: true,
      qty:true,
    },
  }

  const productProjection = {
    _id: true,
    name:true,
    price:true,
    img: true,
    description: true,
  }

  const user = await Users.findById(userId, userCartProjection).populate('cartItems.product', productProjection);

  if (user === null) 
  {
    return null;
  }

  const product = await Products.findById(productId, productProjection);
  if (product === null)
  {
    return null;
  }

  const newCartItems = user.cartItems.filter((cartItem) =>
    !cartItem.product.equals(productId));

  if (newCartItems.length > 0) 
  {
    user.cartItems = newCartItems;
  } 
  else 
  {
    user.cartItems = [];
  }

  await user.save();

  const userProjection = {
    _id: false,
    cartItems: {
      product: true,
      qty: true,
    },
  };

  const updatedUser = await Users.findById(userId, userProjection).populate<{
    cartItems: (Omit<CartItem, 'product'> & {
      product: Product & { _id: Types.ObjectId }
    })[]
  }>('cartItems.product', productProjection)
  
  return updatedUser;
}


//GET /api/users/[userId]/orders 

export interface GetOrderResponse extends Omit<Order, 'orderItems'> {
  _id: Types.ObjectId
  orderItems: (Omit<OrderItem, 'product'> & {
    product: Product & { _id: Types.ObjectId }
  })[]
    
}

export async function getOrder(
  userId: Types.ObjectId | string
): Promise<GetOrderResponse | null> {
  await connect()

  const userProjection = {
    _id: false,
    orders:true
  };

  const orderProjection = {
    // _id: false,
    // address : true,
    // date: true,
    // cardHolder : true, 
    // cardNumber : true,
    //   orderItems : true,
      __v : false,
  };

  const order = await Users.findById(userId, userProjection).populate<{
    orders: (Omit<Order, 'orders'> & {
      orderItems: OrderItem & { _id: Types.ObjectId }
    })[]
  }>('orders', orderProjection)

  return order
}

//! GET /api/users/[userId]/orders/[orderId]
export interface OrderItemResponse 
{
  _id: Types.ObjectId
  orderItems: (Omit<OrderItem, 'product'> & {
    product: Product & { _id: Types.ObjectId }
  })[]
}

export async function userOrderItem
(
  userId: Types.ObjectId | string,
  orderId: Types.ObjectId | string,
): Promise<OrderItemResponse | null> 
{
  await connect();

  const userProjection = {
    _id: false,
    orders:true,
  }

  const orderProjection = {
    _id:true,
    address: true,
    date: true,
    cardHolder: true,
    cardNumber: true,
    orderItems: {
      product: true,
      qty:true,
      price:true
    },
  }

  const productProjection = {
    _id: true,
    name:true,
    price: true,
    img: true, 
    description: true
  }

  const user = await Users.findById( userId, userProjection);
  if (user===null) return null;

  const userOrderId = user.orders.filter((orders) =>orders._id.equals(orderId));

  if (!userOrderId)
    return null;

  const order = await Orders.findById(orderId, orderProjection).populate('orderItems.product', productProjection);

  if (order === null) {
    return null;
  }

  return order;
}


// POST /api/users/[userId]/orders
export interface CreateOrderResponse {
  _id: Types.ObjectId | string;
}

export async function createOrder(
  userId: string, 
  order: {
    address: string;
    cardHolder: string;
    cardNumber: string;
    orderItems: [];
  }
): Promise<CreateOrderResponse | null | undefined> {
  
  await connect();

  const user = await Users.findById(userId);

  if (user === null) {
    return null;
  }
  if (user.cartItems.length == 0) {
    return null;
  }  

  const doc : Order = {
    ...order,
    date: new Date(),
    orderItems: []
  };
  
  const newOrder = new Orders(doc);
  newOrder.orderItems = await Promise.all(user.cartItems.map(async (item: any) => {
    const product = await Products.findById(item.product._id.toString());
    if (product) {
      return {
        product: item.product._id,
        qty: item.qty,
        price: product.price
      };
    }
  }));
  await newOrder.save();

  user.orders.push(new Types.ObjectId(newOrder._id));

  user.cartItems = [];
  
  await user.save();
  
  return {
    _id: newOrder._id,
  };
}

  // PRACTICE 2
  export interface CheckCredentialsResponse {
    _id: Types.ObjectId
  }
  
  export async function checkCredentials(
    email: string,
    password: string
  ): Promise<CheckCredentialsResponse | null> {
  
    // Implement this...
        await connect();
  
        const user = await Users.findOne({ email });

        if (user === null || !(await bcrypt.compare(password, user.password))){
          return null
        }
      
        return { _id: user._id };


        /////////////////OTRA FORMA///////////////////

        /*
        await connect();
  
        const user = await Users.findOne({ email });

        if (!user) {
          return null;
        }

        if (user.password !== password) {
          return null;
        }

        return { _id: user._id };
        */
  }

