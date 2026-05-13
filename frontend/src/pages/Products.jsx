import { useState, useEffect } from 'react'
import ProductCard from '../components/ProductCard'
import API from '../utils/api'

const CATEGORIES = [
  { value: 'all', label: 'All' },
  { value: 'earbuds', label: 'Earbuds' },
  { value: 'watch', label: 'Watches' },
  { value: 'headphones', label: 'Headphones' },
  { value: 'tablet', label: 'Tablets' },
  { value: 'drone', label: 'Drones' },
  { value: 'smart-home', label: 'Smart Home' },
  { value: 'keyboard', label: 'Keyboards' },
  { value: 'monitor', label: 'Monitors' },
  { value: 'gaming', label: 'Gaming' }
]

export default function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [sort, setSort] = useState('newest')

  useEffect(() => { fetchProducts() }, [category, sort])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (category !== 'all') params.append('category', category)
      if (sort) params.append('sort', sort)
      const { data } = await API.get(`/products?${params}`)
      setProducts(data.products)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.description.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="page-section">
      <div className="container">

        {/* Header */}
        <div className="page-header">
          <div className="section-eyebrow" style={{ justifyContent: 'flex-start', marginBottom: 12 }}>
            Our Collection
          </div>
          <h1 className="page-title">All Products</h1>
          <p className="page-subtitle">Explore our complete lineup of premium tech</p>
        </div>

        {/* Category Pills */}
        <div className="d-flex flex-wrap gap-2 mb-4">
          {CATEGORIES.map(c => (
            <button key={c.value}
              onClick={() => setCategory(c.value)}
              style={{
                background: category === c.value
                  ? 'linear-gradient(135deg, var(--gold-light), var(--gold))'
                  : 'var(--black-3)',
                color: category === c.value ? 'var(--black)' : 'var(--white-60)',
                border: category === c.value ? 'none' : '1px solid var(--white-10)',
                borderRadius: '20px',
                padding: '6px 18px',
                fontSize: '0.78rem',
                fontFamily: 'var(--font-ui)',
                fontWeight: 600,
                letterSpacing: '0.8px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textTransform: 'uppercase'
              }}>
              {c.label}
            </button>
          ))}
        </div>

        {/* Filter Bar */}
        <div className="filter-bar mb-4">
          <div className="row g-3 align-items-center">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fas fa-magnifying-glass" style={{ fontSize: '0.85rem' }}></i>
                </span>
                <input type="text" className="form-control"
                  placeholder="Search products..."
                  value={search} onChange={e => setSearch(e.target.value)} />
              </div>
            </div>
            <div className="col-md-4">
              <select className="form-select" value={sort} onChange={e => setSort(e.target.value)}>
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low → High</option>
                <option value="price-high">Price: High → Low</option>
              </select>
            </div>
            <div className="col-md-2">
              <div className="filter-count">
                {loading ? '...' : `${filtered.length} items`}
              </div>
            </div>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border" style={{ width: '2.5rem', height: '2.5rem' }}></div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-5">
            <i className="fas fa-magnifying-glass fa-3x mb-3 d-block" style={{ color: 'var(--white-10)' }}></i>
            <h4 style={{ fontFamily: 'var(--font-display)', textTransform: 'uppercase', color: 'var(--white-60)' }}>
              No Products Found
            </h4>
            <p style={{ fontFamily: 'var(--font-ui)', color: 'var(--white-30)', fontSize: '0.88rem' }}>
              Try a different search or category
            </p>
          </div>
        ) : (
          <div className="row g-4">
            {filtered.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  )
}
