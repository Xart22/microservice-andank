export const perencanaanSapulobangSchema = {
  params: {
    type: "object",
    properties: {
      id: { type: "number" },
    },
  },
  body: {
    type: "object",
    properties: {
      tanggal_perencanaan: { type: "string", format: "date" },
    },
  },
};
