-- DropForeignKey
ALTER TABLE `ruasjalan` DROP FOREIGN KEY `RuasJalan_sup_id_fkey`;

-- DropIndex
DROP INDEX `RuasJalan_sup_id_fkey` ON `ruasjalan`;

-- AlterTable
ALTER TABLE `ruasjalan` MODIFY `sup_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `RuasJalan` ADD CONSTRAINT `RuasJalan_sup_id_fkey` FOREIGN KEY (`sup_id`) REFERENCES `Sup`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
