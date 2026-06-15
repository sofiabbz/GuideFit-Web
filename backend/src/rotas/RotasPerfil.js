const express = require('express')
const roteador = express.Router()

const { criarPerfil, obterPerfil } = require('../controladores/PerfilControlador')
const { autenticar } = require('../verificacoes/autenticacao')

/**
 * ┌─────────────────────────────────────────────────┐
 * │ ROTAS DE PERFIL                                 │
 * └─────────────────────────────────────────────────┘
 */

// POST /api/perfil/criar
// Criar ou atualizar perfil (requer autenticação)
roteador.post('/criar', autenticar, criarPerfil)

// GET /api/perfil/obter
// Obter perfil do usuário autenticado (requer autenticação)
roteador.get('/obter', autenticar, obterPerfil)

module.exports = roteador