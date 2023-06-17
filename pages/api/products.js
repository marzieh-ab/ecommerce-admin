import { Product } from "@/models/products";

import { mongooseConnect } from "@/lib/mongoose";
import { IsAdminRequest } from "./auth/[...nextauth]";

export default async function handler(req, res) {
  console.log(req);
  // const {id}=req.query

  const { method } = req;

  // console.log(id)
  await mongooseConnect();

  await IsAdminRequest(req, res);

  if (method === "GET") {
    if (req.query?.id) {
      res.json(await Product.findOne({ _id: req.query.id }));
    } else {
      res.json(await Product.find());
    }
  }
  if (method === "POST") {
    const { title, description, price, images, category, productProperties } =
      req.body;
    const productDoc = await Product.create({
      title,
      description,
      price,
      images,
      category,
      productProperties,
    });
    res.json(productDoc);
  }

  if (method === "PUT") {
    const {
      title,
      description,
      price,
      _id,
      images,
      category,
      productProperties,
    } = req.body;
    await Product.updateOne(
      { _id },
      { title, description, price, images, category, productProperties }
    );
    res.json(true);
  }
  if (method === "DELETE") {
    if (req.query?.id) {
      await Product.deleteOne({ _id: req.query?.id });
      res.json(true);
    }
  }
}
