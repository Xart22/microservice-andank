-- CreateTable
CREATE TABLE `RuasJalan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_ruas_jalan` VARCHAR(191) NOT NULL,
    `nama_ruas_jalan` VARCHAR(191) NOT NULL,
    `panjang_km` DOUBLE NOT NULL,
    `sta_awal` VARCHAR(191) NOT NULL,
    `sta_akhir` VARCHAR(191) NOT NULL,
    `lat_awal` DOUBLE NOT NULL,
    `long_awal` DOUBLE NOT NULL,
    `lat_akhir` DOUBLE NOT NULL,
    `long_akhir` DOUBLE NOT NULL,
    `uptd_id` INTEGER NOT NULL,
    `sup_id` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `RuasJalan_id_ruas_jalan_key`(`id_ruas_jalan`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Sup` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `uptdId` INTEGER NOT NULL,

    UNIQUE INDEX `Sup_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Uptd` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `alamat` VARCHAR(191) NULL,
    `lat` DOUBLE NULL,
    `long` DOUBLE NULL,

    UNIQUE INDEX `Uptd_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `RuasJalan` ADD CONSTRAINT `RuasJalan_uptd_id_fkey` FOREIGN KEY (`uptd_id`) REFERENCES `Uptd`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RuasJalan` ADD CONSTRAINT `RuasJalan_sup_id_fkey` FOREIGN KEY (`sup_id`) REFERENCES `Sup`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Sup` ADD CONSTRAINT `Sup_uptdId_fkey` FOREIGN KEY (`uptdId`) REFERENCES `Uptd`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
