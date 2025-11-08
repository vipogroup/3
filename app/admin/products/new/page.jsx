import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";

const BASE_URL =
  process.env.BASE_URL ||
  process.env.NEXT_PUBLIC_BASE_URL ||
  "http://localhost:3001";

export const dynamic = "force-dynamic";

export default async function AdminProductNewPage() {
  await requireAdmin();

  async function createProduct(formData) {
    "use server";

    await requireAdmin();

    const cookieString = cookies().toString();
    const payload = {
      title: formData.get("title")?.toString().trim() || "",
      slug: formData.get("slug")?.toString().trim() || "",
      price: Number(formData.get("price")) || 0,
      description: formData.get("description")?.toString() || "",
    };

    const response = await fetch(`${BASE_URL}/api/admin/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieString,
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    if (!response.ok) {
      const result = await response.json().catch(() => null);
      throw new Error(result?.error || "Failed to create product");
    }

    revalidatePath("/admin/products");
    redirect("/admin/products?flash=created");
  }

  return (
    <section className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Add Product</h1>
        <p className="text-sm text-muted-foreground">
          Fill out the details below to create a new product.
        </p>
      </div>

      <form action={createProduct} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium">Title</label>
          <input
            id="title"
            name="title"
            required
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="slug" className="text-sm font-medium">Slug</label>
          <input
            id="slug"
            name="slug"
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
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>

        <div className="flex items-center justify-end gap-3">
          <a
            href="/admin/products"
            className="text-sm text-muted-foreground hover:underline"
          >
            Cancel
          </a>
          <button
            type="submit"
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Create Product
          </button>
        </div>
      </form>
    </section>
  );
}
