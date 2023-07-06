// import  bootstrap from 'bootstrap';
// import * as bootstrap from 'bootstrap';
import '../scss/styles.scss';
import * as yup from 'yup';
import state from './view.js';

const schema = yup.object().shape({
  url: yup.string('is not a string').required('must dont empty').url(),
});

const validate = (fields) => schema.validate(fields)
  .catch(() => {
    throw new Error('URL is notValid');
  });

const mainFn = () => {
  const form = document.querySelector('form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const value = formData.get('url');

    validate({ url: value })
      .then(() => {
        state.url = value;
      })
      .catch((er) => {
        state.error = er;
      });
  });
};
mainFn();
