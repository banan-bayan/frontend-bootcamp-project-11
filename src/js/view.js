import onChange from 'on-change';

const initionalState = {
  process: 'filling', // 'processing' , 'processed', 'failed',
  url: '',
  error: '',
  lng: 'ru',
  view: {
    // lengthPosts: '',
    // lengthFeed: '',
    posts: [],
    feeds: [],
  },
  linkLorem: 'https://lorem-rss.hexlet.app/',
  // i18nInstance
};
const state = onChange(initionalState, (path) => { // , val, preVal
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

  const input = document.querySelector('input');
  const btnSubmit = document.querySelector('[aria-label="add"]');
  const feedback = document.querySelector('.feedback');
  // is valid -----------------------------------------
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
  // state process----------------------------------
  if (state.process === 'processing') {
    btnSubmit.setAttribute('disabled', true);
  }
  if (state.process === 'processed') {
    btnSubmit.removeAttribute('disabled');
    // input.setAttribute('autofocus', true); // ??????????????
    input.focus();
  }
  if (state.process === 'failed') {
    console.log('error, process in state');
  }
  // render post and feeds --------------------------------
  state.view.feeds.forEach((feed) => {
    const feedLiEl = document.createElement('li');
    feedLiEl.classList.add('list-group-item', 'border-0', 'border-end-0');

    const feedTitle = document.createElement('h3');
    feedTitle.classList.add('h6', 'm-0');
    feedTitle.textContent = feed.title;
    console.log(feedTitle.textContent);
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

    const postBtn = document.createElement('button');
    postBtn.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    postBtn.textContent = 'Просмотр';
    postBtn.setAttribute('type', 'button');
    postBtn.setAttribute('data-id', `${post.id}`);
    postBtn.setAttribute('data-bs-toggle', 'modal');
    postBtn.setAttribute('data-bs-target', '#modal');

    // const postDescription = document.createElement('div');
    // postDescription.textContent = post.description;

    postLiEl.append(postLink);
    postLiEl.append(postBtn);
    postsUlGroup.append(postLiEl);
    postsCardBody.append(postsCardTitle);
  });
  postsCard.append(postsCardBody);
  postsCard.append(postsUlGroup);
  postsContainer.append(postsCard);
});

export default state;
