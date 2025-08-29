import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [form, setForm] = useState({
    name: "",
    sku: "",
    category: "Electrónica",
    price: "",
    stock: "",
  });
  
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");

  const API_URL = "http://localhost:5000/api/products";

  const fetchProducts = async (q = "") => {
    const res = await fetch(`${API_URL}?q=${q}`);
    const data = await res.json();
    setProducts(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ name: "", sku: "", category: "Electrónica", price: "", stock: "" });
  };

  const handleDelete = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    fetchProducts(query);
  };

  const handleStockChange = async (id, newStock) => {
    await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stock: newStock }),
    });
    fetchProducts(query);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setQuery(search);
    fetchProducts(search);
  };

  return (
    <div className="appContainer">
      <h1 className="title">Inventario</h1>

      {/*Formulario de productos*/}
      <section className="card">
        <h2 className="sectionTitle"> Agregar Producto</h2>
        <form className="form" onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Nombre" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input type="text" name="sku" placeholder="SKU" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
          <select name="category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            <option value="Electrónica">Electrónica</option>
            <option value="Ropa">Ropa</option>
            <option value="Alimentos">Alimentos</option>
            <option value="Hogar">Hogar</option>
            <option value="Deportes">Deportes</option>
            <option value="Juguetería">Juguetería</option>
            <option value="Belleza">Belleza</option>
            <option value="Ferretería">Ferretería</option>
          </select>
          <input type="number" name="price" placeholder="Precio" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          <input type="number" name="stock" placeholder="Stock" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
          <button type="submit" className="btn">Agregar</button>
        </form>
      </section>

      {/*Buscador de productos*/}
      <section className="card">
        <h2 className="sectionTitle">Buscar Productos</h2>
        <form className="searchBox" onSubmit={handleSearch}>
          <input type="text" placeholder="Escribe nombre o SKU..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <button type="submit" className="btn">Buscar</button>
        </form>

        {query && (
          <table className="table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>SKU</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products.map((p) => (
                  <tr key={p._id}>
                    <td>{p.name}</td>
                    <td>{p.sku}</td>
                    <td>{p.category}</td>
                    <td>${p.price}</td>
                    <td>
                      <input
                        type="number"
                        value={p.stock}
                        onChange={(e) => handleStockChange(p._id, e.target.value)}
                      />
                    </td>
                    <td>
                      <button className="btnDelete" onClick={() => handleDelete(p._id)}>🗑 Eliminar</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">No se encontraron productos</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

export default App;
