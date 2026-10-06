import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    price: {
      amount: {
        type: Number,
        required: true,
      },
      currency: {
        type: String,
        enum: ["USD", "EUR", "GBP", "JPY", "CAD", "AUD", "INR"],
        required: true,
        default: "INR",
      },
    },
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        alt: {
          type: String,
          required: false,
        },
      },
    ],
    variants: [
      {
        images: [
          {
            url: {
              type: String,
              required: true,
            },
          },
        ],
        stock: {
          type: Number,
          required: true,
          default: 0,
        },
        attributes: {
          type: Map,
          of: String,
          required: true,
        },
        price: {
          amount: {
            type: Number,
            required: true,
          },
          currency: {
            type: String,
            enum: ["USD", "EUR", "GBP", "JPY", "CAD", "AUD", "INR"],
            required: true,
            default: "INR",
          },
        },
      },
    ],
  },
  { timestamps: true },
);

const Product = mongoose.model("Product", productSchema);

export default Product;
