import { AnyAction } from 'redux';
import { DefaultThunkDispatch, ThunkExtraArgument } from 'redux-thunk';
import { APIDatasetPolicyNote, DatasetPolicyNoteCreateModel } from '../../../types';
import { datasetPolicyNotesActions } from '../../datasetPolicyNotes';
import { EntityKind } from '../../shared';
import AbstractCreateFormsActions, { IAbstractCreateFormsActions } from './abstractCreateFormsActions';

export interface IDatasetPolicyNoteCreateFormActions
  extends IAbstractCreateFormsActions<EntityKind.DATASET_POLICY_NOTE, DatasetPolicyNoteCreateModel> {}

class DatasetPolicyNoteCreateFormActions extends AbstractCreateFormsActions<
  EntityKind.DATASET_POLICY_NOTE,
  DatasetPolicyNoteCreateModel
> {
  constructor() {
    super(EntityKind.DATASET_POLICY_NOTE);
  }
  public async doSave(
    model: DatasetPolicyNoteCreateModel,
    { datasetPolicyNoteService }: ThunkExtraArgument,
    _: DefaultThunkDispatch
  ): Promise<number | [number, AnyAction[]]> {
    const datasetPolicyNote: APIDatasetPolicyNote = await datasetPolicyNoteService.create(model);

    const actions: AnyAction[] = datasetPolicyNotesActions.addFromAPI(datasetPolicyNote);

    return [datasetPolicyNote.id, actions];
  }
}

const datasetPolicyNoteCreateFormActions: IDatasetPolicyNoteCreateFormActions =
  new DatasetPolicyNoteCreateFormActions();

export default datasetPolicyNoteCreateFormActions;
