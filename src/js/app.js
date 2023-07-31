import handler from './handler.js';
import watcherState from './view.js';

export default (i18nInstance) => {
  const initionalState = {
    update: false,
    isValid: '',
    invalidRss: '',
    process: 'filling',
    url: '',
    error: '',
    lng: 'ru',
    view: {
      posts: [],
      feeds: [],
    },
    links: [],
  };
  const watcher = watcherState(initionalState, i18nInstance);
  handler(watcher);
};
