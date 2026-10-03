import Product from "../models/product.model.js";
import type { Request, Response } from "express";
import type { IUser } from "../models/user.models.js";
import { uploadImage } from "../services/storage.service.js";

export async function createProduct(req: Request, res: Response) {
  try {
    const { title, description, price } = req.body;
    const seller = req.user as IUser | undefined;

    if (!seller||!seller._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const files = Array.isArray(req.files) ? req.files : [];

    const images = await Promise.all(
      files.map(async (file: Express.Multer.File) => {
        const imageUrl = await uploadImage({
          file: file.buffer,
          fileName: file.originalname,
          mimeType: file.mimetype,
        });
        return imageUrl;
      }),
    );

    const product = new Product({
      title,
      description,
      price: {
        amount: price,
        currency: "INR",
      },
      images,
      seller: seller._id,
    });

    await product.save();

    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
