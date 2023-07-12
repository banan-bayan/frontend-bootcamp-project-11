import axios from 'axios';
import uniqueId from 'lodash/uniqueId.js';
import uniqBy from 'lodash/uniqBy.js';
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

// const repeatRequest = () => {
//   // state.links.forEach((link) => { });
//   axios
//     .get(`https://allorigins.hexlet.app/get?url=${encodeURIComponent('https://ru.hexlet.io/lessons.rss')}`, {
//       // feed: {
//       //   unit: 'second',
//       //   interval: 20,
//       // },
//     })
//     .then(() => console.log('5 sec'));

//   setTimeout(() => {
//     repeatRequest();
//   }, 5000);
// };
// repeatRequest();
export default () => {
  const form = document.querySelector('form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const value = formData.get('url');
    if (state.links.includes(value)) {
      state.process = 'failed';
      console.log('dublicate url');
    }
    if (!state.links.includes(value)) {
      state.links.push(value);

      form.reset();
      validate({ url: value })
        .then(() => {
          state.process = 'processing';
          state.url = value;
          axios
            .get(`https://allorigins.hexlet.app/get?url=${encodeURIComponent(state.url)}`, {
              params: {
                lang: 'en',
              },
              // feed: {
              //   unit: 'second',
              // },
            })
            .then((response) => {
              state.process = 'processed';
              const { feed, posts } = parser(response.data.contents);
              const uniqFeed = uniqBy(feed, 'title'); // ---
              const uniqPosts = uniqBy(posts, 'title'); // --- differenceWith?

              state.view.posts = [...uniqPosts, ...state.view.posts];
              state.view.feeds = [...uniqFeed, ...state.view.feeds];
              console.log('GOOOOD');
            })
            .catch((error) => {
              state.process = 'invalidRssLink';
              console.log(error, 'BAAAAD');
            });
        })
        .catch((er) => {
          state.error = er.errors;
        });
    }
  });
};
