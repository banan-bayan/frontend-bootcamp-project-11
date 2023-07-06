// import  bootstrap from 'bootstrap';
// import * as bootstrap from 'bootstrap';
import '../scss/styles.scss';
import i18next from 'i18next';
import view from './view.js';
import handler from './handler.js';
import resources from '../i18next/resources.js';

const i18nInstance = i18next.createInstance();
i18nInstance.init({
  lng: 'ru',
  debug: true,
  resources,
}).then(() => {
  handler();
}).catch(() => {
  throw new Error('error in fn i18n');
});

const app = () => {
  handler();
  view()
    .then(() => i18nInstance)
    .then(() => console.log('great'));
};
app();
