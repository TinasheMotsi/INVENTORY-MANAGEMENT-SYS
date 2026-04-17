import React, { useEffect, useState } from "react";
import styled from "styled-components";
import API from "../services/api";
import Layout from "../components/layout/Layout";

const Input = styled.input`
  padding: 10px;
  margin: 5px;
  border-radius: 8px;
  border: 1px solid #ccc;
`;

const Button = styled.button`
  padding: 8px 12px;
  margin: 5px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  color: white;
  background: #3b82f6;
`;

const AddButton = styled(Button)`
  background: #16a34a;
`;

const RemoveButton = styled(Button)`
  background: #dc2626;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  background: white;
  border-radius: 10px;
  overflow: hidden;
`;

const Th = styled.th`
  background: #1f2937;
  color: white;
  padding: 12px;
  text-align: left;
`;

const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #eee;
`;

const Tr = styled.tr`
  &:hover {
    background: #f9fafb;
  }
`;

const Products = () => {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    quantity: "",
    supplier: ""
  });

  const [editingId, setEditingId] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await API.get("/products");
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const editProduct = (product) => {
    setForm({
      name: product.name,
      category: product.category,
      price: product.price,
      quantity: product.quantity,
      supplier: product.supplier
    });

    setEditingId(product.id);
  };

  const saveProduct = async () => {
    if (!form.name || !form.price || !form.quantity) {
      return alert("Please fill all required fields");
    }

    try {
      if (editingId) {
        await API.put(`/products/${editingId}`, form);
      } else {
        await API.post("/products", form);
      }

      // reset form
      setForm({
        name: "",
        category: "",
        price: "",
        quantity: "",
        supplier: ""
      });

      setEditingId(null);
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Operation failed");
    }
  };

  const deleteProduct = async (id) => {
    const confirmDelete = window.confirm("Are you sure?");
    if (!confirmDelete) return;

    await API.delete(`/products/${id}`);
    fetchProducts();
  };

  const stockIn = async (id) => {
    const qty = prompt("Enter quantity to add:");
    if (!qty || Number(qty) <= 0) return alert("Invalid quantity");

    await API.post("/stock/in", {
      product_id: id,
      quantity: Number(qty)
    });

    fetchProducts();
  };

  const stockOut = async (id) => {
    const qty = prompt("Enter quantity to remove:");
    if (!qty || Number(qty) <= 0) return alert("Invalid quantity");

    try {
      await API.post("/stock/out", {
        product_id: id,
        quantity: Number(qty)
      });

      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || "Error removing stock");
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <h2>Products</h2>

      {/* FORM */}
      <div>
        <Input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <Input
          placeholder="Category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />

        <Input
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />

        <Input
          placeholder="Quantity"
          value={form.quantity}
          onChange={(e) => setForm({ ...form, quantity: e.target.value })}
        />

        <Input
          placeholder="Supplier"
          value={form.supplier}
          onChange={(e) => setForm({ ...form, supplier: e.target.value })}
        />

        <Button onClick={saveProduct}>
          {editingId ? "Update Product" : "Add Product"}
        </Button>
      </div>

      {/* SEARCH */}
      <Input
        placeholder="🔍 Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading && <p>Loading products...</p>}

      {/* TABLE */}
      <Table>
        <thead>
          <tr>
            <Th>ID</Th>
            <Th>Name</Th>
            <Th>Category</Th>
            <Th>Price</Th>
            <Th>Quantity</Th>
            <Th>Supplier</Th>
            <Th>Actions</Th>
          </tr>
        </thead>

        <tbody>
          {filteredProducts.map((p) => (
            <Tr key={p.id}>
              <Td>{p.id}</Td>
              <Td>{p.name}</Td>
              <Td>{p.category}</Td>
              <Td>${Number(p.price).toFixed(2)}</Td>

              <Td>
                {p.quantity}
                {p.quantity < 5 && (
                  <span style={{ color: "red", marginLeft: "10px" }}>
                    ⚠ Low
                  </span>
                )}
              </Td>

              <Td>{p.supplier}</Td>

              <Td>
                <AddButton onClick={() => stockIn(p.id)}>+ Stock</AddButton>
                <RemoveButton onClick={() => stockOut(p.id)}>- Stock</RemoveButton>
                <Button onClick={() => editProduct(p)}>Edit</Button>
                <Button onClick={() => deleteProduct(p.id)}>Delete</Button>
              </Td>
            </Tr>
          ))}
        </tbody>
      </Table>
    </Layout>
  );
};

export default Products;