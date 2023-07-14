import axios from 'axios';
import uniqueId from 'lodash/uniqueId.js';
import uniqBy from 'lodash/uniqBy.js';
import differenceWith from 'lodash/differenceWith.js';
import isEqual from 'lodash/isEqual.js';
import validate from './validate.js';
import state from './view.js';

const parser = (xml) => {
  const feed = [];
  const posts = [];
  const parse = new DOMParser();
  const doc = parse.parseFromString(xml, 'application/xml');

  const parsererror = doc.querySelector('parsererror');
  if (parsererror !== null) {
    state.invalidRss = false;
  } else {
    state.invalidRss = true;
    const channel = doc.querySelector('channel');
    const channelTitle = channel.querySelector('channel > title');
    const channelDescription = channel.querySelector('channel > description');
    const channelLink = channel.querySelector('channel > link');
    const feedId = uniqueId();
    feed.push({
      id: feedId,
      title: channelTitle.textContent,
      description: channelDescription.textContent,
      link: channelLink.textContent,
    });
    const itemList = doc.querySelectorAll('item');
    itemList.forEach((post) => {
      const postTitle = post.querySelector('title');
      const postDescription = post.querySelector('description');
      const postLink = post.querySelector('link');
      posts.push({
        title: postTitle.textContent,
        description: postDescription.textContent,
        link: postLink.textContent,
        id: uniqueId(),
        feedId,
      });
    });
    return { feed, posts };
  }
  throw new Error('error in parser');
};

const repeatRequest = () => {
  const promises = state.links.map((link, index) => {
    axios
      .get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(link)}`, {
        // disabled: {
        //   disableCache: true,
        // },
        // feed: {
        //   unit: 'second',
        //         // disableCache?true=
        // disableCache=true&
        // },
      })
      .then((response) => {
        const { feed, posts } = parser(response.data.contents);

        const checkState = state.view.feeds; // -----------------

        const uniqFeeds = differenceWith(feed, state.view.feeds, isEqual);
        const uniqPosts = differenceWith(posts, state.view.posts, isEqual);

        state.view.feeds = [...state.view.feeds, ...uniqFeeds];
        state.view.posts = [...state.view.posts, ...uniqPosts];

        state.view.feeds = uniqBy(state.view.feeds, 'title');
        state.view.posts = uniqBy(state.view.posts, 'title');

        if (!isEqual(checkState, state.view.feeds)) { // -----------------
          state.process = 'processed';
          state.process = 'filling';
          state.isValid = true; // -----------------
          state.isValid = false;
        } // -----------------
        console.log('GOOOOD');
      })
      .catch(() => {
        state.links.splice(index);
        if (state.invalidRss !== false) {
          state.process = 'errorNetwork';
          console.log('baaaad');
        }
      });
    return promises;
  });
  Promise.all(promises)
    .then(() => setTimeout(() => repeatRequest(), 5000))
    .catch(() => console.log('error in prom all'));
};

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
