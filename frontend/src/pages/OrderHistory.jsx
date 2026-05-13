import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { Link } from 'react-router-dom'
import API from '../utils/api'

export default function OrderHistory() {
  const { user } = useApp()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) API.get('/orders/my-orders')
      .then(({ data }) => setOrders(data.orders))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [user])

  if (!user) return (
    <div className="page-section text-center">
      <i className="fas fa-lock fa-3x mb-3 d-block" style={{ color: 'var(--white-10)' }}></i>
      <h4 style={{ fontFamily: 'var(--font-display)', textTransform: 'uppercase', color: 'var(--white-60)' }}>
        Login Required
      </h4>
      <Link to="/" className="btn-gold d-inline-flex mt-3" style={{ textDecoration: 'none' }}>
        Go Home
      </Link>
    </div>
  )

  return (
    <div className="page-section">
      <div className="container">
        <div className="page-header">
          <div className="section-eyebrow" style={{ justifyContent: 'flex-start', marginBottom: 12 }}>
            Account
          </div>
          <h1 className="page-title">Order History</h1>
          <p className="page-subtitle">{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-5">
            <i className="fas fa-box-open fa-3x mb-3 d-block" style={{ color: 'var(--white-10)' }}></i>
            <h4 style={{ fontFamily: 'var(--font-display)', textTransform: 'uppercase', color: 'var(--white-60)' }}>
              No Orders Yet
            </h4>
            <p style={{ fontFamily: 'var(--font-ui)', color: 'var(--white-30)', fontSize: '0.88rem', marginBottom: 24 }}>
              Start shopping to see your orders here
            </p>
            <Link to="/products" className="btn-gold" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              Shop Now <i className="fas fa-arrow-right"></i>
            </Link>
          </div>
        ) : (
          orders.map(order => (
            <div className="order-card" key={order._id}>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <span className="order-id">#{order.orderId}</span>
                  <span className={`order-status ms-3 ${order.status === 'delivered' ? 'status-delivered' : 'status-confirmed'}`}>
                    {order.status}
                  </span>
                </div>
                <div className="text-end">
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 900, color: 'var(--white)' }}>
                    ₹{order.total.toLocaleString('en-IN')}
                  </div>
                  <div style={{ fontFamily: 'var(--font-ui)', fontSize: '0.75rem', color: 'var(--white-30)', letterSpacing: '0.5px' }}>
                    {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="d-flex flex-wrap gap-2 mb-3">
                {order.items.map((item, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    background: 'var(--black-4)', border: '1px solid var(--white-10)',
                    borderRadius: 'var(--radius-sm)', padding: '6px 12px'
                  }}>
                    <img src={item.image} alt={item.name}
                      style={{ width: 28, height: 28, borderRadius: 4, objectFit: 'cover' }} />
                    <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.8rem', color: 'var(--white-90)' }}>
                      {item.name}
                    </span>
                    <span style={{
                      background: 'var(--white-10)', borderRadius: 20,
                      padding: '1px 8px', fontSize: '0.7rem',
                      color: 'var(--white-60)', fontFamily: 'var(--font-ui)'
                    }}>×{item.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Meta */}
              <div className="d-flex gap-4" style={{ fontFamily: 'var(--font-ui)', fontSize: '0.78rem', color: 'var(--white-30)' }}>
                <span><i className="fas fa-star me-1" style={{ color: 'var(--gold)' }}></i>+{order.loyaltyPointsEarned} pts</span>
                <span><i className="fas fa-truck-fast me-1" style={{ color: 'var(--white-30)' }}></i>
                  {order.shipping === 0 ? 'Free shipping' : `₹${order.shipping} shipping`}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
