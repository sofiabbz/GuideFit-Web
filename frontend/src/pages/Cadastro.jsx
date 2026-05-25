import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../services/api'
import './Cadastro.css'

function Cadastro() {
  const navigate = useNavigate()

  const [form, setForm]     = useState({ nome: '', email: '', senha: '', confirmar: '' })
  const [erros, setErros]   = useState({})
  const [loading, setLoading] = useState(false)
  const [forca, setForca]   = useState({ nivel: 0, texto: '', cor: '' })

  // ── Atualiza campos ───────────────────────────────────────────────────────
  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    setErros(prev => ({ ...prev, [name]: '' }))
    if (name === 'senha') avaliarSenha(value)
  }

  // ── Força da senha ────────────────────────────────────────────────────────
  function avaliarSenha(valor) {
    let pontos = 0
    if (valor.length >= 8)                             pontos++
    if (/[A-Z]/.test(valor) && /[0-9]/.test(valor))   pontos++
    if (/[^A-Za-z0-9]/.test(valor))                   pontos++

    const niveis = [
      { nivel: 0, texto: '',      cor: '' },
      { nivel: 1, texto: 'Fraca', cor: '#e05c5c' },
      { nivel: 2, texto: 'Média', cor: '#e8a020' },
      { nivel: 3, texto: 'Forte', cor: '#4a9688' },
    ]
    setForca(niveis[pontos] || niveis[0])
  }

  // ── Validação ─────────────────────────────────────────────────────────────
  function validar() {
    const novosErros = {}
    if (!form.nome)                                              novosErros.nome      = 'Informe seu nome.'
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) novosErros.email = 'Informe um e-mail válido.'
    if (form.senha.length < 8)                                  novosErros.senha     = 'Mínimo 8 caracteres.'
    if (form.senha !== form.confirmar)                          novosErros.confirmar = 'As senhas não coincidem.'
    setErros(novosErros)
    return Object.keys(novosErros).length === 0
  }

  // ── Envio ─────────────────────────────────────────────────────────────────
  async function handleSubmit(e) {
    e.preventDefault()
    if (!validar()) return

    setLoading(true)
    try {
      const { data } = await api.post('/auth/cadastro', {
        nome:  form.nome,
        email: form.email,
        senha: form.senha,
      })

      localStorage.setItem('token',         data.token)
      localStorage.setItem('usuario_id',    data.usuario.id)
      localStorage.setItem('usuario_nome',  data.usuario.nome)

      navigate('/onboarding')

    } catch (erro) {
      const msg = erro.response?.data?.erro || 'Erro ao cadastrar. Tente novamente.'
      setErros({ geral: msg })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <div className="card">

        {/* Logo */}
        <div className="logo-wrap">
          <svg className="logo-icon" viewBox="0 0 48 48" fill="none">
            <circle cx="30" cy="8" r="5" fill="#4a9688"/>
            <path d="M28 13 C24 18 20 22 18 28" stroke="#4a9688" strokeWidth="3" strokeLinecap="round" fill="none"/>
            <path d="M28 18 C32 14 36 11 38 9" stroke="#4a9688" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
            <path d="M24 20 C20 22 16 22 14 21" stroke="#4a9688" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
            <path d="M18 28 C16 33 14 37 13 42" stroke="#4a9688" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
            <path d="M18 28 C22 32 26 34 30 35" stroke="#3a7a6e" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
          </svg>
          <span className="logo-text">Guidefit</span>
        </div>

        <h1 className="title">Página de Cadastro</h1>

        {erros.geral && <p className="erro-geral">{erros.geral}</p>}

        <form onSubmit={handleSubmit}>

          <div className="field">
            <label>Nome completo</label>
            <input
              type="text" name="nome" placeholder="Seu nome"
              value={form.nome} onChange={handleChange}
              className={erros.nome ? 'erro' : ''}
            />
            {erros.nome && <span className="msg-erro">{erros.nome}</span>}
          </div>

          <div className="field">
            <label>E-mail</label>
            <input
              type="email" name="email" placeholder="seu@email.com"
              value={form.email} onChange={handleChange}
              className={erros.email ? 'erro' : ''}
            />
            {erros.email && <span className="msg-erro">{erros.email}</span>}
          </div>

          <div className="field">
            <label>Senha</label>
            <input
              type="password" name="senha" placeholder="Mínimo 8 caracteres"
              value={form.senha} onChange={handleChange}
              className={erros.senha ? 'erro' : ''}
            />
            {form.senha && (
              <div className="forca-wrap">
                <div className="forca-barras">
                  <div className={`barra ${forca.nivel >= 1 ? 'ativa' : ''}`} style={{ background: forca.nivel >= 1 ? forca.cor : '' }}/>
                  <div className={`barra ${forca.nivel >= 2 ? 'ativa' : ''}`} style={{ background: forca.nivel >= 2 ? forca.cor : '' }}/>
                  <div className={`barra ${forca.nivel >= 3 ? 'ativa' : ''}`} style={{ background: forca.nivel >= 3 ? forca.cor : '' }}/>
                </div>
                <span className="forca-label" style={{ color: forca.cor }}>{forca.texto}</span>
              </div>
            )}
            {erros.senha && <span className="msg-erro">{erros.senha}</span>}
          </div>

          <div className="field">
            <label>Confirmar senha</label>
            <input
              type="password" name="confirmar" placeholder="Repita a senha"
              value={form.confirmar} onChange={handleChange}
              className={erros.confirmar ? 'erro' : ''}
            />
            {erros.confirmar && <span className="msg-erro">{erros.confirmar}</span>}
          </div>

          <button type="submit" className="btn-cadastrar" disabled={loading}>
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </button>

        </form>

        <p className="login-link-wrap">
          Já tem conta? <Link to="/login">Entrar</Link>
        </p>

      </div>

      <footer>
        <a href="#" className="footer-row footer-sobre">Sobre Nós</a>
        <a href="#" className="footer-row footer-cultura">Cultura</a>
        <a href="#" className="footer-row footer-sac">SAC</a>
      </footer>
    </div>
  )
}

export default Cadastro