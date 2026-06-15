import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../servicos/api'
import './Cadastro.css'

function Cadastro() {
  const navegar = useNavigate()

  const [formulario, setFormulario] = useState({ nome: '', email: '', senha: '', confirmar: '' })
  const [erros, setErros]           = useState({})
  const [carregando, setCarregando] = useState(false)
  const [forca, setForca]           = useState({ nivel: 0, texto: '', cor: '' })

  // ── Atualiza campos ───────────────────────────────────────────────────────
  function aoAlterar(evento) {
    const { name, value } = evento.target
    setFormulario(anterior => ({ ...anterior, [name]: value }))
    setErros(anterior => ({ ...anterior, [name]: '' }))
    if (name === 'senha') avaliarSenha(value)
  }

  // ── Força da senha ────────────────────────────────────────────────────────
  function avaliarSenha(valor) {
    const pontos = [
      valor.length >= 8,
      /[A-Z]/.test(valor) && /[0-9]/.test(valor),
      /[^A-Za-z0-9]/.test(valor),
    ].filter(Boolean).length

    const niveis = [
      { nivel: 0, texto: '',      cor: '' },
      { nivel: 1, texto: 'Fraca', cor: '#e05c5c' },
      { nivel: 2, texto: 'Média', cor: '#e8a020' },
      { nivel: 3, texto: 'Forte', cor: '#4a9688' },
    ]
    setForca(niveis[pontos])
  }

  // ── Validação ─────────────────────────────────────────────────────────────
  function validar() {
    const novosErros = {}
    if (!formulario.nome)                                                         novosErros.nome      = 'Informe seu nome.'
    if (!formulario.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formulario.email)) novosErros.email   = 'Informe um e-mail válido.'
    if (formulario.senha.length < 8)                                              novosErros.senha     = 'Mínimo 8 caracteres.'
    if (formulario.senha !== formulario.confirmar)                                novosErros.confirmar = 'As senhas não coincidem.'
    setErros(novosErros)
    return Object.keys(novosErros).length === 0
  }

  // ── Envio ─────────────────────────────────────────────────────────────────
  async function aoEnviar(evento) {
    evento.preventDefault()
    if (!validar()) return

    setCarregando(true)
    try {
      const { data } = await api.post('/auth/cadastro', {
        nome:  formulario.nome,
        email: formulario.email,
        senha: formulario.senha,
      })

      localStorage.setItem('token',        data.token)
      localStorage.setItem('usuario_id',   data.usuario.id)
      localStorage.setItem('usuario_nome', data.usuario.nome)

      navegar('/onboarding')

    } catch (erro) {
      const mensagem = erro.response?.data?.erro || 'Erro ao cadastrar. Tente novamente.'
      setErros({ geral: mensagem })
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="pagina">
      <main className="principal">
        <div className="card">

          {/* Logo */}
          <div className="logo-wrap">
            <img src="/logo.png" alt="Logo Guidefit" className="logo-icon" />
            <span className="logo-text">Guidefit</span>
          </div>

          <h1 className="titulo">Página de Cadastro</h1>

          {erros.geral && <p className="erro-geral">{erros.geral}</p>}

          <form onSubmit={aoEnviar}>

            <div className="campo">
              <label>Nome completo</label>
              <input
                type="text" name="nome" placeholder="Seu nome"
                value={formulario.nome} onChange={aoAlterar}
                className={erros.nome ? 'erro' : ''}
              />
              {erros.nome && <span className="msg-erro">{erros.nome}</span>}
            </div>

            <div className="campo">
              <label>E-mail</label>
              <input
                type="email" name="email" placeholder="seu@email.com"
                value={formulario.email} onChange={aoAlterar}
                className={erros.email ? 'erro' : ''}
              />
              {erros.email && <span className="msg-erro">{erros.email}</span>}
            </div>

            <div className="campo">
              <label>Senha</label>
              <input
                type="password" name="senha" placeholder="Mínimo 8 caracteres"
                value={formulario.senha} onChange={aoAlterar}
                className={erros.senha ? 'erro' : ''}
              />
              {formulario.senha && forca.nivel > 0 && (
                <div className="forca-wrap">
                  <span className="forca-bolinha" style={{ background: forca.cor }} />
                  <span className="forca-rotulo" style={{ color: forca.cor }}>{forca.texto}</span>
                </div>
              )}
              {erros.senha && <span className="msg-erro">{erros.senha}</span>}
            </div>

            <div className="campo">
              <label>Confirmar senha</label>
              <input
                type="password" name="confirmar" placeholder="Repita a senha"
                value={formulario.confirmar} onChange={aoAlterar}
                className={erros.confirmar ? 'erro' : ''}
              />
              {erros.confirmar && <span className="msg-erro">{erros.confirmar}</span>}
            </div>

            <button type="submit" className="btn-cadastrar" disabled={carregando}>
              {carregando ? 'Cadastrando...' : 'Cadastrar'}
            </button>

          </form>

          <p className="link-login">
            Já tem conta? <Link to="/login">Entrar</Link>
          </p>

        </div>
      </main>

      <footer>
        <a href="#" className="linha-rodape rodape-sobre">Sobre Nós</a>
        <a href="#" className="linha-rodape rodape-cultura">Cultura</a>
        <a href="#" className="linha-rodape rodape-sac">SAC</a>
      </footer>
    </div>
  )
}

export default Cadastro
