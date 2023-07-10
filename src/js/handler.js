import axios from 'axios';
import validate from './validate.js';
import state from './view.js';

const parser = (xml) => {
  const parse = new DOMParser();
  return parse.parseFromString(xml, 'application/xml');
};

export default () => {
  const form = document.querySelector('form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const value = formData.get('url');
    validate({ url: value })
      .then(() => {
        state.url = value;
        axios
          .get(`https://allorigins.hexlet.app/get?url=${encodeURIComponent(state.url)}`, {
            params: {
              lang: 'ru',
            },
            // feed: {
            //   unit: 'second',
            // },
          })
          .then((response) => {
            state.response = parser(response.data.contents);
            const data = parser(response.data.contents);
            const titleList = data.querySelectorAll('title');
            const descriptionList = data.querySelectorAll('description');

            titleList.forEach((title) => {
              console.log(title.textContent, 'title');
            });

            descriptionList.forEach((description) => {
              console.log(description.textContent, 'description');
            });
            console.log(parser(response.data.contents), 'RESPONSE');
          })
          .catch((error) => {
            console.log(error, 'BAAAAD');
          });
      })
      .catch((er) => {
        state.error = er.errors;
      });
  });
};
