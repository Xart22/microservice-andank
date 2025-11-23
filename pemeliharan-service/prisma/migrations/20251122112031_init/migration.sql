-- CreateTable
CREATE TABLE `Sapulobang` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tanggal_survei` DATETIME(3) NOT NULL,
    `jumlah` INTEGER NOT NULL,
    `panjang` DOUBLE NOT NULL,
    `lat_survei` DOUBLE NOT NULL,
    `long_survei` DOUBLE NOT NULL,
    `ruas_jalan_id` INTEGER NOT NULL,
    `sup_id` INTEGER NOT NULL,
    `uptd_id` INTEGER NOT NULL,
    `kota_id` INTEGER NOT NULL,
    `lajur` VARCHAR(191) NOT NULL,
    `lokasi_km` VARCHAR(191) NOT NULL,
    `lokasi_m` VARCHAR(191) NOT NULL,
    `status_penanganan` ENUM('Survei', 'Direncanakan', 'Sudah_Ditangani') NOT NULL DEFAULT 'Survei',
    `keterangan_survei` VARCHAR(191) NOT NULL,
    `keterangan_penanganan` VARCHAR(191) NULL,
    `kategori_kedalaman` VARCHAR(191) NOT NULL,
    `tanggal_perencanaan` DATETIME(3) NULL,
    `tanggal_penanganan` DATETIME(3) NULL,
    `lat_penanganan` DOUBLE NULL,
    `long_penanganan` DOUBLE NULL,
    `image_survei` VARCHAR(191) NOT NULL,
    `image_penanganan` VARCHAR(191) NULL,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NULL,
    `penangan_by` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `KegiatanRutin` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tanggal` DATETIME(3) NOT NULL,
    `jenis_kegiatan` VARCHAR(191) NOT NULL,
    `deskripsi` VARCHAR(191) NOT NULL,
    `ruas_jalan_id` INTEGER NOT NULL,
    `sup_id` INTEGER NOT NULL,
    `uptd_id` INTEGER NOT NULL,
    `kota_id` INTEGER NOT NULL,
    `lokasi_km` VARCHAR(191) NOT NULL,
    `lokasi_m` VARCHAR(191) NOT NULL,
    `image_0` VARCHAR(191) NOT NULL,
    `image_50` VARCHAR(191) NULL,
    `image_100` VARCHAR(191) NULL,
    `image_pekerja` VARCHAR(191) NOT NULL,
    `video` VARCHAR(191) NULL,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
