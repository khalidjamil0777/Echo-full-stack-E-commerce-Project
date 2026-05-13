import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { toast } from 'react-toastify'
import API from '../utils/api'

export default function RewardsModal({ onClose }) {
  const { refreshUser } = useApp()
  const [rewards, setRewards] = useState([])
  const [userPoints, setUserPoints] = useState(0)
  const [loading, setLoading] = useState(true)
  const [redeeming, setRedeeming] = useState(null)

  useEffect(() => { fetchRewards() }, [])

  const fetchRewards = async () => {
    try {
      const { data } = await API.get('/rewards')
      setRewards(data.rewards)
      setUserPoints(data.userPoints)
    } catch { toast.error('Failed to load rewards') }
    finally { setLoading(false) }
  }

  const handleRedeem = async (reward) => {
    if (!confirm(`Redeem "${reward.name}" for ${reward.points} points?`)) return
    setRedeeming(reward.id)
    try {
      const { data } = await API.post('/rewards/redeem', { rewardId: reward.id })
      toast.success(data.message)
      if (data.reward?.voucherCode) {
        setTimeout(() => toast.info(`🎟️ Code: ${data.reward.voucherCode}`, { autoClose: 8000 }), 800)
      }
      setUserPoints(data.remainingPoints)
      await refreshUser()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Redemption failed')
    } finally { setRedeeming(null) }
  }

  return (
    <div className="modal-overlay active" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="rewards-modal-container">
        <div className="rewards-header">
          <div>
            <h2 className="rewards-title">
              <i className="fas fa-gem me-2" style={{ color: 'var(--gold)', fontSize: '1.2rem' }}></i>
              Rewards Store
            </h2>
            <p className="user-points">
              <i className="fas fa-star me-1"></i>
              Your balance: <strong>{userPoints} points</strong>
            </p>
          </div>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        <div className="rewards-body">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border"></div>
              <p className="mt-3" style={{ color: 'var(--white-60)', fontFamily: 'var(--font-ui)', fontSize: '0.85rem' }}>
                Loading rewards...
              </p>
            </div>
          ) : (
            <div className="rewards-grid">
              {rewards.map(reward => {
                const canRedeem = userPoints >= reward.points
                return (
                  <div key={reward.id} className={`reward-card ${!canRedeem ? 'disabled' : ''}`}>
                    <div className="reward-icon">
                      <i className={`fas ${reward.icon}`}></i>
                    </div>
                    <h4 className="reward-name">{reward.name}</h4>
                    <p className="reward-points">
                      <i className="fas fa-star me-1"></i>{reward.points} pts
                    </p>
                    <button
                      className={`btn w-100 btn-sm ${canRedeem ? 'btn-primary' : 'btn-outline-secondary'}`}
                      disabled={!canRedeem || redeeming === reward.id}
                      onClick={() => canRedeem && handleRedeem(reward)}
                    >
                      {redeeming === reward.id
                        ? <span className="spinner-border spinner-border-sm"></span>
                        : canRedeem ? 'Redeem' : 'Need more pts'}
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
