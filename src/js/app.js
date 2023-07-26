import handler from './handler.js';
import state from './view.js';

export default (init18i) => {
  state.i18nInstance = init18i;
  handler();
};
