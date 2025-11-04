/*
  Warnings:

  - You are about to alter the column `descricao` on the `equipes` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `equipes` MODIFY `descricao` VARCHAR(191) NULL;
