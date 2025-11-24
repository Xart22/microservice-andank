export type JadualDetailPayload = {
  uraian_pekerjaan: string;
  volume: string;
  satuan: string;
  harga_satuan: string;
  total_harga: string;
  tanggal: string; // ISO date: "2024-06-01"
  nilai: string;
};

export type CreateJadualBody = {
  data_umum_detail_id: number;
  nmp: string;
  uraian_pekerjaan: string;
  total_harga: string;
  total_volume: string;
  satuan: string;
  bobot: number;
  koefisien: number;
  jadualDetails: JadualDetailPayload[];
};
