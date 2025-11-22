/*
  Warnings:

  - You are about to drop the column `uptdId` on the `sup` table. All the data in the column will be lost.
  - Added the required column `uptd_id` to the `Sup` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `sup` DROP FOREIGN KEY `Sup_uptdId_fkey`;

-- DropIndex
DROP INDEX `Sup_uptdId_fkey` ON `sup`;

-- AlterTable
ALTER TABLE `sup` DROP COLUMN `uptdId`,
    ADD COLUMN `uptd_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Sup` ADD CONSTRAINT `Sup_uptd_id_fkey` FOREIGN KEY (`uptd_id`) REFERENCES `Uptd`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
