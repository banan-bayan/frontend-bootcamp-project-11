import axios from 'axios';
import validate from './validate.js';
import state from './view.js';

const parser = (xml) => {
  const feed = [];
  const posts = [];
  const parse = new DOMParser();
  const doc = parse.parseFromString(xml, 'application/xml');
  const channel = doc.querySelector('channel');
  const channelTitle = channel.querySelector('channel > title');
  const channelDescription = channel.querySelector('channel > description');
  const channelLink = channel.querySelector('channel > link');
  const feedId = '';
  feed.push({
    id: feedId,
    title: channelTitle.textContent,
    description: channelDescription.textContent,
    link: channelLink.textContent,
  });
  const itemList = doc.querySelectorAll('item');
  itemList.forEach((post) => {
    const postTitle = post.querySelector('title');
    const postDescription = channel.querySelector('description');
    const postLink = channel.querySelector('link');
    posts.push({
      title: postTitle.textContent,
      description: postDescription.textContent,
      link: postLink.textContent,
      id: '',
      feedId,
    });
  });
  console.log(feed);
  console.log(posts);
  return { feed, posts };
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
            // params: {
            //   lang: 'en',
            // },
            // feed: {
            //   unit: 'second',
            // },
          })
          .then((response) => {
            const { feed, posts } = parser(response.data.contents);
            state.view.feeds.push(feed);
            state.view.posts.push(posts);
            console.log('GOOOOD');
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
