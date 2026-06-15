const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

/**
 * ┌─────────────────────────────────────────────────┐
 * │ SERVIÇO DE PERFIL - Lógica de Negócio           │
 * └─────────────────────────────────────────────────┘
 */

class ServicoPerfil {
  /**
   * Criar ou atualizar perfil físico do usuário
   * @param {String} usuarioId - ID do usuário
   * @param {Object} dados - { peso, altura, idade, nivelFisico, objetivo, localTreino }
   * @returns {Object} Perfil criado/atualizado
   */
  async criarPerfil(usuarioId, dados) {
    const { peso, altura, idade, nivelFisico, objetivo, localTreino } = dados

    // ─────────────────────────────────────────
    // VALIDAÇÕES
    // ─────────────────────────────────────────

    if (!peso || peso <= 0) {
      throw new Error('Peso deve ser maior que 0.')
    }

    if (!altura || altura <= 0) {
      throw new Error('Altura deve ser maior que 0.')
    }

    if (!idade || idade < 13 || idade > 120) {
      throw new Error('Idade deve estar entre 13 e 120.')
    }

    if (!nivelFisico) {
      throw new Error('Nível físico é obrigatório.')
    }

    if (!objetivo) {
      throw new Error('Objetivo é obrigatório.')
    }

    if (!localTreino) {
      throw new Error('Local de treino é obrigatório.')
    }

    // ─────────────────────────────────────────
    // VERIFICA SE JÁ EXISTE PERFIL
    // ─────────────────────────────────────────

    const perfilExistente = await prisma.perfilFisico.findUnique({
      where: { usuarioId }
    })

    if (perfilExistente) {
      // Se já existe, ATUALIZA
      return await prisma.perfilFisico.update({
        where: { usuarioId },
        data: {
          peso: parseFloat(peso),
          altura: parseFloat(altura),
          idade: parseInt(idade),
          nivelFisico,
          objetivo,
          localTreino,
          dataAtualizacao: new Date()
        }
      })
    }

    // ─────────────────────────────────────────
    // SE NÃO EXISTE, CRIA NOVO
    // ─────────────────────────────────────────

    return await prisma.perfilFisico.create({
      data: {
        usuarioId,
        peso: parseFloat(peso),
        altura: parseFloat(altura),
        idade: parseInt(idade),
        nivelFisico,
        objetivo,
        localTreino
      }
    })
  }

  /**
   * Obter perfil físico de um usuário
   * @param {String} usuarioId - ID do usuário
   * @returns {Object} Dados do perfil
   */
  async obterPerfil(usuarioId) {
    const perfil = await prisma.perfilFisico.findUnique({
      where: { usuarioId }
    })

    if (!perfil) {
      throw new Error('Perfil não encontrado.')
    }

    return perfil
  }
}

module.exports = new ServicoPerfil()