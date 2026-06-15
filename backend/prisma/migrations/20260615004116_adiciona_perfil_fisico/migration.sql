-- CreateTable
CREATE TABLE "perfil_fisico" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "peso" DOUBLE PRECISION NOT NULL,
    "altura" DOUBLE PRECISION NOT NULL,
    "idade" INTEGER NOT NULL,
    "nivelFisico" TEXT NOT NULL,
    "objetivo" TEXT NOT NULL,
    "localTreino" TEXT NOT NULL,
    "dataAtualizacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "perfil_fisico_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "perfil_fisico_usuarioId_key" ON "perfil_fisico"("usuarioId");

-- AddForeignKey
ALTER TABLE "perfil_fisico" ADD CONSTRAINT "perfil_fisico_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
