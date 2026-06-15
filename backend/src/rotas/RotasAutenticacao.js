const express = require('express')
const roteador = express.Router()

const { cadastrar, login, obterPerfil } = require('../controladores/autenticacao.controlador')
const { validarCadastro, validarLogin } = require('../verificacoes/validacao')
const { autenticar } = require('../verificacoes/autenticacao')

/**
 * ┌─────────────────────────────────────────────────┐
 * │ ROTAS DE AUTENTICAÇÃO                           │
 * └─────────────────────────────────────────────────┘
 *
 * Padrão: roteador.método(rota, ...verificacoes, controlador)
 * As verificações rodam primeiro, depois o controlador
 */

// POST /api/auth/cadastro
// Verificação: validação de cadastro
// Controlador: cadastrar usuário
roteador.post('/cadastro', validarCadastro, cadastrar)

// POST /api/auth/login
// Verificação: validação de login
// Controlador: fazer login
roteador.post('/login', validarLogin, login)

// GET /api/auth/perfil
// Verificação: autenticação (requer token válido)
// Controlador: obter dados do usuário autenticado
roteador.get('/perfil', autenticar, obterPerfil)

module.exports = roteador
