import validate from './validate.js';
import state from './view.js';

import repeatRequest from './repeatRequest.js';

export default () => {
  const form = document.querySelector('form');
  form.addEventListener('submit', (e) => {
    state.isValid = false;
    e.preventDefault();
    const formData = new FormData(e.target);
    const value = formData.get('url');
    value.trim();
    if (state.links.includes(value)) {
      state.process = 'failed';
    }
    if (!state.links.includes(value)) {
      validate({ url: value })
        .then(() => {
          state.links.push(value);
          state.process = 'processing';
          state.url = value;
          repeatRequest();
        })
        .catch((er) => {
          state.error = er.errors;
        });
    }
  });
};
