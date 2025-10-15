
import { Routes, Route, useLocation, Navigate, Outlet } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Welcome from './routes/Welcome'
import Login from './routes/Login'
import Register from './routes/Register'
import Loading from './routes/Loading'
import MenuLayout from './routes/MenuLayout'
import Chat from './routes/Chat'
import Home from './routes/Home'
import Dashboard from './routes/Dashboard'
import Translator from './routes/Translator'
import Learn from './routes/Learn'
import Practice from './routes/Practice'
import Community from './routes/Community'
import Notification from './routes/Notification'

// Componente de diseño para rutas protegidas
const ProtectedLayout = () => {
  return (
    <MenuLayout>
      <Outlet />
    </MenuLayout>
  )
}

function AnimatedRoutes(){
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Rutas públicas */}
        <Route path="/" element={<Navigate to="/welcome" />} />
        <Route path="/welcome" element={<motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}}><Welcome/></motion.div>} />
        <Route path="/login" element={<motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}><Login/></motion.div>} />
        <Route path="/register" element={<motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}><Register/></motion.div>} />
        <Route path="/loading" element={<Loading />} />
        
        {/* Rutas protegidas con menú */}
        <Route element={<ProtectedLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/learning" element={<Learn />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/translator" element={<Translator />} />
          <Route path="/chatbot" element={<Chat />} />
          <Route path="/community" element={<Community />} />
          <Route path="/notification" element={<Notification />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/welcome" />} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App(){
  return <AnimatedRoutes />
}
