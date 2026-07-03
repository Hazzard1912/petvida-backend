const { ValidationError } = require('@strapi/utils').errors;

export default {
  async beforeCreate(event) {
    const data = event.params?.data ?? {};

    let adopterDocId: string | undefined;
    let petDocId: string | undefined;

    if (typeof data.adopter === 'string') {
      adopterDocId = data.adopter;
    }

    if (typeof data.pet === 'string') {
      petDocId = data.pet;
    }

    if (!petDocId || !adopterDocId) {
      throw new ValidationError('Faltan datos requeridos para la solicitud de adopcion');
    }

    const existing = await strapi.documents('api::adoption-request.adoption-request').findMany({
      filters: {
        adopter: { documentId: adopterDocId },
        pet: { documentId: petDocId },
        status: 'pendiente',
      },
    });

    if (existing.length > 0) {
      throw new ValidationError('Ya tienes una solicitud de adopcion en proceso para esta mascota. La estaremos validando y dando respuesta a la brevedad.');
    }
  },

  async afterUpdate(event) {
    const { result } = event;

    if (result?.status === 'aprobada') {
      try {
        const { documentId } = result;

        const adoptionRequest = await strapi.documents('api::adoption-request.adoption-request').findOne({
          documentId,
          populate: { pet: true, adopter: true },
        });

        const petDocId = (adoptionRequest.pet as any).documentId;

        const alreadyAdopted = await strapi.documents('api::pet.pet').findOne({
          documentId: petDocId,
        });

        if (!alreadyAdopted?.isAdopted) {
          await strapi.documents('api::pet.pet').update({
            documentId: petDocId,
            data: {
              isAdopted: true,
              adoptedDated: new Date().toISOString().split('T')[0],
            },
            status: 'published',
          });
        }
      } catch (error) {
        console.error('Error al procesar la adopcion aprobada:', error);
      }
    }
  },
};
