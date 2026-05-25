const express = require('express')
const cors    = require('cors')
require('dotenv').config()

const authRoutes = require('./src/routes/auth.routes')

const app  = express()
const PORT = process.env.PORT || 3000

// ── Middlewares ───────────────────────────────────────────────────────────────
app.use(cors())
app.use(express.json())

// ── Rotas ─────────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes)

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ mensagem: 'GuideFit backend Node.js rodando!' })
})

// ── Inicia servidor ───────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`)
})