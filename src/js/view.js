import onChange from 'on-change';

export default (state, i18nInstance) => onChange(state, (path) => {
  const bodyEl = document.querySelector('body');
  const modal = document.querySelector('[aria-labelledby="modal"]');
  const modalTitle = document.querySelector('.modal-title');
  const modalBody = document.querySelector('.modal-body');
  const modalFooter = document.querySelector('.modal-footer');
  const btnReadFullPost = modalFooter.querySelector('a');

  const input = document.querySelector('input');
  const labelInput = document.querySelector('[for="url-input"]');
  const btnSubmit = document.querySelector('[aria-label="add"]');
  const feedback = document.querySelector('.feedback');
  // create containers for feeds
  const feedsContainer = document.querySelector('.feeds');
  feedsContainer.innerHTML = '';

  const feedsCard = document.createElement('div');
  feedsCard.classList.add('card', 'border-0');

  const feedsCardBody = document.createElement('div');
  feedsCardBody.classList.add('card-body');

  const feedsCardTitle = document.createElement('h2');
  feedsCardTitle.classList.add('card-title', 'h4');
  feedsCardTitle.textContent = 'Фиды';

  const feedsUlGroup = document.createElement('ul');
  feedsUlGroup.classList.add('list-group', 'border-0', 'rounded-0');

  feedsContainer.append(feedsCard);
  feedsCard.append(feedsCardBody);

  // create containers for posts
  const postsContainer = document.querySelector('.posts');
  postsContainer.innerHTML = '';

  const postsCard = document.createElement('div');
  postsCard.classList.add('card', 'border-0');

  const postsCardBody = document.createElement('div');
  postsCardBody.classList.add('card-body');

  const postsCardTitle = document.createElement('h2');
  postsCardTitle.classList.add('card-title', 'h4');
  postsCardTitle.textContent = 'Посты';

  const postsUlGroup = document.createElement('ul');
  postsUlGroup.classList.add('list-group', 'border-0', 'rounded-0');

  // isValid rss ---------------------
  if (state.isValid === true) {
    input.value = '';
    btnSubmit.removeAttribute('disabled');
  }
  // is valid URL -----------------------------------------
  if (path === 'error') {
    input.classList.add('is-invalid');
    input.removeAttribute('readonly');
    input.removeAttribute('disabled');
    input.textContent = input.textContent.trim();
    feedback.textContent = i18nInstance.t(state.error);
    feedback.classList.add('text-danger');
    btnSubmit.removeAttribute('disabled');
  }
  // state process----------------------------------
  if (state.process === 'processing') {
    btnSubmit.setAttribute('disabled', true);
    input.setAttribute('readonly', true);
    input.setAttribute('disabled', true);
    labelInput.classList.add('label-disabled');
  }
  if (state.process === 'processed') {
    input.removeAttribute('readonly');
    input.removeAttribute('disabled');
    input.focus();
    input.classList.remove('is-invalid');
    btnSubmit.removeAttribute('disabled');
    labelInput.classList.remove('label-disabled');
    feedback.classList.remove('text-danger');
    feedback.classList.add('text-success');
    feedback.textContent = i18nInstance.t('validMsg');
  }
  if (state.process === 'failed') {
    labelInput.classList.remove('label-disabled');
    btnSubmit.removeAttribute('disabled');
    input.classList.add('is-invalid');
    input.removeAttribute('readonly');
    input.removeAttribute('disabled');
    input.textContent = input.textContent.trim();
    feedback.textContent = i18nInstance.t('dublicate');
    feedback.classList.add('text-danger');
  }
  if (state.invalidRss === false) {
    labelInput.classList.remove('label-disabled');
    btnSubmit.removeAttribute('disabled');
    input.classList.add('is-invalid');
    input.textContent = input.textContent.trim();
    input.removeAttribute('readonly');
    input.removeAttribute('disabled');
    feedback.classList.add('text-danger');
    feedback.textContent = i18nInstance.t('notValidRss');
  }
  if (state.process === 'errorNetwork') {
    labelInput.classList.remove('label-disabled');
    btnSubmit.removeAttribute('disabled');
    input.classList.add('is-invalid');
    input.removeAttribute('readonly');
    input.removeAttribute('disabled');
    feedback.classList.add('text-danger');
    feedback.textContent = i18nInstance.t('networkError');
  }

  // render post and feeds --------------------------------
  state.view.feeds.forEach((feed) => {
    const feedLiEl = document.createElement('li');
    feedLiEl.classList.add('list-group-item', 'border-0', 'border-end-0');

    const feedTitle = document.createElement('h3');
    feedTitle.classList.add('h6', 'm-0');
    feedTitle.textContent = feed.title;

    const feedDescription = document.createElement('p');
    feedDescription.textContent = feed.description;
    feedDescription.classList.add('m-0', 'small', 'text-black-50');

    feedLiEl.append(feedTitle);
    feedLiEl.append(feedDescription);
    feedsUlGroup.append(feedLiEl);
    feedsCardBody.append(feedsCardTitle);
  });
  feedsCard.append(feedsUlGroup);

  state.view.posts.forEach((post) => {
    const postLiEl = document.createElement('li');
    postLiEl.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');

    const postLink = document.createElement('a');
    postLink.classList.add('fw-bold');
    postLink.setAttribute('href', `${post.link}`);
    postLink.setAttribute('data-id', `${post.id}`);
    postLink.setAttribute('target', '_blank');
    postLink.setAttribute('rel', 'noopenep noreferrer');
    postLink.textContent = post.title;

    //

    const postBtn = document.createElement('button');
    postBtn.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    postBtn.textContent = 'Просмотр';
    postBtn.setAttribute('type', 'button');
    postBtn.setAttribute('data-id', `${post.id}`);
    postBtn.setAttribute('data-bs-toggle', 'modal');
    postBtn.setAttribute('data-bs-target', '#modal');

    postLiEl.append(postLink);
    postLiEl.append(postBtn);
    postsUlGroup.append(postLiEl);
    postsCardBody.append(postsCardTitle);
  });
  postsCard.append(postsCardBody);
  postsCard.append(postsUlGroup);
  postsContainer.append(postsCard);

  // btn Просмотр
  const btnsCheckPost = document.querySelectorAll('.btn-outline-primary');
  btnsCheckPost.forEach((btn) => {
    btn.addEventListener('click', () => {
      modal.addEventListener('click', (e) => {
        if (e.target.id === 'modal') {
          bodyEl.classList.remove('modal-open');
          bodyEl.removeAttribute('style', 'overflow: hidden; padding-right: 17px;');
          modal.classList.remove('show');
          modal.removeAttribute('style', 'display: block; padding-left: 0px;');
          modal.setAttribute('aria-hidden', true);
          modal.removeAttribute('aria-modal');

          const modalBackdrop = document.querySelector('.modal-backdrop');
          if (modalBackdrop !== null) {
            modalBackdrop.remove();
          }
        }
      });

      const modalBackdrop = document.createElement('div');
      modalBackdrop.classList.add('modal-backdrop', 'fade', 'show');
      bodyEl.append(modalBackdrop);
      bodyEl.classList.add('modal-open');
      bodyEl.setAttribute('style', 'overflow: hidden; padding-right: 17px;');
      modal.classList.add('show');
      modal.setAttribute('aria-modal', true);
      modal.removeAttribute('aria-hidden');
      modal.setAttribute('style', 'display: block; padding-left: 0px;');

      state.view.posts.forEach((post) => {
        if (post.id === btn.dataset.id) {
          modalTitle.textContent = post.title;
          modalBody.textContent = post.description;
          btnReadFullPost.setAttribute('href', post.link);
        }

        const linkList = postsContainer.querySelectorAll('a');
        linkList.forEach((link) => {
          if (btn.dataset.id === link.dataset.id) {
            link.classList.add('text-secondary');
            link.classList.remove('fw-bold');
            link.classList.add('fw-normal');
          }
        });
      });
    });
  });

  // btns закрыть модалку
  const btnsCloseModal = document.querySelectorAll('[data-bs-dismiss="modal"]');
  btnsCloseModal.forEach((btn) => {
    btn.addEventListener('click', () => {
      bodyEl.classList.remove('modal-open');
      bodyEl.removeAttribute('style', 'overflow: hidden; padding-right: 17px;');
      modal.classList.remove('show');
      modal.removeAttribute('style', 'display: block; padding-left: 0px;');
      modal.setAttribute('aria-hidden', true);
      modal.removeAttribute('aria-modal');

      const modalBackdrop = document.querySelector('.modal-backdrop');
      if (modalBackdrop !== null) {
        modalBackdrop.remove();
      }
    });
  });
});
