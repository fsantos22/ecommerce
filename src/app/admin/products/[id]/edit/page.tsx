import PageHeader from "@/app/admin/_components/pageHeader";
import ProductForm from "@/app/admin/products/_components/ProductForm";
import db from "@/db/db";

export default async function EditProductsPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const product = await db.product.findUnique({ where: { id } });
  return (
    <>
      <PageHeader>Editar produto</PageHeader>
      <ProductForm product={product} />
    </>
  );
}
