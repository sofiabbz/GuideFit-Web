require('dotenv').config()
const express = require('express')
const cors = require('cors')

/**
 * ┌─────────────────────────────────────────────────┐
 * │ CONFIGURAÇÃO DO SERVIDOR - Express              │
 * └─────────────────────────────────────────────────┘
 */

const app = express()

// ─────────────────────────────────────────
// MIDDLEWARES GLOBAIS
// ─────────────────────────────────────────

// CORS: Permite que o frontend fale com o backend
app.use(cors())

// JSON: Entende dados em formato JSON
app.use(express.json())

// ─────────────────────────────────────────
// IMPORTAR ROTAS
// ─────────────────────────────────────────

const rotasAutenticacao = require('./src/rotas/RotasAutenticacao')
const rotasPerfil = require('./src/rotas/RotasPerfil')

// ─────────────────────────────────────────
// USAR AS ROTAS
// ─────────────────────────────────────────

app.use('/api/auth', rotasAutenticacao)
app.use('/api/perfil', rotasPerfil)

// ─────────────────────────────────────────
// INICIAR O SERVIDOR
// ─────────────────────────────────────────

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`)
})