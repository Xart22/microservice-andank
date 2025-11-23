-- CreateTable
CREATE TABLE `LaporanMasyarakat` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `no_tiket` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `nik` VARCHAR(191) NOT NULL,
    `alamat` VARCHAR(191) NOT NULL,
    `no_telp` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `isi_laporan` VARCHAR(191) NOT NULL,
    `foto` VARCHAR(191) NOT NULL,
    `ruas_jalan_id` INTEGER NOT NULL,
    `latitude` DOUBLE NOT NULL,
    `longitude` DOUBLE NOT NULL,
    `status_laporan` ENUM('Baru', 'Diproses', 'Selesai', 'Ditolak') NOT NULL DEFAULT 'Baru',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `updated_by` INTEGER NULL,

    UNIQUE INDEX `LaporanMasyarakat_no_tiket_key`(`no_tiket`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ResponLaporan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `laporan_id` INTEGER NOT NULL,
    `responder_id` INTEGER NOT NULL,
    `tanggapan` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ResponLaporan` ADD CONSTRAINT `ResponLaporan_laporan_id_fkey` FOREIGN KEY (`laporan_id`) REFERENCES `LaporanMasyarakat`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
