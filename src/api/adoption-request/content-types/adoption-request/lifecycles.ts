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

    const adopter = extractId(data.adopter);
    const pet = extractId(data.pet);

    if (!pet.id && !pet.documentId) {
      throw new ValidationError('Faltan datos requeridos para la solicitud de adopcion (mascota no especificada)');
    }
    if (!adopter.id && !adopter.documentId) {
      throw new ValidationError('Faltan datos requeridos para la solicitud de adopcion (adoptante no especificado)');
    }

    const existing = await strapi.documents('api::adoption-request.adoption-request').findMany({
      filters: {
        adopter: { ...adopter },
        pet: { ...pet },
        requestStatus: 'pendiente',
      },
    });

    if (existing.length > 0) {
      throw new ValidationError('Ya tienes una solicitud de adopcion en proceso para esta mascota. La estaremos validando y dando respuesta a la brevedad.');
    }
  },

  async afterUpdate(event) {
    const { result } = event;

    if (result?.requestStatus === 'aprobada') {
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
