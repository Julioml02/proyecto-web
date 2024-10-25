import mongoose, { Schema, Types } from 'mongoose';



export interface Product {
  name: string;
  description: string;
  img?: string;
  price?: number;
}

const UserSchema = new Schema<Product>({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  img: {
    type: String
  },

  price: {
    type: String
  }
});

export default mongoose.models.Product as mongoose.Model<Product> || mongoose.model<Product>('Product', UserSchema);