import axios from 'axios';
import uniqueId from 'lodash/uniqueId.js';
import validate from './validate.js';
import state from './view.js';

const parser = (xml) => {
  const feed = [];
  const posts = [];
  const parse = new DOMParser();
  const doc = parse.parseFromString(xml, 'application/xml');
  ///
  // console.log(doc);
  ///
  const parsererror = doc.querySelector('parsererror');
  if (parsererror !== null) {
    console.log('битый файл, не XML');
  } else {
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

export default () => {
  const form = document.querySelector('form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const value = formData.get('url');
    form.reset();
    validate({ url: value })
      .then(() => {
        state.process = 'processing';
        state.url = value;
        axios
          .get(`https://allorigins.hexlet.app/get?url=${encodeURIComponent(state.url)}`, {
            // params: {
            //   lang: 'en',
            // },
            // feed: {
            //   unit: 'second',
            // },
          })
          .then((response) => {
            state.process = 'processed';
            const { feed, posts } = parser(response.data.contents);
            // console.log(feed, posts);
            // state.view.posts = posts;
            state.view.posts = [...posts, ...state.view.posts];
            state.view.feeds = [...feed, ...state.view.feeds];
            // feed.forEach((el) => state.view.feeds.push(el));
            // posts.forEach((post) => state.view.posts.push(post));
            // state.view.lengthPosts = posts.length;
            // state.view.lengthFeed = feed.length;
            console.log('GOOOOD');
          })
          .catch((error) => {
            state.process = 'failed';
            console.log(error, 'BAAAAD');
          });
      })
      .catch((er) => {
        state.error = er.errors;
      });
  });
};
