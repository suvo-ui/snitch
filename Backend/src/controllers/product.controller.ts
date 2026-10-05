import Product from "../models/product.model.js";
import type { Request, Response } from "express";
import type { IUser } from "../models/user.models.js";
import { uploadImage } from "../services/storage.service.js";

export async function createProduct(req: Request, res: Response) {
  try {
    const { title, description, priceAmount, priceCurrency } = req.body;
    const seller = req.user as IUser | undefined;

    if (!seller || !seller._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const parsedPrice = Number(priceAmount);
    const files = Array.isArray(req.files) ? req.files : [];

    const images = await Promise.all(
      files.map(async (file: Express.Multer.File) => {
        const imageUrl = await uploadImage({
          file: file.buffer,
          fileName: file.originalname,
          mimeType: file.mimetype,
        });

        return {
          url: imageUrl,
          alt: file.originalname || String(title).trim(),
        };
      }),
    );

    const product = new Product({
      title: String(title).trim(),
      description: description ? String(description).trim() : "",
      price: {
        amount: parsedPrice,
        currency: priceCurrency || "INR",
      },
      images,
      seller: seller._id,
    });

    await product.save();

    res.status(201).json({
      message: "Product created successfully",
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

export async function getProducts(req: Request, res: Response) {
  try {
    const seller = req.user as IUser | undefined;

    if (!seller || !seller._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const products = await Product.find({ seller: seller._id });

    res.status(200).json({
      message: "Products retrieved successfully",
      products,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
