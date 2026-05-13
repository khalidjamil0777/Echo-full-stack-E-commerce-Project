import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import API from '../utils/api'
import { toast } from 'react-toastify'

const EMPTY = { name: '', description: '', price: '', image: '', category: 'earbuds', stock: 50 }
const CATS = ['earbuds','watch','headphones','tablet','drone','smart-home','keyboard','monitor','gaming']

export default function AdminPanel() {
  const { user } = useApp()
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('products')
  const [showForm, setShowForm] = useState(false)
  const [editProduct, setEditProduct] = useState(null)
  const [form, setForm] = useState(EMPTY)

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    try {
      const [p, o] = await Promise.all([API.get('/products'), API.get('/orders')])
      setProducts(p.data.products)
      setOrders(o.data.orders)
    } catch { toast.error('Failed to load data') }
    finally { setLoading(false) }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const payload = { ...form, price: Number(form.price), stock: Number(form.stock) }
      if (editProduct) {
        await API.put(`/products/${editProduct._id}`, payload)
        toast.success('Product updated!')
      } else {
        await API.post('/products', payload)
        toast.success('Product created!')
      }
      setShowForm(false); setEditProduct(null); setForm(EMPTY); fetchData()
    } catch (e) { toast.error(e.response?.data?.message || 'Failed') }
  }

  const handleEdit = (p) => {
    setEditProduct(p)
    setForm({ name: p.name, description: p.description, price: p.price, image: p.image, category: p.category, stock: p.stock })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return
    try { await API.delete(`/products/${id}`); toast.success('Deleted!'); fetchData() }
    catch { toast.error('Failed') }
  }

  const up = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  if (user?.role !== 'admin') return null

  return (
    <div className="page-section">
      <div className="container">
        <div className="page-header d-flex justify-content-between align-items-end">
          <div>
            <div className="section-eyebrow" style={{ justifyContent: 'flex-start', marginBottom: 12 }}>Dashboard</div>
            <h1 className="page-title">Admin Panel</h1>
          </div>
          <div className="d-flex gap-2">
            {[['bg-primary', products.length, 'Products'], ['bg-success', orders.length, 'Orders']].map(([cls, n, label]) => (
              <div key={label} style={{
                background: 'var(--black-3)', border: '1px solid var(--white-10)',
                borderRadius: 'var(--radius-md)', padding: '12px 20px', textAlign: 'center'
              }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 900, color: 'var(--gold)' }}>{n}</div>
                <div style={{ fontFamily: 'var(--font-ui)', fontSize: '0.7rem', letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--white-30)' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <ul className="nav nav-tabs">
          {[['products', 'fa-box', 'Products'], ['orders', 'fa-bag-shopping', 'Orders']].map(([key, icon, label]) => (
            <li className="nav-item" key={key}>
              <button className={`nav-link ${tab === key ? 'active' : ''}`} onClick={() => setTab(key)}>
                <i className={`fas ${icon} me-2`}></i>{label}
              </button>
            </li>
          ))}
        </ul>

        {/* Products Tab */}
        {tab === 'products' && (
          <>
            <div className="d-flex justify-content-end mb-3">
              <button className="btn btn-primary btn-sm"
                onClick={() => { setShowForm(true); setEditProduct(null); setForm(EMPTY) }}>
                <i className="fas fa-plus me-2"></i>Add Product
              </button>
            </div>

            {showForm && (
              <div className="admin-card mb-4">
                <h5 style={{ fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--white)', fontSize: '1rem', marginBottom: 20 }}>
                  {editProduct ? '✏️ Edit Product' : '➕ New Product'}
                </h5>
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6"><input className="form-control" placeholder="Product Name" value={form.name} onChange={up('name')} required /></div>
                    <div className="col-md-3"><input type="number" className="form-control" placeholder="Price (₹)" value={form.price} onChange={up('price')} required /></div>
                    <div className="col-md-3"><input type="number" className="form-control" placeholder="Stock" value={form.stock} onChange={up('stock')} /></div>
                    <div className="col-md-8"><input className="form-control" placeholder="Image URL" value={form.image} onChange={up('image')} required /></div>
                    <div className="col-md-4">
                      <select className="form-select" value={form.category} onChange={up('category')}>
                        {CATS.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="col-12"><textarea className="form-control" placeholder="Description" rows={2} value={form.description} onChange={up('description')} required /></div>
                  </div>
                  <div className="d-flex gap-2 mt-3">
                    <button type="submit" className="btn btn-primary btn-sm">{editProduct ? 'Update' : 'Create'}</button>
                    <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => { setShowForm(false); setEditProduct(null) }}>Cancel</button>
                  </div>
                </form>
              </div>
            )}

            {loading ? <div className="text-center py-4"><div className="spinner-border"></div></div> : (
              <div className="admin-card">
                <div className="table-responsive">
                  <table className="table mb-0">
                    <thead>
                      <tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Points</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                      {products.map(p => (
                        <tr key={p._id}>
                          <td>
                            <div className="d-flex align-items-center gap-3">
                              <img src={p.image} alt={p.name} style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover', border: '1px solid var(--white-10)' }} />
                              <div>
                                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '0.5px' }}>{p.name}</div>
                                <div style={{ fontFamily: 'var(--font-ui)', fontSize: '0.75rem', color: 'var(--white-30)' }}>{p.description.slice(0,42)}...</div>
                              </div>
                            </div>
                          </td>
                          <td><span className="badge bg-light">{p.category}</span></td>
                          <td style={{ fontFamily: 'var(--font-display)', fontWeight: 900, color: 'var(--white)', fontSize: '1rem' }}>₹{p.price.toLocaleString('en-IN')}</td>
                          <td style={{ color: 'var(--white-60)' }}>{p.stock}</td>
                          <td><span className="loyalty-points-badge">+{p.loyaltyPoints}</span></td>
                          <td>
                            <div className="d-flex gap-2">
                              <button className="btn btn-outline-primary btn-sm" onClick={() => handleEdit(p)}><i className="fas fa-pen"></i></button>
                              <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(p._id)}><i className="fas fa-trash"></i></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {/* Orders Tab */}
        {tab === 'orders' && (
          loading ? <div className="text-center py-4"><div className="spinner-border"></div></div> : (
            <div className="admin-card">
              <div className="table-responsive">
                <table className="table mb-0">
                  <thead>
                    <tr><th>Order ID</th><th>Customer</th><th>Items</th><th>Total</th><th>Points</th><th>Date</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {orders.map(o => (
                      <tr key={o._id}>
                        <td style={{ fontFamily: 'var(--font-display)', color: 'var(--gold)', fontSize: '0.85rem', letterSpacing: '0.5px' }}>#{o.orderId}</td>
                        <td>
                          <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 500 }}>{o.user?.name}</div>
                          <div style={{ fontFamily: 'var(--font-ui)', fontSize: '0.75rem', color: 'var(--white-30)' }}>{o.user?.email}</div>
                        </td>
                        <td style={{ color: 'var(--white-60)' }}>{o.items.reduce((s,i)=>s+i.quantity,0)}</td>
                        <td style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1rem' }}>₹{o.total.toLocaleString('en-IN')}</td>
                        <td style={{ color: 'var(--gold)', fontWeight: 700 }}>+{o.loyaltyPointsEarned}</td>
                        <td style={{ color: 'var(--white-30)', fontSize: '0.8rem' }}>{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                        <td><span className={`order-status ${o.status === 'delivered' ? 'status-delivered' : 'status-confirmed'}`}>{o.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  )
}
