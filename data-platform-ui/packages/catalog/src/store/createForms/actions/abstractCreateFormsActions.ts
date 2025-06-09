import { AnyAction } from 'redux';
import { DefaultThunkAction, DefaultThunkDispatch, ThunkExtraArgument } from 'redux-thunk';
import ErrorsUtil from '../../../utils/errors';
import { EntityKind } from '../../shared';
import { CreateFormModel, CreateFormsAction, CreateFormsActionType } from '../types';

/**
 * Common action creators
 */
export default abstract class AbstractCreateFormsActions<
  Kind extends EntityKind,
  Model extends CreateFormModel<Kind> = CreateFormModel<Kind>
> implements IAbstractCreateFormsActions<Kind, Model>
{
  readonly kind: Kind;

  public readonly saveRequest: CreateFormsAction.ISaveRequestAction;

  public readonly reset: CreateFormsAction.IResetAction;

  constructor(kind: Kind) {
    this.kind = kind;

    this.saveAsync = this.saveAsync.bind(this);
    this.saveSuccess = this.saveSuccess.bind(this);
    this.saveFailure = this.saveFailure.bind(this);
    this.doSave = this.doSave.bind(this);

    this.reset = {
      type: CreateFormsActionType.RESET,
      payload: {
        kind
      }
    };

    this.saveRequest = {
      type: CreateFormsActionType.SAVE_REQUEST,
      payload: {
        kind
      }
    };
  }

  /**
   *
   * @param {Model} model
   * @param {ThunkExtraArgument} di
   * @return {Promise<number | [number, AnyAction[]]>}
   */
  abstract doSave(
    model: Model,
    di: ThunkExtraArgument,
    dispatch: DefaultThunkDispatch
  ): Promise<number | [number, AnyAction[]]>;

  /**
   *
   * @param {Model} model
   * @return {DefaultThunkAction<Promise<number | undefined>>}
   */
  public saveAsync(model: Model): DefaultThunkAction<Promise<number | undefined>> {
    return async (dispatch: DefaultThunkDispatch, _, extraArgument: ThunkExtraArgument) => {
      dispatch(this.saveRequest);
      let entityId: number | undefined;

      const actions: AnyAction[] = [];

      try {
        const doSaveResponse: number | [number, AnyAction[]] = await this.doSave(model, extraArgument, dispatch);

        if (Array.isArray(doSaveResponse)) {
          entityId = doSaveResponse[0];
          Array.prototype.push.apply(actions, doSaveResponse[1]);
        } else {
          entityId = doSaveResponse;
        }

        actions.push(this.saveSuccess(entityId));
      } catch (cause) {
        const error = ErrorsUtil.apiSaveError(cause);

        actions.push(this.saveFailure(error));
      }

      for (const action of actions) {
        dispatch(action);
      }

      return entityId;
    };
  }

  public saveFailure(error: any): CreateFormsAction.ISaveFailureAction {
    return {
      type: CreateFormsActionType.SAVE_FAILURE,
      payload: {
        kind: this.kind,
        error
      },
      error: true
    };
  }

  public saveSuccess(entityId: number): CreateFormsAction.ISaveSuccessAction {
    return {
      type: CreateFormsActionType.SAVE_SUCCESS,
      payload: {
        kind: this.kind,
        entityId
      }
    };
  }
}

export interface IAbstractCreateFormsActions<Kind extends EntityKind, Model extends CreateFormModel<Kind>> {
  readonly saveRequest: CreateFormsAction.ISaveRequestAction;
  readonly reset: CreateFormsAction.IResetAction;
  saveSuccess(entityId: number): CreateFormsAction.ISaveSuccessAction;
  saveFailure(error: any): CreateFormsAction.ISaveFailureAction;

  saveAsync(model: Model): DefaultThunkAction<Promise<number | undefined>>;
}
