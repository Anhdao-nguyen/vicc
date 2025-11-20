import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Home() {
  const navigate = useNavigate()
  const [selectedDept, setSelectedDept] = useState(null)

  const departments = [
    {
      id: 'hr',
      name: 'HR',
      title: 'Human Resources',
      path: '/hr',
      icon: '👥'
    },
    {
      id: 'hse',
      name: 'HSE',
      title: 'Health, Safety & Environment',
      path: '/hse',
      icon: '🛡️'
    },
    {
      id: 'maintenance',
      name: 'Maintenance',
      title: 'Maintenance',
      path: '/maintenance',
      icon: '🔧'
    },
    {
      id: 'qc',
      name: 'QC',
      title: 'Quality Control',
      path: '/dashboard',
      icon: '✅'
    },
    {
      id: 'import-export',
      name: 'Import-Export',
      title: 'Import & Export',
      path: '/import',
      icon: '🚢'
    }
  ]

  const handleDepartmentClick = (dept) => {
    setSelectedDept(dept.id)
    setTimeout(() => {
      if (dept.id === 'qc' || dept.id === 'import-export') {
        navigate(dept.path)
      } else {
        alert(`Chức năng ${dept.name} đang được phát triển`)
        setSelectedDept(null)
      }
    }, 300)
  }

  return (
    <div className="min-h-screen flex animate-fadeIn bg-gradient-to-br from-white via-gray-400 to-black">
      {/* Left Content Section */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-between px-8 py-12 bg-transparent relative">
        {/* Company Logo */}
        <div className="absolute top-8 left-8">
          <img
            src="/images/factory-logo.png"
            alt="Company Logo"
            className="w-16 h-16 object-contain"
            onError={(e) => {
              e.target.style.display = 'none'
            }}
          />
        </div>

        <div className="flex-1 flex flex-col items-center justify-center w-full">
          {/* Welcome Text */}
          <p className="text-2xl italic text-slate-400 mb-8 font-serif animate-slideDown flex items-center gap-2">
            <span className="text-3xl">👋</span> Welcome back
          </p>

          {/* Hero Section */}
          <div className="text-center mb-12 animate-slideDown">
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-4 leading-tight tracking-tight">
              Datacore <span className="text-red-500">Factory</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 font-light tracking-wide">
              Hệ thống quản lý dữ liệu nhà máy
            </p>
          </div>

          {/* Department Cards */}
          <div className="grid grid-cols-2 gap-4 max-w-xl w-full mb-8">
            {departments.map((dept) => (
              <button
                key={dept.id}
                onClick={() => handleDepartmentClick(dept)}
                className={`
                  group relative p-6 rounded-2xl text-left
                  transition-all duration-300 transform hover:scale-105
                  ${selectedDept === dept.id
                    ? 'bg-gradient-to-br from-red-500 to-orange-600 text-white shadow-xl scale-105'
                    : 'bg-white text-slate-700 shadow-lg hover:shadow-xl'
                  }
                `}
                style={{
                  boxShadow: selectedDept === dept.id
                    ? '0 15px 35px rgba(239, 68, 68, 0.4)'
                    : '0 4px 12px rgba(0, 0, 0, 0.1)',
                  minHeight: '130px'
                }}
              >
                <div className="relative z-10">
                  <div className="text-4xl mb-3">{dept.icon}</div>
                  <h3 className="text-2xl font-bold mb-1">{dept.name}</h3>
                  <p className={`text-xs ${selectedDept === dept.id ? 'text-white/80' : 'text-slate-500'}`}>
                    {dept.title}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Instruction Text */}
          <div className="text-center">
            <p className="text-sm text-slate-500 font-light tracking-wide">
              Chọn bộ phận để bắt đầu làm việc
            </p>
          </div>
        </div>

        {/* Footer Text */}
        <div className="text-center mt-8">
          <p className="text-xs text-slate-400 tracking-wider">
            R&D Process & Optimization
          </p>
        </div>
      </div>

      {/* Right Background Image Section */}
      <div className="hidden md:flex w-1/2 relative bg-transparent items-center justify-center p-8">
        <div
          className="w-full h-full bg-cover bg-center bg-no-repeat rounded-3xl shadow-lg"
          style={{
            backgroundImage: 'url(/images/cashew.jpg)',
          }}
        >
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out;
        }

        .animate-slideDown {
          animation: slideDown 0.8s ease-out;
        }
      `}</style>
    </div>
  )
}

export default Home
