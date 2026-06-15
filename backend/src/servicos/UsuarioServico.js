require('dotenv').config()

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

class UsuarioServico {

  async registrar(dados) {
    const { nome, email, senha } = dados
    if (!nome || !email || !senha)
      throw new Error('Nome, e-mail e senha são obrigatórios.')
    if (senha.length < 8)
      throw new Error('A senha deve ter pelo menos 8 caracteres.')
    const usuarioExistente = await prisma.usuario.findUnique({ where: { email } })
    if (usuarioExistente)
      throw new Error('E-mail já cadastrado.')
    const senhaHash = await bcrypt.hash(senha, 10)
    const usuario = await prisma.usuario.create({
      data: { nome, email, senhaHash }
    })
    const token = this.gerarToken(usuario)
    return { usuario: this.formatarUsuario(usuario), token }
  }

  async login(dados) {
    const { email, senha } = dados
    if (!email || !senha)
      throw new Error('E-mail e senha são obrigatórios.')
    const usuario = await prisma.usuario.findUnique({ where: { email } })
    if (!usuario)
      throw new Error('E-mail ou senha incorretos.')
    const senhaCorreta = await bcrypt.compare(senha, usuario.senhaHash)
    if (!senhaCorreta)
      throw new Error('E-mail ou senha incorretos.')
    const token = this.gerarToken(usuario)
    return { usuario: this.formatarUsuario(usuario), token }
  }

  async buscarPorId(id) {
    const usuario = await prisma.usuario.findUnique({ where: { id } })
    if (!usuario)
      throw new Error('Usuário não encontrado.')
    return this.formatarUsuario(usuario)
  }

  gerarToken(usuario) {
    return jwt.sign(
      { id: usuario.id, email: usuario.email },
      process.env.CHAVE_SECRETA,
      { expiresIn: '7d' }
    )
  }

  formatarUsuario(usuario) {
    const { senhaHash, ...usuarioFormatado } = usuario
    return usuarioFormatado
  }

  verificarToken(token) {
    try {
      return jwt.verify(token, process.env.CHAVE_SECRETA)
    } catch (erro) {
      throw new Error('Token inválido ou expirado.')
    }
  }
}

module.exports = new UsuarioServico()