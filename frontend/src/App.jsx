import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Cadastro from './pages/Cadastro'

// TODO: importar as demais páginas quando forem criadas
// import Login from './pages/Login'
// import Onboarding from './pages/Onboarding'
// import Dashboard from './pages/Dashboard'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"          element={<Navigate to="/cadastro" />} />
        <Route path="/cadastro"  element={<Cadastro />} />
        {/* Adicionar rotas aqui conforme as páginas forem criadas */}
      </Routes>
    </BrowserRouter>
  )
}

export default App