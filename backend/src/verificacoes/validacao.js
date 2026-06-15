const validarCadastro = (api, resposta, proximo) => {
  const { nome, email, senha } = api.body

  if (!nome || !email || !senha) {
    return resposta.status(400).json({
      erro: 'Nome, e-mail e senha são obrigatórios.'
    })
  }

  const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!formatoEmail.test(email)) {
    return resposta.status(400).json({
      erro: 'Formato de e-mail inválido.'
    })
  }

  if (senha.length < 8) {
    return resposta.status(400).json({
      erro: 'A senha deve ter pelo menos 8 caracteres.'
    })
  }

  proximo()
}

const validarLogin = (api, resposta, proximo) => {
  const { email, senha } = api.body

  if (!email || !senha) {
    return resposta.status(400).json({
      erro: 'E-mail e senha são obrigatórios.'
    })
  }

  const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!formatoEmail.test(email)) {
    return resposta.status(400).json({
      erro: 'Formato de e-mail inválido.'
    })
  }

  proximo()
}

module.exports = {
  validarCadastro,
  validarLogin
}