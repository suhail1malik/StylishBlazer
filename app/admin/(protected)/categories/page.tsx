"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  isActive: boolean;
  order: number;
  _count: { products: number };
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", description: "", order: 0 });

  const fetchCategories = async () => {
    const res = await fetch("/api/categories");
    const data = await res.json();
    setCategories(data);
    setLoading(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchCategories();
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await fetch(`/api/categories/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }
    setShowForm(false);
    setEditingId(null);
    setForm({ name: "", description: "", order: 0 });
    fetchCategories();
  };

  const handleEdit = (cat: Category) => {
    setForm({ name: cat.name, description: cat.description, order: cat.order });
    setEditingId(cat.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string, productCount: number) => {
    if (productCount > 0)
      return alert("Pehle is category ke sare products delete karo!");
    if (!confirm("Are you sure? Yeh category delete ho jayegi.")) return;
    await fetch(`/api/categories/${id}`, { method: "DELETE" });
    fetchCategories();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f3f4f6",
        padding: "2rem",
      }}
    >
      {/* ===== PAGE TITLE + ADD BUTTON ===== */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
        <div>
          <h1 style={{ fontSize: "1.875rem", fontWeight: 700, margin: 0 }}>
            Categories
          </h1>
          <p
            style={{
              color: "#6b7280",
              margin: "0.25rem 0 0",
              fontSize: "0.875rem",
            }}
          >
            Total {categories.length} categories
          </p>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            setForm({ name: "", description: "", order: 0 });
          }}
          style={{
            backgroundColor: "#2563eb",
            color: "white",
            padding: "0.625rem 1.25rem",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: "0.875rem",
          }}
        >
          + Add Category
        </button>
      </div>

      {/* ===== ADD / EDIT FORM ===== */}
      {showForm && (
        <div
          style={{
            background: "white",
            borderRadius: "12px",
            padding: "1.5rem",
            marginBottom: "1.5rem",
            boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
            border: "1px solid #e5e7eb",
          }}
        >
          <h2
            style={{
              margin: "0 0 1.25rem",
              fontSize: "1.125rem",
              fontWeight: 600,
            }}
          >
            {editingId ? "✏️ Edit Category" : "➕ Add New Category"}
          </h2>
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.375rem",
                  fontWeight: 500,
                  fontSize: "0.875rem",
                  color: "#374151",
                }}
              >
                Category Name <span style={{ color: "red" }}>*</span>
              </label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Women Long Coats"
                style={{
                  width: "100%",
                  padding: "0.625rem 0.75rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  fontSize: "0.875rem",
                  boxSizing: "border-box",
                  outline: "none",
                }}
              />
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.375rem",
                  fontWeight: 500,
                  fontSize: "0.875rem",
                  color: "#374151",
                }}
              >
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="Category description..."
                rows={3}
                style={{
                  width: "100%",
                  padding: "0.625rem 0.75rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  fontSize: "0.875rem",
                  boxSizing: "border-box",
                  resize: "vertical",
                  outline: "none",
                }}
              />
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.375rem",
                  fontWeight: 500,
                  fontSize: "0.875rem",
                  color: "#374151",
                }}
              >
                Display Order
              </label>
              <input
                type="number"
                value={form.order}
                onChange={(e) =>
                  setForm({ ...form, order: parseInt(e.target.value) || 0 })
                }
                style={{
                  width: "150px",
                  padding: "0.625rem 0.75rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  fontSize: "0.875rem",
                  outline: "none",
                }}
              />
              <p
                style={{
                  margin: "0.25rem 0 0",
                  fontSize: "0.75rem",
                  color: "#6b7280",
                }}
              >
                Chhota number pehle dikhega (0 = sabse pehle)
              </p>
            </div>
            <div
              style={{ display: "flex", gap: "0.75rem", paddingTop: "0.5rem" }}
            >
              <button
                type="submit"
                style={{
                  backgroundColor: "#166534",
                  color: "white",
                  padding: "0.625rem 1.5rem",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                }}
              >
                {editingId ? "✅ Update Category" : "✅ Create Category"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setForm({ name: "", description: "", order: 0 });
                }}
                style={{
                  backgroundColor: "#f9fafb",
                  color: "#374151",
                  padding: "0.625rem 1.5rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ===== CATEGORIES TABLE ===== */}
      <div
        style={{
          background: "white",
          borderRadius: "12px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
          overflow: "hidden",
        }}
      >
        {loading ? (
          <div
            style={{ padding: "3rem", textAlign: "center", color: "#6b7280" }}
          >
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>⏳</div>
            Loading categories...
          </div>
        ) : categories.length === 0 ? (
          <div
            style={{ padding: "3rem", textAlign: "center", color: "#6b7280" }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📂</div>
            <p
              style={{
                fontWeight: 600,
                fontSize: "1.125rem",
                margin: "0 0 0.5rem",
              }}
            >
              Koi category nahi mili
            </p>
            <p style={{ margin: 0 }}>
              Upar "Add Category" button se naya banao
            </p>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ backgroundColor: "#f9fafb" }}>
              <tr>
                {[
                  "Category Name",
                  "Slug",
                  "Products",
                  "Order",
                  "Status",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "0.75rem 1rem",
                      textAlign: "left",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: "#6b7280",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {categories.map((cat, i) => (
                <tr
                  key={cat.id}
                  style={{
                    borderTop: "1px solid #f3f4f6",
                    backgroundColor: i % 2 === 0 ? "white" : "#fafafa",
                  }}
                >
                  {/* Category Name + Description */}
                  <td style={{ padding: "1rem" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <span style={{ fontSize: "1.25rem" }}>📁</span>
                      <div>
                        <div
                          style={{
                            fontWeight: 600,
                            fontSize: "0.875rem",
                            color: "#111827",
                          }}
                        >
                          {cat.name}
                        </div>
                        {cat.description && (
                          <div
                            style={{
                              fontSize: "0.75rem",
                              color: "#6b7280",
                              marginTop: "0.125rem",
                              maxWidth: "250px",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {cat.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Slug */}
                  <td style={{ padding: "1rem" }}>
                    <code
                      style={{
                        fontSize: "0.75rem",
                        backgroundColor: "#f3f4f6",
                        padding: "0.25rem 0.5rem",
                        borderRadius: "4px",
                        color: "#374151",
                        fontFamily: "monospace",
                      }}
                    >
                      {cat.slug}
                    </code>
                  </td>

                  {/* Product Count */}
                  <td style={{ padding: "1rem" }}>
                    <span
                      style={{
                        backgroundColor:
                          cat._count.products > 0 ? "#dcfce7" : "#fee2e2",
                        color: cat._count.products > 0 ? "#166534" : "#991b1b",
                        padding: "0.25rem 0.75rem",
                        borderRadius: "9999px",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                      }}
                    >
                      {cat._count.products} products
                    </span>
                  </td>

                  {/* Order */}
                  <td style={{ padding: "1rem" }}>
                    <span
                      style={{
                        fontSize: "0.875rem",
                        color: "#374151",
                        fontWeight: 500,
                      }}
                    >
                      #{cat.order}
                    </span>
                  </td>

                  {/* Status */}
                  <td style={{ padding: "1rem" }}>
                    <span
                      style={{
                        backgroundColor: cat.isActive ? "#dcfce7" : "#f3f4f6",
                        color: cat.isActive ? "#166534" : "#6b7280",
                        padding: "0.25rem 0.75rem",
                        borderRadius: "9999px",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                      }}
                    >
                      {cat.isActive ? "✅ Active" : "⏸ Inactive"}
                    </span>
                  </td>

                  {/* Actions */}
                  <td style={{ padding: "1rem" }}>
                    <div
                      style={{
                        display: "flex",
                        gap: "0.5rem",
                        alignItems: "center",
                      }}
                    >
                      <button
                        onClick={() => handleEdit(cat)}
                        style={{
                          backgroundColor: "#eff6ff",
                          color: "#2563eb",
                          border: "1px solid #bfdbfe",
                          padding: "0.375rem 0.875rem",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontSize: "0.8rem",
                          fontWeight: 600,
                        }}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() =>
                          handleDelete(cat.id, cat._count.products)
                        }
                        style={{
                          backgroundColor:
                            cat._count.products > 0 ? "#f9fafb" : "#fef2f2",
                          color:
                            cat._count.products > 0 ? "#9ca3af" : "#dc2626",
                          border: `1px solid ${cat._count.products > 0 ? "#e5e7eb" : "#fecaca"}`,
                          padding: "0.375rem 0.875rem",
                          borderRadius: "6px",
                          cursor:
                            cat._count.products > 0 ? "not-allowed" : "pointer",
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          opacity: cat._count.products > 0 ? 0.6 : 1,
                        }}
                        title={
                          cat._count.products > 0
                            ? "Pehle sare products hatao"
                            : "Delete category"
                        }
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ===== FOOTER INFO ===== */}
      <div
        style={{
          marginTop: "1.5rem",
          padding: "1rem 1.5rem",
          background: "white",
          borderRadius: "12px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "2rem",
            fontSize: "0.8rem",
            color: "#6b7280",
          }}
        >
          <span>
            📊 Total categories:{" "}
            <strong style={{ color: "#111827" }}>{categories.length}</strong>
          </span>
          <span>
            ✅ Active:{" "}
            <strong style={{ color: "#166534" }}>
              {categories.filter((c) => c.isActive).length}
            </strong>
          </span>
          <span>
            🛍️ Total products:{" "}
            <strong style={{ color: "#111827" }}>
              {categories.reduce((sum, c) => sum + c._count.products, 0)}
            </strong>
          </span>
          <span style={{ marginLeft: "auto", color: "#9ca3af" }}>
            💡 Tip: Sirf empty categories (0 products) delete ho sakti hain
          </span>
        </div>
      </div>
    </div>
  );
}
