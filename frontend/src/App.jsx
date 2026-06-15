import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Cadastro from './paginas/Cadastro'
import Login from './paginas/Login'
import Onboarding from './paginas/Onboarding'


// TODO: importar as demais páginas quando forem criadas
// import Onboarding from './paginas/Onboarding'
// import Painel from './paginas/Painel'

function Aplicacao() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"         element={<Navigate to="/cadastro" />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/login"    element={<Login />} />
        <Route path="/onboarding" element={<Onboarding />} />
        {/* Adicionar rotas aqui conforme as páginas forem criadas */}
      </Routes>
    </BrowserRouter>
  )
}

export default Aplicacao