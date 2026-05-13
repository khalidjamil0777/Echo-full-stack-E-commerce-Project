import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Products from './pages/Products'
import OrderHistory from './pages/OrderHistory'
import AdminPanel from './pages/AdminPanel'
import { useApp } from './context/AppContext'

function App() {
  const { user } = useApp()

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/orders" element={user ? <OrderHistory /> : <Home />} />
        <Route path="/admin" element={user?.role === 'admin' ? <AdminPanel /> : <Home />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
