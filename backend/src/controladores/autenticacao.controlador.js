const usuarioServico = require('../servicos/UsuarioServico')

/**
 * ┌─────────────────────────────────────────────────┐
 * │ CAMADA DE CONTROLADORES - Controle HTTP         │
 * └─────────────────────────────────────────────────┘
 *
 * Controladores recebem requisições HTTP e chamam os serviços
 * Responsáveis por receber dados e retornar respostas
 */

/**
 * POST /api/auth/cadastro
 * Registrar novo usuário
 */
async function cadastrar(api, resposta) {
  try {
    // Extrai os dados do corpo da requisição
    const { nome, email, senha } = api.body

    // Chama o serviço para registrar
    const resultado = await usuarioServico.registrar({ nome, email, senha })

    // Retorna sucesso com status 201 (Criado)
    return resposta.status(201).json({
      mensagem: 'Cadastro realizado com sucesso!',
      token: resultado.token,
      usuario: resultado.usuario
    })

  } catch (erro) {
    console.error('❌ Erro ao cadastrar:', erro.message)

    // Trata erros de validação
    if (
      erro.message.includes('obrigatórios') ||
      erro.message.includes('caracteres') ||
      erro.message.includes('E-mail já cadastrado')
    ) {
      return resposta.status(400).json({ erro: erro.message })
    }

    // Erro genérico
    return resposta.status(500).json({ erro: 'Erro interno do servidor.' })
  }
}

/**
 * POST /api/auth/login
 * Fazer login
 */
async function login(api, resposta) {
  try {
    // Extrai os dados do corpo da requisição
    const { email, senha } = api.body

    // Chama o serviço para fazer login
    const resultado = await usuarioServico.login({ email, senha })

    // Retorna sucesso com status 200 (OK)
    return resposta.status(200).json({
      mensagem: 'Login realizado com sucesso!',
      token: resultado.token,
      usuario: resultado.usuario
    })

  } catch (erro) {
    console.error('❌ Erro ao fazer login:', erro.message)

    // Trata erros de validação
    if (
      erro.message.includes('obrigatórios') ||
      erro.message.includes('incorretos')
    ) {
      return resposta.status(400).json({ erro: erro.message })
    }

    // Erro genérico
    return resposta.status(500).json({ erro: 'Erro interno do servidor.' })
  }
}

/**
 * GET /api/auth/perfil
 * Obter dados do usuário autenticado
 */
async function obterPerfil(api, resposta) {
  try {
    // api.usuario é adicionado pela verificação de autenticação
    const usuarioId = api.usuario.id

    const usuario = await usuarioServico.buscarPorId(usuarioId)

    return resposta.json({ usuario })

  } catch (erro) {
    console.error('❌ Erro ao obter perfil:', erro.message)
    return resposta.status(404).json({ erro: erro.message })
  }
}

module.exports = {
  cadastrar,
  login,
  obterPerfil
}
