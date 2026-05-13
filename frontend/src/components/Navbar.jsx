import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { toast } from 'react-toastify'
import CartModal from './CartModal'
import AuthModal from './AuthModal'
import RewardsModal from './RewardsModal'

export default function Navbar() {
  const { user, logout, cartCount } = useApp()
  const [showCart, setShowCart] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [showRewards, setShowRewards] = useState(false)
  const location = useLocation()

  const handleLoginClick = (e) => {
    e.preventDefault()
    if (user) {
      if (confirm('Are you sure you want to logout?')) {
        logout()
        toast.success('Logged out successfully')
      }
    } else {
      setShowAuth(true)
    }
  }

  const handleRewardsClick = (e) => {
    e.preventDefault()
    if (!user) {
      toast.error('Please login to access Rewards Store')
      setShowAuth(true)
      return
    }
    setShowRewards(true)
  }

  const isActive = (path) => location.pathname === path

  return (
    <>
      <nav className="navbar navbar-expand-lg fixed-top">
        <div className="container">
          <Link className="navbar-brand text-decoration-none" to="/">
            <span className="brand-name">Echo</span>
          </Link>

          <button className="navbar-toggler" type="button"
            data-bs-toggle="collapse" data-bs-target="#navbarNav"
            aria-controls="navbarNav" aria-expanded="false">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto align-items-center gap-1">
              <li className="nav-item">
                <Link className="nav-link" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/products">Products</Link>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/#features">Features</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/#contact">Contact</a>
              </li>
              <li className="nav-item ms-1">
                <a className="nav-link rewards-link" href="#" onClick={handleRewardsClick}>
                  <i className="fas fa-gem me-1"></i>Rewards
                </a>
              </li>
              {user && (
                <li className="nav-item">
                  <Link className="nav-link" to="/orders">
                    <i className="fas fa-box me-1"></i>Orders
                  </Link>
                </li>
              )}
              {user?.role === 'admin' && (
                <li className="nav-item">
                  <Link className="nav-link" to="/admin" style={{ color: 'var(--gold)' }}>
                    <i className="fas fa-sliders me-1"></i>Admin
                  </Link>
                </li>
              )}
              {/* Cart */}
              <li className="nav-item ms-2">
                <a className="nav-link cart-icon" href="#"
                  onClick={(e) => { e.preventDefault(); setShowCart(true) }}>
                  <i className="fas fa-bag-shopping" style={{ fontSize: '1rem' }}></i>
                  <span className="cart-count">{cartCount}</span>
                </a>
              </li>
              {/* Login / User */}
              <li className="nav-item ms-2">
                <a className="nav-link nav-login-btn" href="#" onClick={handleLoginClick}>
                  {user ? (
                    <>
                      <i className="fas fa-user-circle me-1"></i>
                      {user.name.split(' ')[0]}
                      {user.loyaltyPoints > 0 && (
                        <span className="loyalty-badge">
                          <i className="fas fa-star" style={{ fontSize: '0.6rem' }}></i> {user.loyaltyPoints}
                        </span>
                      )}
                    </>
                  ) : (
                    <><i className="fas fa-arrow-right-to-bracket me-1"></i>Login</>
                  )}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {showCart && (
        <CartModal
          onClose={() => setShowCart(false)}
          onLoginRequired={() => { setShowCart(false); setShowAuth(true) }}
        />
      )}
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      {showRewards && <RewardsModal onClose={() => setShowRewards(false)} />}
    </>
  )
}
