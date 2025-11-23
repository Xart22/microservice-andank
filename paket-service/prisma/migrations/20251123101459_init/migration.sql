/*
  Warnings:

  - The primary key for the `dataumum` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `dataumum` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `data_umum_id` on the `dataumumdetail` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `data_umum_id` on the `filedokumen` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `data_umum_id` on the `laporanmingguan` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- DropForeignKey
ALTER TABLE `dataumumdetail` DROP FOREIGN KEY `DataUmumDetail_data_umum_id_fkey`;

-- DropForeignKey
ALTER TABLE `filedokumen` DROP FOREIGN KEY `FileDokumen_data_umum_id_fkey`;

-- DropForeignKey
ALTER TABLE `laporanmingguan` DROP FOREIGN KEY `LaporanMingguan_data_umum_id_fkey`;

-- DropIndex
DROP INDEX `DataUmumDetail_data_umum_id_fkey` ON `dataumumdetail`;

-- DropIndex
DROP INDEX `FileDokumen_data_umum_id_fkey` ON `filedokumen`;

-- DropIndex
DROP INDEX `LaporanMingguan_data_umum_id_fkey` ON `laporanmingguan`;

-- AlterTable
ALTER TABLE `dataumum` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `tgl_kontrak` DATE NOT NULL,
    MODIFY `tgl_spmk` DATE NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `dataumumdetail` MODIFY `data_umum_id` INTEGER NOT NULL,
    MODIFY `tgl_adendum` DATE NULL;

-- AlterTable
ALTER TABLE `filedokumen` MODIFY `data_umum_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `laporanmingguan` MODIFY `data_umum_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `DataUmumDetail` ADD CONSTRAINT `DataUmumDetail_data_umum_id_fkey` FOREIGN KEY (`data_umum_id`) REFERENCES `DataUmum`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DataUmumDetail` ADD CONSTRAINT `DataUmumDetail_kontraktor_id_fkey` FOREIGN KEY (`kontraktor_id`) REFERENCES `Kontraktor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DataUmumDetail` ADD CONSTRAINT `DataUmumDetail_konsultan_id_fkey` FOREIGN KEY (`konsultan_id`) REFERENCES `Konsultan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LaporanMingguan` ADD CONSTRAINT `LaporanMingguan_data_umum_id_fkey` FOREIGN KEY (`data_umum_id`) REFERENCES `DataUmum`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FileDokumen` ADD CONSTRAINT `FileDokumen_data_umum_id_fkey` FOREIGN KEY (`data_umum_id`) REFERENCES `DataUmum`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
