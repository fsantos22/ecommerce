import PageHeader from "@/app/admin/_components/pageHeader";
import ProductForm from "@/app/admin/products/_components/ProductForm";

export default function NewProductsPage() {
  return (
    <>
      <PageHeader>Adicionar produto</PageHeader>
      <ProductForm />
    </>
  );
}
