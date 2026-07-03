// src/pages/admin/AdminProducts.jsx
import React, { useEffect, useState } from 'react';
import { fetchAdminProducts, deleteProduct } from '../../services/adminProductService';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchAdminProducts({ page, limit: 20, search });
      setProducts(data.products);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    loadProducts();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deactivate this product?')) return;
    try {
      await deleteProduct(id);
      loadProducts();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h1>Products</h1>
        {/* Wire this to an AdminProductForm page/modal next */}
        <button onClick={() => alert('TODO: open create product form')}>+ Add Product</button>
      </div>

      <form onSubmit={handleSearch} style={{ marginBottom: '1rem' }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
        />
        <button type="submit">Search</button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
                <td>
                  {p.images?.[0] && (
                    <img src={p.images[0].url} alt={p.name} width={40} height={40} style={{ objectFit: 'cover' }} />
                  )}
                </td>
                <td>{p.name}</td>
                <td>{p.category?.name}</td>
                <td>₹{p.price}</td>
                <td>{p.stock}</td>
                <td>{p.isActive ? 'Active' : 'Inactive'}</td>
                <td>
                  <button onClick={() => alert('TODO: edit')}>Edit</button>
                  <button onClick={() => handleDelete(p.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div style={{ marginTop: '1rem' }}>
        <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Prev</button>
        <span style={{ margin: '0 1rem' }}>Page {page} of {totalPages}</span>
        <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</button>
      </div>
    </div>
  );
};

export default AdminProducts;