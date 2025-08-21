export const parseResultSchema = {
    type: "object",
    required: ["items"],
    properties: {
      items: {
        type: "array",
        items: {
          type: "object",
          required: ["comprimido","jejum","peqAlmoco","almoco","lanche","jantar","deitar","notas"],
          properties: {
            comprimido: { type: "string" },
            jejum: { type: "string" },
            peqAlmoco: { type: "string" },
            almoco: { type: "string" },
            lanche: { type: "string" },
            jantar: { type: "string" },
            deitar: { type: "string" },
            notas: { type: "string" }
          },
          additionalProperties: false
        }
      }
    },
    additionalProperties: false
  } as const;
  