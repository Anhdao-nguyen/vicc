import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from '@components/layout/Layout'
import Home from '@pages/Home'
import Dashboard from '@pages/Dashboard'
import Shelling from '@pages/Shelling'
import Import from '@pages/Import'
import Export from '@pages/Export'
import NotFound from '@pages/NotFound'

function App() {
  return (
    <Router>
      <Routes>
        {/* Home page without Layout */}
        <Route path="/" element={<Home />} />

        {/* QC Module with Layout */}
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/shelling" element={<Layout><Shelling /></Layout>} />

        {/* Import-Export Module with Layout */}
        <Route path="/import" element={<Layout><Import /></Layout>} />
        <Route path="/export" element={<Layout><Export /></Layout>} />

        {/* Other departments (placeholder) */}
        <Route path="/hr" element={<Layout><NotFound /></Layout>} />
        <Route path="/hse" element={<Layout><NotFound /></Layout>} />
        <Route path="/maintenance" element={<Layout><NotFound /></Layout>} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default App
