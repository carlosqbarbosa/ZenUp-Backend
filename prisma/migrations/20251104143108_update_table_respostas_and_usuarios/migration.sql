/*
  Warnings:

  - You are about to alter the column `humor` on the `respostas` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `energia` on the `respostas` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `estresse` on the `respostas` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - Added the required column `id_condicao` to the `Equipes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_usuario` to the `Respostas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `equipes` ADD COLUMN `id_condicao` INTEGER NOT NULL,
    ADD COLUMN `indicador_bem_estar` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `respostas` ADD COLUMN `id_usuario` INTEGER NOT NULL,
    MODIFY `humor` INTEGER NOT NULL,
    MODIFY `energia` INTEGER NOT NULL,
    MODIFY `estresse` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `Condicao` (
    `id_condicao` INTEGER NOT NULL AUTO_INCREMENT,
    `nome_condicao` VARCHAR(255) NOT NULL,
    `descricao` VARCHAR(255) NULL,
    `range_condicao` INTEGER NOT NULL,

    PRIMARY KEY (`id_condicao`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Equipes` ADD CONSTRAINT `Equipes_id_condicao_fkey` FOREIGN KEY (`id_condicao`) REFERENCES `Condicao`(`id_condicao`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Respostas` ADD CONSTRAINT `Respostas_id_usuario_fkey` FOREIGN KEY (`id_usuario`) REFERENCES `Usuarios`(`id_usuario`) ON DELETE RESTRICT ON UPDATE CASCADE;
