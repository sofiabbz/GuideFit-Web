import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../servicos/api'
import './Onboarding.css'
import logoImg from '/logo.png'

export default function Onboarding() {
  const [dados, setDados] = useState({
    peso: '',
    altura: '',
    idade: '',
    nivelFisico: 'iniciante',
    objetivo: 'condicionamento',
    localTreino: 'casa'
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

    if (!dados.peso || dados.peso <= 0) {
      novosErros.peso = 'Peso válido é obrigatório'
    }

    if (!dados.altura || dados.altura <= 0) {
      novosErros.altura = 'Altura válida é obrigatória'
    }

    if (!dados.idade || dados.idade < 13 || dados.idade > 120) {
      novosErros.idade = 'Idade deve estar entre 13 e 120'
    }

    if (!dados.nivelFisico) {
      novosErros.nivelFisico = 'Nível físico é obrigatório'
    }

    if (!dados.objetivo) {
      novosErros.objetivo = 'Objetivo é obrigatório'
    }

    if (!dados.localTreino) {
      novosErros.localTreino = 'Local de treino é obrigatório'
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
      const resposta = await api.post('/perfil/criar', {
        peso: parseFloat(dados.peso),
        altura: parseFloat(dados.altura),
        idade: parseInt(dados.idade),
        nivelFisico: dados.nivelFisico,
        objetivo: dados.objetivo,
        localTreino: dados.localTreino
      })

      navegar('/painel')
    } catch (erro) {
      const mensagem = erro.response?.data?.erro || 'Erro ao salvar perfil. Tente novamente.'
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

          <h1 className="titulo">Seu Perfil Físico</h1>
          <p className="subtitulo">Vamos montar seu treino? Precisaremos de algumas informações:</p>

          {erroGeral && (
            <div className="erro-geral">
              {erroGeral}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="linha-campos">
              <div className="campo">
                <label htmlFor="peso">Peso (kg)</label>
                <input
                  id="peso"
                  type="number"
                  name="peso"
                  value={dados.peso}
                  onChange={handleMudanca}
                  placeholder="Ex: 75"
                  step="0.1"
                  min="0"
                  className={erros.peso ? 'erro-input' : ''}
                  disabled={carregando}
                />
                {erros.peso && (
                  <span className="msg-erro">{erros.peso}</span>
                )}
              </div>

              <div className="campo">
                <label htmlFor="altura">Altura (cm)</label>
                <input
                  id="altura"
                  type="number"
                  name="altura"
                  value={dados.altura}
                  onChange={handleMudanca}
                  placeholder="Ex: 175"
                  step="0.1"
                  min="0"
                  className={erros.altura ? 'erro-input' : ''}
                  disabled={carregando}
                />
                {erros.altura && (
                  <span className="msg-erro">{erros.altura}</span>
                )}
              </div>

              <div className="campo">
                <label htmlFor="idade">Idade</label>
                <input
                  id="idade"
                  type="number"
                  name="idade"
                  value={dados.idade}
                  onChange={handleMudanca}
                  placeholder="Ex: 25"
                  min="13"
                  max="120"
                  className={erros.idade ? 'erro-input' : ''}
                  disabled={carregando}
                />
                {erros.idade && (
                  <span className="msg-erro">{erros.idade}</span>
                )}
              </div>
            </div>

            <div className="campo">
              <label htmlFor="nivelFisico">Nível Físico</label>
              <select
                id="nivelFisico"
                name="nivelFisico"
                value={dados.nivelFisico}
                onChange={handleMudanca}
                className={erros.nivelFisico ? 'erro-input' : ''}
                disabled={carregando}
              >
                <option value="iniciante">Iniciante</option>
                <option value="intermediario">Intermediário</option>
                <option value="avancado">Avançado</option>
              </select>
              {erros.nivelFisico && (
                <span className="msg-erro">{erros.nivelFisico}</span>
              )}
            </div>

            <div className="campo">
              <label htmlFor="objetivo">Objetivo</label>
              <select
                id="objetivo"
                name="objetivo"
                value={dados.objetivo}
                onChange={handleMudanca}
                className={erros.objetivo ? 'erro-input' : ''}
                disabled={carregando}
              >
                <option value="emagrecimento">Emagrecimento</option>
                <option value="ganho_massa">Ganho de Massa</option>
                <option value="condicionamento">Condicionamento</option>
              </select>
              {erros.objetivo && (
                <span className="msg-erro">{erros.objetivo}</span>
              )}
            </div>

            <div className="campo">
              <label htmlFor="localTreino">Local de Treino</label>
              <select
                id="localTreino"
                name="localTreino"
                value={dados.localTreino}
                onChange={handleMudanca}
                className={erros.localTreino ? 'erro-input' : ''}
                disabled={carregando}
              >
                <option value="casa">Casa</option>
                <option value="academia">Academia</option>

              </select>
              {erros.localTreino && (
                <span className="msg-erro">{erros.localTreino}</span>
              )}
            </div>

            <button
              type="submit"
              className="btn-cadastrar"
              disabled={carregando}
            >
              {carregando ? 'Salvando...' : 'Continuar'}
            </button>
          </form>
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