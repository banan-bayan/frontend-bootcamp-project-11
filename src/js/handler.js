import validate from './validate.js';
import state from './view.js';

export default () => {
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
