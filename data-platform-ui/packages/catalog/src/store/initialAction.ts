import { DefaultThunkDispatch } from 'redux-thunk';
import { lookupsActions } from './lookups';

/**
 * Action ran before app mounts
 * @return {Promise<boolean>}
 */
export default async function initialAction(dispatch: DefaultThunkDispatch): Promise<void> {
  await dispatch<Promise<boolean>>(lookupsActions.fetchAsync);
}
