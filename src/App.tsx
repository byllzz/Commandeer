import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import Home from './pages/Home'
import Docs from './pages/Docs'
import Help from './pages/Help'
import About from './pages/About'
import './commands/registry' // side-effect: registers built-in commands on load

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/docs" element={<Docs />} />
        <Route path="/help" element={<Help />} />
        <Route path="/about" element={<About />} />
      </Route>
    </Routes>
  )
}
