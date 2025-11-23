export const createResponseLaporanSchema = {
  body: {
    type: "object",
    required: ["laporan_id", "tanggapan"],
    properties: {
      laporan_id: { type: "integer" },
      tanggapan: { type: "string" },
    },
  },
};
