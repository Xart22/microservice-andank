export type DataUmumDetailPayload = {
  nilai_kontrak: string;
  panjang_km: number;
  lama_waktu: string | number;
  kontraktor_id: number;
  konsultan_id: number;
  ppk_id: number;
  tgl_adendum?: string | null;
  keterangan?: string | null;
};

export type DataUmumRuasPayload = {
  ruas_id: number;
  segment_jalan: string;
  lat_awal: number;
  long_awal: number;
  lat_akhir: number;
  long_akhir: number;
};

export type CreateDataUmumBody = {
  pemda: string;
  opd: string;
  nm_paket: string;
  no_kontrak: string;
  tgl_kontrak: string; // ISO date string
  no_spmk: string;
  tgl_spmk: string; // ISO date string
  kategori_paket: string;
  uptd_id: number;
  ppk_kegiatan: string;
  thn: number;

  dataUmumDetail: DataUmumDetailPayload;
  dataUmumRuas: DataUmumRuasPayload[];
};
