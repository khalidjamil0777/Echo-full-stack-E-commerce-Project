import { useApp } from '../context/AppContext'
import { toast } from 'react-toastify'
import API from '../utils/api'

export default function CartModal({ onClose, onLoginRequired }) {
  const { user, cart, removeFromCart, updateQuantity, clearCart,
          cartTotal, shipping, orderTotal, pointsToEarn, refreshUser } = useApp()

  const handleCheckout = async () => {
    if (!user) { toast.error('Please login to checkout'); onLoginRequired(); return }
    if (cart.length === 0) { toast.error('Your cart is empty'); return }

    const items = cart.map(item => ({ productId: item._id, quantity: item.quantity }))

    try {
      const hasRazorpay = import.meta.env.VITE_RAZORPAY_KEY_ID &&
        import.meta.env.VITE_RAZORPAY_KEY_ID !== 'your_razorpay_key_id'

      if (hasRazorpay) await handleRazorpayCheckout(items)
      else await handleSimulatedCheckout(items)
    } catch (error) {
      toast.error('Checkout failed. Please try again.')
    }
  }

  const handleRazorpayCheckout = async (items) => {
    const { data } = await API.post('/orders/create-razorpay-order', { items })
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: data.amount * 100,
      currency: 'INR',
      name: 'Echo Premium',
      description: 'Tech Gadgets Purchase',
      order_id: data.razorpayOrderId,
      handler: async (response) => {
        const res = await API.post('/orders/verify-payment', {
          razorpayOrderId: response.razorpay_order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpaySignature: response.razorpay_signature,
          items
        })
        if (res.data.success) handleOrderSuccess(res.data)
      },
      prefill: { name: user.name, email: user.email },
      theme: { color: '#c9a84c' }
    }
    new window.Razorpay(options).open()
  }

  const handleSimulatedCheckout = async (items) => {
    const { data } = await API.post('/orders/simulate', { items })
    if (data.success) handleOrderSuccess(data)
  }

  const handleOrderSuccess = async (data) => {
    toast.success(`Order ${data.order.orderId} confirmed!`)
    setTimeout(() => toast.info(`⭐ +${data.order.pointsEarned} loyalty points earned!`), 1200)
    clearCart()
    await refreshUser()
    onClose()
  }

  return (
    <div className="modal-overlay active" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="cart-modal-container">

        <div className="cart-header">
          <h2 className="cart-title">Your Cart</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        <div className="cart-body">
          {cart.length === 0 ? (
            <div className="empty-cart">
              <i className="fas fa-bag-shopping empty-cart-icon"></i>
              <h3>Cart is empty</h3>
              <p>Add some products to get started</p>
            </div>
          ) : (
            cart.map(item => (
              <div className="cart-item" key={item._id}>
                <img src={item.image} alt={item.name} className="cart-item-img" />
                <div className="cart-item-info">
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-price">₹{(item.price * item.quantity).toLocaleString('en-IN')}</div>
                </div>
                <div className="qty-controls">
                  <button className="qty-btn" onClick={() => updateQuantity(item._id, item.quantity - 1)}>−</button>
                  <span className="qty-num">{item.quantity}</span>
                  <button className="qty-btn" onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
                </div>
                <button className="btn-remove" onClick={() => removeFromCart(item._id)}>
                  <i className="fas fa-xmark"></i>
                </button>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{cartTotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span style={{ color: shipping === 0 ? 'var(--green)' : 'inherit' }}>
                {shipping === 0 ? 'Free' : `₹${shipping}`}
              </span>
            </div>
            <div className="loyalty-row">
              <i className="fas fa-star"></i>
              You'll earn <strong style={{ margin: '0 4px' }}>{pointsToEarn}</strong> loyalty points
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>₹{orderTotal.toLocaleString('en-IN')}</span>
            </div>
            <button className="btn-checkout" onClick={handleCheckout}>
              Checkout <i className="fas fa-arrow-right"></i>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
