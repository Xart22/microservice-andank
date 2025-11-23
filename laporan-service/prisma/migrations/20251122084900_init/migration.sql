/*
  Warnings:

  - Added the required column `jenis_laporan_id` to the `LaporanMasyarakat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `judul` to the `LaporanMasyarakat` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `laporanmasyarakat` ADD COLUMN `jenis_laporan_id` INTEGER NOT NULL,
    ADD COLUMN `judul` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `JenisLaporan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_jenis` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `LaporanMasyarakat` ADD CONSTRAINT `LaporanMasyarakat_jenis_laporan_id_fkey` FOREIGN KEY (`jenis_laporan_id`) REFERENCES `JenisLaporan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
