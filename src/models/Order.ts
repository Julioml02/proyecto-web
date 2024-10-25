import mongoose, { Schema, Types } from 'mongoose';
import Products from '@/models/Product'

  export interface OrderItem {
    product: Types.ObjectId;
    qty: number;
    price: number;
  }
  
  export interface Order {
    date: Date;
    address: string;
    cardHolder: string;
    cardNumber: string;
    orderItems: OrderItem[];
  }
  
  const OrderSchema = new Schema<Order>({
    date: {
      type: Date,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    cardHolder: {
      type: String,
      required: true,
    },
    cardNumber: {
      type: String,
      required: true,
    },
    orderItems: [
      {
        _id: false,
        product: {
          type: Schema.Types.ObjectId,
          ref: Products,
          required: true,
        },
        qty: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],
  });
  
  export default mongoose.models.Order as mongoose.Model<Order> || mongoose.model<Order>('Order', OrderSchema);