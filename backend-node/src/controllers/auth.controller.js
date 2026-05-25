const bcrypt     = require('bcryptjs')
const jwt        = require('jsonwebtoken')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// ── POST /api/auth/cadastro ───────────────────────────────────────────────────
async function cadastrar(req, res) {
  try {
    const { nome, email, senha } = req.body

    // Validações básicas
    if (!nome || !email || !senha) {
      return res.status(400).json({ erro: 'Nome, e-mail e senha são obrigatórios.' })
    }

    if (senha.length < 8) {
      return res.status(400).json({ erro: 'A senha deve ter pelo menos 8 caracteres.' })
    }

    // Verifica se e-mail já existe
    const usuarioExiste = await prisma.usuario.findUnique({ where: { email } })
    if (usuarioExiste) {
      return res.status(400).json({ erro: 'E-mail já cadastrado.' })
    }

    // Criptografa a senha
    const senhaHash = await bcrypt.hash(senha, 10)

    // Salva no banco
    const usuario = await prisma.usuario.create({
      data: { nome, email, senhaHash }
    })

    // Gera o token JWT
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    return res.status(201).json({
      mensagem: 'Cadastro realizado com sucesso!',
      token,
      usuario: {
        id:    usuario.id,
        nome:  usuario.nome,
        email: usuario.email
      }
    })

  } catch (erro) {
    console.error(erro)
    return res.status(500).json({ erro: 'Erro interno do servidor.' })
  }
}

// ── POST /api/auth/login ──────────────────────────────────────────────────────
async function login(req, res) {
  try {
    const { email, senha } = req.body

    if (!email || !senha) {
      return res.status(400).json({ erro: 'E-mail e senha são obrigatórios.' })
    }

    // Busca usuário pelo e-mail
    const usuario = await prisma.usuario.findUnique({ where: { email } })
    if (!usuario) {
      return res.status(400).json({ erro: 'E-mail ou senha incorretos.' })
    }

    // Verifica a senha
    const senhaCorreta = await bcrypt.compare(senha, usuario.senhaHash)
    if (!senhaCorreta) {
      return res.status(400).json({ erro: 'E-mail ou senha incorretos.' })
    }

    // Gera o token JWT
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    return res.json({
      mensagem: 'Login realizado com sucesso!',
      token,
      usuario: {
        id:    usuario.id,
        nome:  usuario.nome,
        email: usuario.email
      }
    })

  } catch (erro) {
    console.error(erro)
    return res.status(500).json({ erro: 'Erro interno do servidor.' })
  }
}

module.exports = { cadastrar, login }