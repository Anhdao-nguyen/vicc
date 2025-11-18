import Card from '@/components/common/Card'
import StatCard from '@/components/common/StatCard'
import { PROCESS_STAGES } from '@/utils/constants'
import { Link } from 'react-router-dom'
import { useShellingData } from '@/hooks/useShellingData'
import { calculateStats, formatDate, getQCStatus, getStatusConfig } from '@/utils/helpers'

const Dashboard = () => {
  const { records } = useShellingData()
  const stats = calculateStats(records)

  return (
    <div className="space-y-6">
      <div>
        <h1>📊 Dashboard</h1>
        <p className="text-slate-600">Tổng quan 9 công đoạn QC</p>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Các công đoạn</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {PROCESS_STAGES.map((stage) => (
            <Link key={stage.id} to={stage.path} className={stage.status === 'coming' ? 'pointer-events-none' : ''}>
              <Card className="hover:shadow-lg transition">
                <h3 className="font-semibold text-lg mb-2">{stage.name}</h3>
                {stage.status === 'active' ? (
                  <div className="mt-2 text-sm">
                    <p className="text-slate-600">{stats.totalRecords} lô</p>
                    <p className="text-green-600 font-medium">✅ {stats.passRate}%</p>
                  </div>
                ) : (
                  <p className="text-sm text-slate-400 mt-2">Coming Soon</p>
                )}
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <StatCard icon="📦" label="Tổng lô" value={stats.totalRecords} />
        <StatCard icon="✅" label="Tỷ lệ đạt" value={`${stats.passRate}%`} bgColor="bg-green-500" />
        <StatCard icon="🏭" label="Hoạt động" value="1/9" bgColor="bg-red-500" />
        <StatCard icon="👥" label="QC Staff" value={stats.uniqueInspectors} bgColor="bg-orange-500" />
      </div>

      <Card title="📋 Dữ liệu mới (Shelling)">
        {records.length === 0 ? (
          <p className="text-center py-8 text-slate-500">Chưa có dữ liệu</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-2 text-left">Ngày</th>
                    <th className="px-4 py-2 text-left">Ca</th>
                    <th className="px-4 py-2 text-left">Line</th>
                    <th className="px-4 py-2 text-left">QC</th>
                    <th className="px-4 py-2 text-left">%W</th>
                    <th className="px-4 py-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {records.slice(0, 5).map((r) => {
                    const status = getQCStatus(r.wholePercent)
                    const config = getStatusConfig(status)
                    return (
                      <tr key={r.id} className="border-t">
                        <td className="px-4 py-2">{formatDate(r.date)}</td>
                        <td className="px-4 py-2">{r.shift}</td>
                        <td className="px-4 py-2">{r.line}</td>
                        <td className="px-4 py-2">{r.qcName}</td>
                        <td className="px-4 py-2">{r.wholePercent}%</td>
                        <td className="px-4 py-2">{config.icon} {config.label}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-center">
              <Link to="/shelling" className="text-red-600 hover:underline">Xem tất cả →</Link>
            </div>
          </>
        )}
      </Card>
    </div>
  )
}

export default Dashboard
