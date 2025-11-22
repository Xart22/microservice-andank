// src/modules/user/user.schema.ts

export const createUserSchema = {
  body: {
    type: "object",
    required: ["name", "email", "password", "role_id"],
    properties: {
      name: { type: "string", minLength: 1 },
      email: { type: "string", format: "email" },
      password: { type: "string", minLength: 6 },
      role_id: { type: "integer" },
      sup_id: { type: "integer" },
      uptd_id: { type: "integer" },
    },
  },
};

export const updateUserSchema = {
  body: {
    type: "object",
    properties: {
      name: { type: "string" },
      email: { type: "string", format: "email" },
      password: { type: "string" },
      role_id: { type: "integer" },
      sup_id: { type: "integer" },
      uptd_id: { type: "integer" },
    },
  },
};
