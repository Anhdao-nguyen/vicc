import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="text-9xl mb-4">🔍</div>
      <h1 className="text-4xl font-bold mb-2">404</h1>
      <p className="text-slate-600 mb-8">Trang không tồn tại</p>
      <Link to="/dashboard" className="btn-primary">🏠 Về Dashboard</Link>
    </div>
  )
}

export default NotFound
