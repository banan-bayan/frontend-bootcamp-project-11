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
  ///
  // console.log(doc);
  ///
  const parsererror = doc.querySelector('parsererror');
  if (parsererror !== null) {
    // state.process = 'invalidRssLink';
    console.log('notValidRss: Ресурс не содержит валидный RSS');
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

const repeatRequest = () => {
  const promises = state.links.map((link) => {
    axios
      .get(`https://allorigins.hexlet.app/get?url=${encodeURIComponent(link)}`, {
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
        const uniqFeedTitle = uniqBy(feed, 'title');
        const uniqPostsTitle = uniqBy(posts, 'title');

        const uniqPosts = differenceWith(uniqPostsTitle, state.view.posts, isEqual);
        const uniqFeeds = differenceWith(uniqFeedTitle, state.view.posts, isEqual);

        state.view.posts = uniqPosts;
        state.view.feeds = uniqFeeds;
        console.log('GOOOOD');
      })
      .catch((error) => {
        state.process = 'invalidRssLink';
        console.log(error, 'BAAAAD');
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
    e.preventDefault();
    const formData = new FormData(e.target);
    const value = formData.get('url');
    if (state.links.includes(value)) {
      state.process = 'failed';
    }
    if (!state.links.includes(value)) {
      state.links.push(value);
      form.reset();
      validate({ url: value })
        .then(() => {
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
