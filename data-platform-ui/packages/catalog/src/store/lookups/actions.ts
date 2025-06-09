import { DefaultThunkAction, DefaultThunkDispatch, ThunkExtraArgument } from 'redux-thunk';
import { ILookups } from '../../types';
import ErrorsUtil from '../../utils/errors';
import { LookupsAction, LookupsActionType } from './type';

class LookupsActions implements ILookupsActions {
  constructor() {
    this.fetchAsync = this.fetchAsync.bind(this);
    this.fetchRequest = this.fetchRequest.bind(this);
    this.fetchSuccess = this.fetchSuccess.bind(this);
    this.reset = this.reset.bind(this);
    this.fetchFailure = this.fetchFailure.bind(this);
  }

  public async fetchAsync(
    dispatch: DefaultThunkDispatch,
    _: any,
    { lookupService }: ThunkExtraArgument
  ): Promise<boolean> {
    dispatch(this.fetchRequest);

    let success = true;

    let action: LookupsAction.IFetchSuccessAction | LookupsAction.IFetchFailureAction;

    try {
      const lookups: ILookups = await lookupService.getAll();

      action = this.fetchSuccess(lookups);
    } catch (cause) {
      const error = ErrorsUtil.apiErrorWithCause(cause, 'Unable to load lookup values');
      success = false;
      action = this.fetchFailure(error);
    }
    dispatch(action);
    return success;
  }

  public fetchFailure(error: any): LookupsAction.IFetchFailureAction {
    return {
      type: LookupsActionType.FETCH_FAILURE,
      payload: { error },
      error: true
    };
  }

  public fetchRequest(): LookupsAction.IFetchRequestAction {
    return {
      type: LookupsActionType.FETCH_REQUEST
    };
  }

  public fetchSuccess(payload: ILookups): LookupsAction.IFetchSuccessAction {
    return {
      type: LookupsActionType.FETCH_SUCCESS,
      payload
    };
  }

  public reset(): LookupsAction.IResetAction {
    return {
      type: LookupsActionType.RESET
    };
  }
}

const lookupsActions: ILookupsActions = new LookupsActions();

export default lookupsActions;

export interface ILookupsActions {
  fetchRequest(): LookupsAction.IFetchRequestAction;
  fetchFailure(error: any): LookupsAction.IFetchFailureAction;
  fetchSuccess(data: ILookups): LookupsAction.IFetchSuccessAction;

  reset(): LookupsAction.IResetAction;

  fetchAsync: DefaultThunkAction<Promise<boolean>>;
}
