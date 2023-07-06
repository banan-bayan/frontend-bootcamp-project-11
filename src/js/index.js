// import  bootstrap from 'bootstrap';
// import * as bootstrap from 'bootstrap';
import '../scss/styles.scss';
import i18next from 'i18next';
import app from './app.js';
import resources from '../i18next/resources.js';

const i18nInstance = i18next.createInstance();
i18nInstance.init({
  lng: 'en',
  debug: true,
  resources,
}).then(() => {
  app(i18nInstance);
}).catch(() => {
  throw new Error('error in fn i18n');
});

export default i18nInstance;
