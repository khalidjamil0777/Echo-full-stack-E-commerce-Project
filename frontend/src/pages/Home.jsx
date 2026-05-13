import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import API from '../utils/api'
import { toast } from 'react-toastify'

export default function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')

  useEffect(() => {
    API.get('/products').then(({ data }) => {
      setProducts(data.products.slice(0, 6))
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const handleNewsletter = (e) => {
    e.preventDefault()
    toast.success('Subscribed successfully!')
    setEmail('')
  }

  return (
    <>
      {/* ── HERO ── */}
      <section id="home" className="hero-section">
        <div className="hero-grid"></div>
        <div className="container position-relative" style={{ zIndex: 1 }}>
          <div className="row align-items-center">

            {/* Left */}
            <div className="col-lg-6 mb-5 mb-lg-0">
              <div className="hero-eyebrow">Premium Tech Gadgets</div>
              <h1 className="hero-title">
                Experience
                <span className="gold-word">Sound Like</span>
                Never Before
              </h1>
              <p className="hero-subtitle">
                Precision-engineered gadgets for those who demand the extraordinary.
                Every product crafted for peak performance and uncompromising style.
              </p>
              <div className="hero-buttons">
                <Link to="/products" className="btn-gold">
                  Shop Collection <i className="fas fa-arrow-right"></i>
                </Link>
                <a href="#features" className="btn-outline-gold">
                  Discover More
                </a>
              </div>
              <div className="hero-stats">
                <div>
                  <div className="hero-stat-number">9+</div>
                  <div className="hero-stat-label">Products</div>
                </div>
                <div>
                  <div className="hero-stat-number">1pt</div>
                  <div className="hero-stat-label">per ₹100</div>
                </div>
                <div>
                  <div className="hero-stat-number">8</div>
                  <div className="hero-stat-label">Rewards</div>
                </div>
                <div>
                  <div className="hero-stat-number">2yr</div>
                  <div className="hero-stat-label">Warranty</div>
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="col-lg-6 d-flex justify-content-center">
              <div className="hero-image-wrap">
                <div className="hero-image-ring-2"></div>
                <div className="hero-image-ring"></div>
                <img
                  src="https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800"
                  alt="Echo Buds Pro"
                  className="hero-image"
                />
                <div className="hero-badge">
                  <div className="hero-badge-icon">
                    <i className="fas fa-star"></i>
                  </div>
                  <div>
                    <div className="hero-badge-text">Loyalty Points</div>
                    <div className="hero-badge-value">Earn & Redeem</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── PRODUCTS ── */}
      <section id="products" className="products-section">
        <div className="container">
          <div className="text-center mb-5">
            <div className="section-eyebrow">Our Collection</div>
            <h2 className="section-title">Featured Products</h2>
            <p className="section-subtitle mt-2">Precision-engineered for the modern lifestyle</p>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border" style={{ width: '2.5rem', height: '2.5rem' }}></div>
            </div>
          ) : (
            <>
              <div className="row g-4">
                {products.map(p => <ProductCard key={p._id} product={p} />)}
              </div>
              <div className="text-center mt-5">
                <Link to="/products" className="btn-gold">
                  View All Products <i className="fas fa-arrow-right ms-2"></i>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="features-section">
        <div className="container">
          <div className="text-center mb-5">
            <div className="section-eyebrow">Why Echo</div>
            <h2 className="section-title">Built Different</h2>
          </div>
          <div className="row g-4">
            {[
              { icon: 'fa-truck-fast', title: 'Free Shipping', desc: 'Complimentary delivery on all orders above ₹2,000. Fast, insured, and tracked.' },
              { icon: 'fa-shield-halved', title: '2 Year Warranty', desc: 'Full manufacturer warranty on every product. Peace of mind, guaranteed.' },
              { icon: 'fa-headset', title: '24 / 7 Support', desc: 'Our specialists are available around the clock to assist you anytime.' },
              { icon: 'fa-gem', title: 'Loyalty Rewards', desc: 'Earn 1 point for every ₹100 spent. Redeem for vouchers, perks, and more.' },
            ].map((f, i) => (
              <div className="col-md-6 col-lg-3" key={i}>
                <div className="feature-box">
                  <div className="feature-icon"><i className={`fas ${f.icon}`}></i></div>
                  <h4>{f.title}</h4>
                  <p>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ── */}
      <section id="contact" className="newsletter-section">
        <div className="container position-relative" style={{ zIndex: 1 }}>
          <div className="row justify-content-center">
            <div className="col-lg-6 text-center">
              <div className="section-eyebrow" style={{ justifyContent: 'center' }}>Stay Connected</div>
              <h2 className="newsletter-title">Exclusive Access</h2>
              <p className="newsletter-subtitle">
                Subscribe for early access to new launches, exclusive deals, and loyalty bonuses.
              </p>
              <form onSubmit={handleNewsletter}>
                <div className="newsletter-form">
                  <div className="input-group">
                    <input
                      type="email" className="form-control"
                      placeholder="Enter your email address"
                      value={email} onChange={e => setEmail(e.target.value)} required
                    />
                    <button className="btn" type="submit">Subscribe</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="container">
          <div className="row">
            <div className="col-md-4 mb-4">
              <div className="footer-brand">Echo</div>
              <p className="footer-text">
                Premium tech gadgets engineered for the modern lifestyle.
                Innovative devices that elevate every experience.
              </p>
            </div>
            <div className="col-md-4 mb-4">
              <h5 className="footer-title">Navigate</h5>
              <ul className="footer-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/products">Products</Link></li>
                <li><a href="#features">Features</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </div>
            <div className="col-md-4 mb-4">
              <h5 className="footer-title">Follow Echo</h5>
              <div className="social-icons">
                <a href="#"><i className="fab fa-instagram"></i></a>
                <a href="#"><i className="fab fa-twitter"></i></a>
                <a href="#"><i className="fab fa-youtube"></i></a>
                <a href="#"><i className="fab fa-linkedin"></i></a>
              </div>
            </div>
          </div>
          <hr className="footer-divider" />
          <p className="text-center footer-copyright">
            © 2025 Echo Premium Tech Gadgets. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  )
}
