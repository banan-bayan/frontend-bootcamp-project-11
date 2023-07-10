import onChange from 'on-change';

const initionalState = {
  url: '',
  error: '',
  lng: 'ru',
  view: {
    feeds: [],
    posts: [],
  },
  // i18nInstance
};
const state = onChange(initionalState, (path) => { // , val, preVal
  console.log(state.view);
  const input = document.querySelector('input');
  const btnSubmit = document.querySelector('.btn-primary');
  const feedback = document.querySelector('.feedback');
  console.log(path);
  if (path === 'error') {
    input.classList.add('is-invalid');
    btnSubmit.setAttribute('disabled', true);
    feedback.textContent = state.i18nInstance.t(state.error);
  } else if (path === 'url') {
    input.classList.remove('is-invalid');
    btnSubmit.removeAttribute('disabled');
    feedback.classList.remove('text-danger');
    feedback.classList.add('text-success');
    feedback.textContent = state.i18nInstance.t('validMsg');
  }
});

export default state;
