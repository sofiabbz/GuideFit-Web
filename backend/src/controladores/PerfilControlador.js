const servicoPerfil = require('../servicos/ServicoPerfil')

/**
 * ┌─────────────────────────────────────────────────┐
 * │ CONTROLADOR DE PERFIL - Gerencia Requisições    │
 * └─────────────────────────────────────────────────┘
 */

/**
 * POST /api/perfil/criar
 * Criar ou atualizar perfil físico do usuário
 */
async function criarPerfil(req, res) {
  try {
    const usuarioId = req.usuario.id
    const dados = req.body

    const perfil = await servicoPerfil.criarPerfil(usuarioId, dados)

    return res.status(201).json({
      mensagem: 'Perfil criado com sucesso!',
      perfil
    })

  } catch (erro) {
    console.error('❌ Erro ao criar perfil:', erro.message)
    return res.status(400).json({ erro: erro.message })
  }
}

/**
 * GET /api/perfil/obter
 * Obter perfil físico do usuário autenticado
 */
async function obterPerfil(req, res) {
  try {
    const usuarioId = req.usuario.id
    const perfil = await servicoPerfil.obterPerfil(usuarioId)

    return res.json({ perfil })

  } catch (erro) {
    console.error('❌ Erro ao obter perfil:', erro.message)
    return res.status(404).json({ erro: erro.message })
  }
}

module.exports = {
  criarPerfil,
  obterPerfil
}