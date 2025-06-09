import isNil from 'lodash/isNil';
import { DefaultRootState } from 'react-redux';
import { AnyAction } from 'redux';
import { DefaultThunkAction, DefaultThunkDispatch, ThunkExtraArgument } from 'redux-thunk';
import ErrorsUtil from '../../../utils/errors';
import { EntityKind } from '../../shared';
import { EditFormFieldName, EditFormModel, EditFormsAction, EditFormsActionType } from '../types';
import EditFormsUtils from '../utils';

export interface IEditFormsSaveContext<Model extends EditFormModel<any>> {
  entityId: number;
  saveData: Model;
  dependencies: ThunkExtraArgument;
  getState: () => DefaultRootState;
  dispatch: DefaultThunkDispatch;
}

/**
 * Common action creators
 */
export default abstract class AbstractEditFormsActions<
  Kind extends EntityKind,
  Model extends EditFormModel<Kind> = EditFormModel<Kind>
> implements IAbstractEditFormsActions<Kind, Model>
{
  readonly kind: Kind;

  constructor(kind: Kind) {
    this.kind = kind;

    this.saveAsync = this.saveAsync.bind(this);
    this.saveRequest = this.saveRequest.bind(this);
    this.saveSuccess = this.saveSuccess.bind(this);
    this.saveFailure = this.saveFailure.bind(this);
    this.reset = this.reset.bind(this);
  }

  /**
   * Custom save logic.
   * @param {number} entityId
   * @param {Model} model
   * @param {ThunkExtraArgument} di - API dependency container
   * @return {Promise<AnyAction[] | undefined>} - Additional actions to be dispatched before Save Success action
   */
  abstract doSave(context: IEditFormsSaveContext<Model>): Promise<AnyAction[] | undefined>;

  /**
   * Start of Saving operation.
   * @param {EditFormFieldName<Kind>} fieldName - The property name being updated. Used to create a unique state id.
   * @param {number} entityId
   * @param {Model} model - Save data
   * @return {DefaultThunkAction<Promise<boolean>>}
   */
  public saveAsync(
    fieldName: EditFormFieldName<Kind>,
    entityId: number,
    model: Model
  ): DefaultThunkAction<Promise<boolean>>;
  public saveAsync(fieldName: EditFormFieldName<Kind>, model: Model): DefaultThunkAction<Promise<boolean>>;
  public saveAsync(
    fieldName: EditFormFieldName<Kind>,
    entityIdOrModel: number | Model,
    ...args: any[]
  ): DefaultThunkAction<Promise<boolean>> {
    let entityId: number;
    let model: Model;
    let stateId: string;

    if (typeof entityIdOrModel === 'number') {
      entityId = entityIdOrModel;
      model = args[0];
      stateId = this.createStateId(fieldName, entityId);
    } else {
      stateId = this.createStateId(fieldName);
      // @TODO: update other actions
      entityId = -1;
      model = entityIdOrModel;
    }

    return async (
      dispatch: DefaultThunkDispatch,
      getState: () => DefaultRootState,
      dependencies: ThunkExtraArgument
    ) => {
      dispatch(this.saveRequest(stateId));

      let result: boolean = false;

      const actions: AnyAction[] = [];

      try {
        const additionalActions: AnyAction[] | undefined = await this.doSave({
          entityId,
          dependencies,
          getState,
          dispatch,
          saveData: model
        });

        if (!isNil(additionalActions)) {
          Array.prototype.push.apply(actions, additionalActions);
        }

        actions.push(this.saveSuccess(stateId));

        result = true;
      } catch (cause) {
        const error = ErrorsUtil.apiSaveError(cause);

        actions.push(this.saveFailure(stateId, error));
      }

      for (const action of actions) {
        dispatch(action);
      }

      return result;
    };
  }

  createStateId(fieldName: EditFormFieldName<Kind>, entityId?: number): string {
    return EditFormsUtils.editFormStateId({ kind: this.kind, fieldName, id: entityId });
  }

  public reset(fieldName: EditFormFieldName<Kind>, entityId: number): EditFormsAction.IResetAction;
  public reset(stateId: string): EditFormsAction.IResetAction;
  public reset(fieldNameOrStateId: EditFormFieldName<Kind> | string, entityId?: number): EditFormsAction.IResetAction {
    const stateId: string =
      fieldNameOrStateId.indexOf(':') >= 0
        ? (fieldNameOrStateId as string)
        : this.createStateId(fieldNameOrStateId as any, entityId);

    return {
      type: EditFormsActionType.RESET,
      payload: {
        id: stateId
      }
    };
  }

  public saveFailure(stateId: string, error: any): EditFormsAction.ISaveFailureAction {
    return {
      type: EditFormsActionType.SAVE_FAILURE,
      payload: {
        id: stateId,
        error
      },
      error: true
    };
  }

  public saveRequest(stateId: string): EditFormsAction.ISaveRequestAction {
    return {
      type: EditFormsActionType.SAVE_REQUEST,
      payload: {
        id: stateId
      }
    };
  }

  public saveSuccess(stateId: string): EditFormsAction.ISaveSuccessAction {
    return {
      type: EditFormsActionType.SAVE_SUCCESS,
      payload: {
        id: stateId
      }
    };
  }
}

export interface IAbstractEditFormsActions<Kind extends EntityKind, Model extends EditFormModel<Kind>> {
  saveRequest(stateId: string): EditFormsAction.ISaveRequestAction;
  saveSuccess(stateId: string): EditFormsAction.ISaveSuccessAction;
  saveFailure(stateId: string, error: any): EditFormsAction.ISaveFailureAction;

  reset(fieldName: EditFormFieldName<Kind>): EditFormsAction.IResetAction;
  reset(fieldName: EditFormFieldName<Kind>, entityId: number): EditFormsAction.IResetAction;
  reset(stateId: string): EditFormsAction.IResetAction;

  saveAsync(field: EditFormFieldName<Kind>, model: Model): DefaultThunkAction<Promise<boolean>>;
  saveAsync(field: EditFormFieldName<Kind>, entityId: number, model: Model): DefaultThunkAction<Promise<boolean>>;
}
