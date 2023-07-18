import uniqueId from 'lodash/uniqueId.js';
import state from './view.js';

export default (xml) => {
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
