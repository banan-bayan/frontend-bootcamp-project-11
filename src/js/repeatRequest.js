import axios from 'axios';
import uniqBy from 'lodash/uniqBy.js';
import differenceWith from 'lodash/differenceWith.js';
import isEqual from 'lodash/isEqual.js';
import parser from './parser.js';

const repeatRequest = (stat) => {
  const state = stat;
  const promises = state.links.map((link, index) => {
    axios
      .get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(link)}`)
      .then((response) => {
        const { feed, posts } = parser(state, response.data.contents);
        const checkState = state.view.feeds;

        const uniqFeeds = differenceWith(feed, state.view.feeds, isEqual);
        const uniqPosts = differenceWith(posts, state.view.posts, isEqual);

        state.view.feeds = [...state.view.feeds, ...uniqFeeds];
        state.view.posts = [...state.view.posts, ...uniqPosts];

        state.view.feeds = uniqBy(state.view.feeds, 'title');
        state.view.posts = uniqBy(state.view.posts, 'title');

        if (!isEqual(checkState, state.view.feeds)) {
          state.process = 'processed';
          state.process = 'filling';
          state.isValid = true;
          state.isValid = false;
        }
      })
      .catch(() => {
        state.links.splice(index);
        if (state.invalidRss !== false) {
          state.process = 'errorNetwork';
        }
      });
    return promises;
  });
  Promise
    .all(promises)
    .then(() => {
      setTimeout(() => repeatRequest(state), 5000);
    })
    .catch(() => console.log('error in prom all'));
};

export default repeatRequest;
