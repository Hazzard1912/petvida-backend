import type { Schema, Struct } from '@strapi/strapi';

export interface FaqPreguntas extends Struct.ComponentSchema {
  collectionName: 'components_faq_preguntas';
  info: {
    displayName: 'preguntas';
    icon: 'lightbulb';
  };
  attributes: {
    pregunta: Schema.Attribute.String & Schema.Attribute.Required;
    respuesta: Schema.Attribute.Text & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'faq.preguntas': FaqPreguntas;
    }
  }
}
