import { Link, useLocation } from 'react-router-dom'
import { PROCESS_STAGES } from '@/utils/constants'

const Sidebar = () => {
  const location = useLocation()
  const isImportExportModule = location.pathname.startsWith('/import') || location.pathname.startsWith('/export')

  return (
    <aside className="w-64 bg-white border-r border-slate-200 h-[calc(100vh-73px)] sticky top-[73px] hidden lg:block overflow-y-auto shadow-md">
      <div className="p-4">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
          Menu
        </h3>

        <nav className="space-y-1">
          {isImportExportModule ? (
            <>
              {/* Import-Export Menu */}
              <Link
                to="/import"
                className={`flex items-center px-4 py-3 rounded-lg transition-all ${
                  location.pathname === '/import'
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="text-xl mr-3">📦</span>
                <span className="text-sm">Import</span>
              </Link>

              <Link
                to="/export"
                className={`flex items-center px-4 py-3 rounded-lg transition-all ${
                  location.pathname === '/export'
                    ? 'bg-green-50 text-green-700 font-medium'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="text-xl mr-3">🚢</span>
                <span className="text-sm">Export</span>
              </Link>

              <div className="pt-4">
                <Link
                  to="/"
                  className="flex items-center px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-50 transition-all"
                >
                  <span className="text-xl mr-3">🏠</span>
                  <span className="text-sm">Back to Home</span>
                </Link>
              </div>
            </>
          ) : (
            <>
              {/* QC Module Menu */}
              <Link
                to="/dashboard"
                className={`flex items-center px-4 py-3 rounded-lg transition-all ${
                  location.pathname === '/dashboard'
                    ? 'bg-red-50 text-red-700 font-medium'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="text-xl mr-3">🏠</span>
                <span className="text-sm">Dashboard</span>
              </Link>

              {/* Divider */}
              <div className="pt-4 pb-2">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-4">
                  Công đoạn QC
                </h3>
              </div>

              {/* Process Stages */}
              {PROCESS_STAGES.map((stage) => (
                <div key={stage.id}>
                  {stage.status === 'active' ? (
                    <Link
                      to={stage.path}
                      className={`flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                        location.pathname === stage.path
                          ? 'bg-red-50 text-red-700 font-medium'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="text-xl mr-3">{stage.icon}</span>
                        <span className="text-sm">{stage.name}</span>
                      </div>
                    </Link>
                  ) : (
                    <div className="flex items-center justify-between px-4 py-3 rounded-lg text-slate-400 cursor-not-allowed">
                      <div className="flex items-center">
                        <span className="text-xl mr-3">{stage.icon}</span>
                        <span className="text-sm">{stage.name}</span>
                      </div>
                      <span className="text-xs bg-slate-100 px-2 py-0.5 rounded">Soon</span>
                    </div>
                  )}
                </div>
              ))}
            </>
          )}
        </nav>
      </div>
    </aside>
  )
}

export default Sidebar
