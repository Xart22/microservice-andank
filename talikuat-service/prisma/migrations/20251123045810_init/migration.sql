-- CreateTable
CREATE TABLE `UserRole` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `UserRole_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserDetail` (
    `user_id` INTEGER NOT NULL,
    `role_id` INTEGER NOT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DataUmum` (
    `id` VARCHAR(191) NOT NULL,
    `pemda` VARCHAR(191) NOT NULL,
    `opd` VARCHAR(191) NOT NULL,
    `nm_paket` VARCHAR(191) NOT NULL,
    `no_kontrak` VARCHAR(191) NOT NULL,
    `tgl_kontrak` DATETIME(3) NOT NULL,
    `no_spmk` VARCHAR(191) NOT NULL,
    `tgl_spmk` DATETIME(3) NOT NULL,
    `kategori_paket` VARCHAR(191) NOT NULL,
    `uptd_id` INTEGER NOT NULL,
    `ppk_kegiatan` VARCHAR(191) NOT NULL,
    `thn` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DataUmumDetail` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `data_umum_id` VARCHAR(191) NOT NULL,
    `tgl_adendum` DATETIME(3) NULL,
    `nilai_kontrak` VARCHAR(191) NOT NULL,
    `panjang_km` DOUBLE NOT NULL,
    `lama_waktu` INTEGER NOT NULL,
    `kontraktor_id` INTEGER NOT NULL,
    `konsultan_id` INTEGER NOT NULL,
    `ppk_id` INTEGER NOT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `keterangan` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DataUmumRuas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `data_umum_detail_id` INTEGER NOT NULL,
    `ruas_id` INTEGER NOT NULL,
    `segment_jalan` VARCHAR(191) NOT NULL,
    `lat_awal` DOUBLE NOT NULL,
    `long_awal` DOUBLE NOT NULL,
    `lat_akhir` DOUBLE NOT NULL,
    `long_akhir` DOUBLE NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Kontraktor` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(191) NOT NULL,
    `alamat` VARCHAR(191) NOT NULL,
    `npwp` VARCHAR(191) NOT NULL,
    `nama_direktur` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Kontraktor_nama_key`(`nama`),
    UNIQUE INDEX `Kontraktor_npwp_key`(`npwp`),
    UNIQUE INDEX `Kontraktor_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Konsultan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(191) NOT NULL,
    `alamat` VARCHAR(191) NOT NULL,
    `npwp` VARCHAR(191) NOT NULL,
    `nama_direktur` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Konsultan_nama_key`(`nama`),
    UNIQUE INDEX `Konsultan_npwp_key`(`npwp`),
    UNIQUE INDEX `Konsultan_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Jadual` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `data_umum_detail_id` INTEGER NOT NULL,
    `nmp` VARCHAR(191) NOT NULL,
    `uraian_pekerjaan` VARCHAR(191) NOT NULL,
    `total_harga` VARCHAR(191) NOT NULL,
    `total_volume` VARCHAR(191) NOT NULL,
    `satuan` VARCHAR(191) NOT NULL,
    `bobot` DOUBLE NOT NULL,
    `koefisien` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `JadualDetail` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `jadual_id` INTEGER NOT NULL,
    `uraian_pekerjaan` VARCHAR(191) NOT NULL,
    `volume` VARCHAR(191) NOT NULL,
    `satuan` VARCHAR(191) NOT NULL,
    `harga_satuan` VARCHAR(191) NOT NULL,
    `total_harga` VARCHAR(191) NOT NULL,
    `tanggal` DATETIME(3) NOT NULL,
    `nilai` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LaporanMingguan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `data_umum_id` VARCHAR(191) NOT NULL,
    `rencana_pekerjaan` VARCHAR(191) NOT NULL,
    `realisasi_pekerjaan` VARCHAR(191) NOT NULL,
    `deviasi` VARCHAR(191) NOT NULL,
    `priode` VARCHAR(191) NOT NULL,
    `file_laporan` VARCHAR(191) NOT NULL,
    `keterangan` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FileDokumen` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `data_umum_id` VARCHAR(191) NOT NULL,
    `nama_dokumen` VARCHAR(191) NOT NULL,
    `file_path` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserDetail` ADD CONSTRAINT `UserDetail_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `UserRole`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DataUmumDetail` ADD CONSTRAINT `DataUmumDetail_data_umum_id_fkey` FOREIGN KEY (`data_umum_id`) REFERENCES `DataUmum`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DataUmumRuas` ADD CONSTRAINT `DataUmumRuas_data_umum_detail_id_fkey` FOREIGN KEY (`data_umum_detail_id`) REFERENCES `DataUmumDetail`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Jadual` ADD CONSTRAINT `Jadual_data_umum_detail_id_fkey` FOREIGN KEY (`data_umum_detail_id`) REFERENCES `DataUmumDetail`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `JadualDetail` ADD CONSTRAINT `JadualDetail_jadual_id_fkey` FOREIGN KEY (`jadual_id`) REFERENCES `Jadual`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LaporanMingguan` ADD CONSTRAINT `LaporanMingguan_data_umum_id_fkey` FOREIGN KEY (`data_umum_id`) REFERENCES `DataUmum`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FileDokumen` ADD CONSTRAINT `FileDokumen_data_umum_id_fkey` FOREIGN KEY (`data_umum_id`) REFERENCES `DataUmum`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
