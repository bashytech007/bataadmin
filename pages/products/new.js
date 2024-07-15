import ProductForm from "@/components/ProductForm";
import Layout from "@/components/Layout";
export default function NewProduct() {
  return (
    <Layout>
      <h1 className="text-green-900 mb-2 text-xl">New Product</h1>
      <ProductForm />
    </Layout>
  );
}
