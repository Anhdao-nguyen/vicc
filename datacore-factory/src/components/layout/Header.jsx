import { Link, useNavigate, useLocation } from 'react-router-dom'

const Header = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    navigate('/')
  }

  // Determine which module we're in
  const isImportExportModule = location.pathname.startsWith('/import') || location.pathname.startsWith('/export')

  // Set title and navigation based on module
  const moduleTitle = isImportExportModule ? 'Import-Export Tracking' : 'QC Management System'
  const homePath = isImportExportModule ? '/import' : '/dashboard'

  const navItems = isImportExportModule
    ? [
        { path: '/import', label: 'Import', icon: '📦' },
        { path: '/export', label: 'Export', icon: '🚢' }
      ]
    : [
        { path: '/dashboard', label: 'Dashboard' },
        { path: '/shelling', label: 'Shelling' }
      ]

  return (
    <header className="bg-black border-b border-slate-700 sticky top-0 z-50 shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link to={homePath} className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center p-1.5 border border-slate-300">
            <img
              src="/images/factory-logo.png"
              alt="Factory Logo"
              className="w-full h-full object-contain"
              onError={(e) => {
                e.target.style.display = 'none'
                e.target.parentElement.innerHTML = '<span class="text-red-600 font-bold text-xl">🏭</span>'
              }}
            />
          </div>
          <div>
            <span className="text-2xl font-bold text-white">
              Datacore <span className="text-red-500">Factory</span>
            </span>
            <p className="text-xs text-slate-400">{moduleTitle}</p>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item, index) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                location.pathname === item.path
                  ? 'bg-red-600 text-white'
                  : 'text-slate-300 hover:text-red-500 hover:bg-slate-800'
              }`}
            >
              {item.icon && <span>{item.icon}</span>}
              {index === 0 && !isImportExportModule && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              )}
              {item.label}
            </Link>
          ))}
          {!isImportExportModule && (
            <div className="px-4 py-2 text-slate-500 cursor-not-allowed">
              + 8 công đoạn
            </div>
          )}
        </nav>

        {/* User menu */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 cursor-pointer hover:bg-slate-800 px-3 py-2 rounded-lg">
            <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center text-white font-semibold">
              A
            </div>
            <span className="text-sm font-medium text-white hidden md:block">Admin</span>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-slate-800 rounded-lg transition-all"
            title="Logout"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
