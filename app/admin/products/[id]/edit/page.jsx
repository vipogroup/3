import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { requireAdmin } from "@/lib/auth";

const BASE_URL =
  process.env.BASE_URL ||
  process.env.NEXT_PUBLIC_BASE_URL ||
  "http://localhost:3001";

export const dynamic = "force-dynamic";

export default async function AdminProductEditPage({ params }) {
  await requireAdmin();

  const cookieHeader = cookies().toString();
  const res = await fetch(`${BASE_URL}/api/admin/products/${params.id}`, {
    headers: { Cookie: cookieHeader },
    cache: "no-store",
  });

  if (res.status === 404) {
    notFound();
  }

  if (!res.ok) {
    throw new Error("Failed to load product");
  }

  const { item } = await res.json();
  const product = item;

  async function updateProduct(formData) {
    "use server";

    await requireAdmin();

    const cookieString = cookies().toString();
    const payload = {
      title: formData.get("title")?.toString().trim() || "",
      slug: formData.get("slug")?.toString().trim() || "",
      price: Number(formData.get("price")) || 0,
      description: formData.get("description")?.toString() || "",
      active: formData.get("active") === "on",
    };

    const response = await fetch(`${BASE_URL}/api/admin/products/${params.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieString,
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    if (!response.ok) {
      const result = await response.json().catch(() => null);
      throw new Error(result?.error || "Failed to update product");
    }

    revalidatePath("/admin/products");
    redirect("/admin/products?flash=updated");
  }

  async function deleteProduct() {
    "use server";

    await requireAdmin();

    const cookieString = cookies().toString();
    const response = await fetch(`${BASE_URL}/api/admin/products/${params.id}`, {
      method: "DELETE",
      headers: {
        Cookie: cookieString,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const result = await response.json().catch(() => null);
      throw new Error(result?.error || "Failed to delete product");
    }

    revalidatePath("/admin/products");
    redirect("/admin/products?flash=deleted");
  }

  return (
    <section className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Edit Product</h1>
          <p className="text-sm text-muted-foreground">Update details or archive this product.</p>
        </div>
        <form action={deleteProduct}>
          <button
            type="submit"
            className="inline-flex items-center rounded-md border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            Delete
          </button>
        </form>
      </div>

      <form action={updateProduct} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium">Title</label>
          <input
            id="title"
            name="title"
            defaultValue={product.title}
            required
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="slug" className="text-sm font-medium">Slug</label>
          <input
            id="slug"
            name="slug"
            defaultValue={product.slug}
            required
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="price" className="text-sm font-medium">Price (₪)</label>
          <input
            id="price"
            name="price"
            type="number"
            min="0"
            step="0.01"
            defaultValue={product.price}
            required
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium">Description</label>
          <textarea
            id="description"
            name="description"
            rows={4}
            defaultValue={product.description}
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>

        <label className="flex items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            name="active"
            defaultChecked={product.active}
            className="h-4 w-4 rounded border"
          />
          Active product
        </label>

        <div className="flex items-center justify-end gap-3">
          <a href="/admin/products" className="text-sm text-muted-foreground hover:underline">
            Cancel
          </a>
          <button
            type="submit"
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Save Changes
          </button>
        </div>
      </form>
    </section>
  );
}
