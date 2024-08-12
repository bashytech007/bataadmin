

// import { Category } from "../models/Category";
// import { mongooseConnect } from "@/lib/mongoose";

// export default async function handle(req, res) {
//   const { method } = req;

//   await mongooseConnect();
//   // try {
//   //   console.log("database connected successfully");
//   // } catch (error) {
//   //   console.log("database error", error);
//   //   return res.status(500).json({ error: "Database connection failed" });
//   // }

//   if (method === "GET") {
//     try {
//       const categories = await Category.find().populate("parent");
//       res.json(categories);
//     } catch (error) {
//       res.status(500).json({ error: "Failed to fetch categories" });
//     }
//   }
//   if (method === "POST") {
//     const { name, parentCategory } = req.body;

//     const categoryData = { name };
//     if (parentCategory) {
//       categoryData.parent = parentCategory;
//     }

//     try {
//       const categoryDoc = await Category.create(categoryData);
//       res.json(categoryDoc);
//     } catch (error) {
//       res.status(400).json({ error: "Failed to create category" });
//     }
//   } else {
//     res.status(405).json({ error: "Method not allowed" });
//   }
//   if (method === "PUT") {
//     const { name, parentCategory, _id } = req.body;
//     const categoryDoc = await Category.updateOne(
//       { _id },
//       {
//         name,
//         parent: parentCategory,
//       }
//     );
//     res.json(categoryDoc);
//   }
// }

import { Category } from "../models/Category";
import { mongooseConnect } from "@/lib/mongoose";

export default async function handle(req, res) {
  const { method } = req;

  try {
    await mongooseConnect();
    console.log("Database connected successfully");
  } catch (error) {
    console.log("Database error", error);
    return res.status(500).json({ error: "Database connection failed" });
  }

  switch (method) {
    case "GET":
      try {
        const categories = await Category.find().populate("parent");
        res.json(categories);
      } catch (error) {
        res.status(500).json({ error: "Failed to fetch categories" });
      }
      break;

    case "POST":
      try {
        const { name, parentCategory } = req.body;
        const categoryData = { name };
        if (parentCategory) {
          categoryData.parent = parentCategory;
        }
        const categoryDoc = await Category.create(categoryData);
        res.json(categoryDoc);
      } catch (error) {
        res.status(400).json({ error: "Failed to create category" });
      }
      break;

    case "PUT":
      try {
        const { name, parentCategory, _id } = req.body;
        const updatedCategory = await Category.findByIdAndUpdate(
          _id,
          { name, parent: parentCategory },
          { new: true }
        );
        if (!updatedCategory) {
          return res.status(404).json({ error: "Category not found" });
        }
        res.json(updatedCategory);
      } catch (error) {
        res.status(400).json({ error: "Failed to update category" });
      }
      break;
      case "DELETE":
      try {
        const { _id } = req.query;
        if (!_id) {
          return res.status(400).json({ error: "Missing _id in query parameters" });
        }
        const deletedCategory = await Category.findByIdAndDelete(_id);
        if (!deletedCategory) {
          return res.status(404).json({ error: "Category not found" });
        }
        res.json({ message: "Category deleted successfully" });
      } catch (error) {
        console.error("Error deleting category:", error);
        res.status(400).json({ error: "Failed to delete category", details: error.message });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "POST", "PUT"]);
      res.status(405).json({ error: `Method ${method} Not Allowed` });
  }
  

}