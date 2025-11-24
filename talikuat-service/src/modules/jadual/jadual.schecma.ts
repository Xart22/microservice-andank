export const createJadualSchema = {
  body: {
    type: "object",
    required: [
      "data_umum_detail_id",
      "nmp",
      "uraian_pekerjaan",
      "total_harga",
      "total_volume",
      "satuan",
      "bobot",
      "koefisien",
      "jadualDetails",
    ],
    properties: {
      data_umum_detail_id: { type: "number" },
      nmp: { type: "string" },
      uraian_pekerjaan: { type: "string" },
      total_harga: { type: "string" },
      total_volume: { type: "string" },
      satuan: { type: "string" },
      bobot: { type: "number" },
      koefisien: { type: "number" },

      jadualDetails: {
        type: "array",
        items: {
          type: "object",
          required: [
            "uraian_pekerjaan",
            "volume",
            "satuan",
            "harga_satuan",
            "total_harga",
            "tanggal",
            "nilai",
          ],
          properties: {
            uraian_pekerjaan: { type: "string" },
            volume: { type: "string" },
            satuan: { type: "string" },
            harga_satuan: { type: "string" },
            total_harga: { type: "string" },
            tanggal: { type: "string", format: "date" },
            nilai: { type: "string" },
          },
        },
      },
    },
  },
};
