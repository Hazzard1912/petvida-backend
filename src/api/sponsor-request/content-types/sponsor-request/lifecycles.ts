const { ValidationError } = require('@strapi/utils').errors;

function extractId(value: any): { id?: number; documentId?: string } {
  if (!value) return {};

  if (typeof value === 'string') return { documentId: value };

  const connected = value?.connect?.[0] || value?.set?.[0];
  if (connected?.id) return { id: connected.id };
  if (connected?.documentId) return { documentId: connected.documentId };

  return {};
}

export default {
  async beforeCreate(event) {
    const data = event.params?.data ?? {};

    const sponsor = extractId(data.sponsor);
    const pet = extractId(data.pet);

    if (!pet.id && !pet.documentId) {
      throw new ValidationError('Faltan datos requeridos para la solicitud de apadrinamiento (mascota no especificada)');
    }
    if (!sponsor.id && !sponsor.documentId) {
      throw new ValidationError('Faltan datos requeridos para la solicitud de apadrinamiento (padrino no especificado)');
    }

    const existing = await strapi.documents('api::sponsor-request.sponsor-request').findMany({
      filters: {
        sponsor: { ...sponsor },
        pet: { ...pet },
        status: 'pendiente',
      },
    });

    if (existing.length > 0) {
      throw new ValidationError('Ya tienes una solicitud de apadrinamiento en proceso para esta mascota. La estaremos validando y dando respuesta a la brevedad.');
    }
  },
};
