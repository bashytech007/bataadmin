import { Category } from "../models/Category";
import { mongooseConnect } from "@/lib/mongoose";
export default async function handle(req, res) {
  const { method } = req;
  try {
    await mongooseConnect();
    console.log("database conected succesfully");
  } catch (error) {
    console.log("database error", error);
  }
  if (method === "POST") {
    const { name } = req.body;

    const categoryDoc = await Category.create({ name });
    res.json(categoryDoc);
  }
}
