import * as peopleSelectors from './selectors';
export { default } from './reducer';
export * from './types';
export { default as peopleActions, IPeopleActions } from './actions';
export { default as peopleEpic$ } from './epics';
export { peopleSelectors };
