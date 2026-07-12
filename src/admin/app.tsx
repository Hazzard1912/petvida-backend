import type { StrapiApp } from '@strapi/strapi/admin';
import {
  setPluginConfig,
  defaultHtmlPreset,
  StrapiMediaLib,
  StrapiUploadAdapter,
} from '@_sh/strapi-plugin-ckeditor';

export default {
  config: {
    locales: ['es'],
  },
  register() {
    setPluginConfig({
      presets: [
        {
          name: 'Noticias Editor',
          description: 'Editor personalizado para noticias con alineacion de texto y estilos',
          editorConfig: {
            ...defaultHtmlPreset.editorConfig,
            toolbar: {
              items: [
                'undo', 'redo', '|',
                'heading', '|',
                'bold', 'italic', 'underline', 'strikethrough', '|',
                'alignment:left', 'alignment:center', 'alignment:right', 'alignment:justify', '|',
                'bulletedList', 'numberedList', '|',
                'outdent', 'indent', '|',
                'link', 'StrapiMediaLib', '|',
                'fontSize', 'fontColor', 'fontBackgroundColor', '|',
                'insertTable', 'blockQuote', 'horizontalLine', '|',
                'sourceEditing', 'fullScreen',
              ],
            },
            alignment: {
              options: ['left', 'center', 'right', 'justify'],
            },
            fontSize: {
              options: [10, 12, 14, 'default', 16, 18, 20, 22],
            },
            fontColor: {
              columns: 5,
              documentColors: 10,
            },
            fontBackgroundColor: {
              columns: 5,
              documentColors: 10,
            },
            heading: {
              options: [
                { model: 'paragraph', title: 'Parrafo', class: 'ck-heading_paragraph' },
                { model: 'heading1', view: 'h1', title: 'Titulo 1', class: 'ck-heading_heading1' },
                { model: 'heading2', view: 'h2', title: 'Titulo 2', class: 'ck-heading_heading2' },
                { model: 'heading3', view: 'h3', title: 'Titulo 3', class: 'ck-heading_heading3' },
                { model: 'heading4', view: 'h4', title: 'Titulo 4', class: 'ck-heading_heading4' },
              ],
            },
            plugins: [
              ...defaultHtmlPreset.editorConfig.plugins,
              StrapiMediaLib,
              StrapiUploadAdapter,
            ],
          },
        },
        defaultHtmlPreset,
      ],
    });
  },
  bootstrap(app: StrapiApp) {
    console.log(app);
  },
};
