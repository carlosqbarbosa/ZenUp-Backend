-- DropForeignKey
ALTER TABLE `respostas` DROP FOREIGN KEY `Respostas_id_questionario_fkey`;

-- AlterTable
ALTER TABLE `respostas` MODIFY `id_questionario` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Respostas` ADD CONSTRAINT `Respostas_id_questionario_fkey` FOREIGN KEY (`id_questionario`) REFERENCES `Questionarios`(`id_questionario`) ON DELETE SET NULL ON UPDATE CASCADE;
