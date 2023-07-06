import onChange from 'on-change';

const initionalState = {
  url: '',
  error: '',
};
const state = onChange(initionalState, (path) => { // , val, preVal
  const input = document.querySelector('input');
  const btnSubmit = document.querySelector('.btn-primary');
  const feedback = document.querySelector('.feedback');

  if (path === 'error') {
    input.classList.add('is-invalid');
    btnSubmit.setAttribute('disabled', true);
    feedback.textContent = 'Ссылка должна быть валидным URL';
  } else { // if (path === 'url')
    input.classList.remove('is-invalid');
    btnSubmit.removeAttribute('disabled');
    feedback.textContent = '';
  }
});

export default state;
