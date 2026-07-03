const { ValidationError } = require('@strapi/utils').errors;

export default {
  async beforeCreate(event) {
    const data = event.params?.data ?? {};

    let sponsorDocId: string | undefined;
    let petDocId: string | undefined;

    if (typeof data.sponsor === 'string') {
      sponsorDocId = data.sponsor;
    }

    if (typeof data.pet === 'string') {
      petDocId = data.pet;
    }

    if (!petDocId || !sponsorDocId) {
      throw new ValidationError('Faltan datos requeridos para la solicitud de apadrinamiento');
    }

    const existing = await strapi.documents('api::sponsor-request.sponsor-request').findMany({
      filters: {
        sponsor: { documentId: sponsorDocId },
        pet: { documentId: petDocId },
        status: 'pendiente',
      },
    });

    if (existing.length > 0) {
      throw new ValidationError('Ya tienes una solicitud de apadrinamiento en proceso para esta mascota. La estaremos validando y dando respuesta a la brevedad.');
    }
  },
};
