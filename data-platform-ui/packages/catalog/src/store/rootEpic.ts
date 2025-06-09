import { DefaultRootState } from 'react-redux';
import { combineEpics } from 'redux-observable';
import { peopleEpic$ } from './people';
import { DefaultActionUnion } from './types';

export default combineEpics<DefaultActionUnion, DefaultActionUnion, DefaultRootState>(peopleEpic$);
