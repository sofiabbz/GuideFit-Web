import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from "../servicos/api"
import './Login.css'
import logoImg from "/logo.png"

export default function Login() {
  const [dados, setDados] = useState({
    email: '',
    senha: ''
  })

  const [erros, setErros] = useState({})
  const [erroGeral, setErroGeral] = useState('')
  const [carregando, setCarregando] = useState(false)
  const navegar = useNavigate()

  const handleMudanca = (e) => {
    const { name, value } = e.target

    setDados(prev => ({
      ...prev,
      [name]: value
    }))

    if (erros[name]) {
      setErros(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validarFormulario = () => {
    const novosErros = {}

    if (!dados.email.trim()) {
      novosErros.email = 'E-mail é obrigatório'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dados.email)) {
      novosErros.email = 'E-mail inválido'
    }

    if (!dados.senha) {
      novosErros.senha = 'Senha é obrigatória'
    }

    setErros(novosErros)
    return Object.keys(novosErros).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErroGeral('')

    if (!validarFormulario()) {
      return
    }

    setCarregando(true)

    try {
      const resposta = await api.post('/auth/login', {
        email: dados.email.trim(),
        senha: dados.senha
      })

      localStorage.setItem('token', resposta.data.token)
      localStorage.setItem('usuario', JSON.stringify(resposta.data.usuario))

      navegar('/onboarding')
    } catch (erro) {
      const mensagem = erro.response?.data?.erro || 'Erro ao fazer login. Tente novamente.'
      setErroGeral(mensagem)
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="pagina">
      <main className="principal">
        <div className="card">
          <div className="logo-wrap">
            <img
              src={logoImg}
              alt="Logo Guidefit"
              className="logo-icon"
            />
            <span className="logo-text">Guidefit</span>
          </div>

          <h1 className="titulo">Login</h1>

          {erroGeral && (
            <div className="erro-geral">
              {erroGeral}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="campo">
              <label htmlFor="email">E-mail</label>
              <input
                id="email"
                type="email"
                name="email"
                value={dados.email}
                onChange={handleMudanca}
                placeholder="seu@email.com"
                className={erros.email ? 'erro-input' : ''}
                disabled={carregando}
              />
              {erros.email && (
                <span className="msg-erro">{erros.email}</span>
              )}
            </div>

            <div className="campo">
              <label htmlFor="senha">Senha</label>
              <input
                id="senha"
                type="password"
                name="senha"
                value={dados.senha}
                onChange={handleMudanca}
                placeholder="Sua senha"
                className={erros.senha ? 'erro-input' : ''}
                disabled={carregando}
              />
              {erros.senha && (
                <span className="msg-erro">{erros.senha}</span>
              )}
            </div>

            <button
              type="submit"
              className="btn-cadastrar"
              disabled={carregando}
            >
              {carregando ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <div className="link-login">
            Não tem conta? <Link to="/cadastro">Cadastre-se</Link>
          </div>
        </div>
      </main>

      <footer>
        <a href="#" className="linha-rodape rodape-sobre">Sobre</a>
        <a href="#" className="linha-rodape rodape-cultura">Cultura</a>
        <a href="#" className="linha-rodape rodape-sac">SAC</a>
      </footer>
    </div>
  )
}