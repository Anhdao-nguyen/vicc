const StatCard = ({ icon, label, value, bgColor = 'bg-blue-500' }) => {
  return (
    <div className={`card ${bgColor} text-white`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm opacity-90 mb-1">{label}</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
        <div className="text-5xl opacity-20">{icon}</div>
      </div>
    </div>
  )
}

export default StatCard
