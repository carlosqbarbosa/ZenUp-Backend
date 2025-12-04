-- DropForeignKey
ALTER TABLE `usuarios` DROP FOREIGN KEY `Usuarios_id_empresa_fkey`;

-- DropForeignKey
ALTER TABLE `usuarios` DROP FOREIGN KEY `Usuarios_id_equipe_fkey`;

-- AlterTable
ALTER TABLE `empresas` MODIFY `cnpj` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `usuarios` MODIFY `id_empresa` INTEGER NULL,
    MODIFY `id_equipe` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Usuarios` ADD CONSTRAINT `Usuarios_id_empresa_fkey` FOREIGN KEY (`id_empresa`) REFERENCES `Empresas`(`id_empresa`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Usuarios` ADD CONSTRAINT `Usuarios_id_equipe_fkey` FOREIGN KEY (`id_equipe`) REFERENCES `Equipes`(`id_equipe`) ON DELETE SET NULL ON UPDATE CASCADE;
