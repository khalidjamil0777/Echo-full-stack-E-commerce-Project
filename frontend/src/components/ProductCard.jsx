import { useApp } from '../context/AppContext'
import { toast } from 'react-toastify'

const CATEGORY_LABELS = {
  'earbuds': 'Audio', 'watch': 'Wearables', 'headphones': 'Audio',
  'tablet': 'Computing', 'drone': 'Aerial', 'smart-home': 'Smart Home',
  'keyboard': 'Peripherals', 'monitor': 'Display', 'gaming': 'Gaming'
}

export default function ProductCard({ product }) {
  const { addToCart } = useApp()

  const handleAddToCart = () => {
    addToCart(product)
    toast.success(`${product.name} added to cart`)
  }

  return (
    <div className="col-md-6 col-lg-4">
      <div className="product-card">
        <div className="product-image">
          <img src={product.image} alt={product.name} loading="lazy" />
          <div className="product-overlay">
            <button className="btn-add-cart" onClick={handleAddToCart}>
              <i className="fas fa-bag-shopping me-2"></i>Add to Cart
            </button>
          </div>
        </div>
        <div className="product-info">
          <div className="product-category">
            {CATEGORY_LABELS[product.category] || product.category}
          </div>
          <h3 className="product-name">{product.name}</h3>
          <p className="product-description">{product.description}</p>
          <div className="product-footer">
            <p className="product-price">₹{product.price.toLocaleString('en-IN')}</p>
            <span className="loyalty-points-badge">
              <i className="fas fa-star me-1" style={{ fontSize: '0.6rem' }}></i>
              +{product.loyaltyPoints} pts
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
