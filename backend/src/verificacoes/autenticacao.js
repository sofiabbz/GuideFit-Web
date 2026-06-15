const usuarioServico = require('../servicos/UsuarioServico')

/**
 * ┌─────────────────────────────────────────────────┐
 * │ VERIFICAÇÃO DE AUTENTICAÇÃO                     │
 * └─────────────────────────────────────────────────┘
 *
 * Verifica se o usuário está autenticado (tem token válido)
 * Usada para proteger rotas que precisam de autenticação
 */

const autenticar = (api, resposta, proximo) => {
  try {
    // Pega o cabeçalho de autorização
    const cabecalhoAutorizacao = api.headers.authorization

    // Verifica se existe
    if (!cabecalhoAutorizacao) {
      return resposta.status(401).json({
        erro: 'Token não fornecido.'
      })
    }

    // Extrai o token do cabeçalho "Bearer token_aqui"
    const partes = cabecalhoAutorizacao.split(' ')
    if (partes.length !== 2) {
      return resposta.status(401).json({
        erro: 'Formato de token inválido.'
      })
    }

    const [esquema, token] = partes

    // Valida se começa com "Bearer"
    if (esquema !== 'Bearer') {
      return resposta.status(401).json({
        erro: 'Formato de token inválido.'
      })
    }

    // Verifica se o token é válido
    const conteudoToken = usuarioServico.verificarToken(token)

    // Adiciona o conteúdo do token à requisição para usar no controlador
    api.usuario = conteudoToken

    proximo()
  } catch (erro) {
    return resposta.status(401).json({
      erro: erro.message || 'Token inválido ou expirado.'
    })
  }
}

module.exports = {
  autenticar
}
