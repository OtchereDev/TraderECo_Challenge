import mongoose from "mongoose";
const { Schema } = mongoose;

const productSchema = new Schema(
  {
    name: String,
    price: String,
    imageUrl: String,
    description: String,
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);

export type ProductType = typeof Product;
