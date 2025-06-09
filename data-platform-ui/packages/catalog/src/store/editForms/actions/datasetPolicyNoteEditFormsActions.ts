import { AnyAction } from 'redux';
import { APIDatasetPolicyNote, DatasetPolicyNoteEditModel } from '../../../types';
import { EntityKind } from '../../shared';
import AbstractEditFormsActions, { IAbstractEditFormsActions, IEditFormsSaveContext } from './abstractEditFormsActions';
import { datasetPolicyNotesActions } from '../../datasetPolicyNotes';

export interface IDatasetPolicyNoteEditFormsActions
  extends IAbstractEditFormsActions<EntityKind.DATASET_POLICY_NOTE, DatasetPolicyNoteEditModel> {}

class DatasetPolicyNoteEditFormsActions
  extends AbstractEditFormsActions<EntityKind.DATASET_POLICY_NOTE, DatasetPolicyNoteEditModel>
  implements IDatasetPolicyNoteEditFormsActions
{
  constructor() {
    super(EntityKind.DATASET_POLICY_NOTE);
  }

  async doSave({
    entityId,
    saveData,
    dependencies: { datasetPolicyNoteService }
  }: IEditFormsSaveContext<DatasetPolicyNoteEditModel>): Promise<AnyAction[] | undefined> {
    const apiDatasetPolicyNote: APIDatasetPolicyNote = await datasetPolicyNoteService.patchById(entityId, saveData);
    return datasetPolicyNotesActions.addFromAPI(apiDatasetPolicyNote);
  }
}

const datasetPolicyNoteEditFormsActions: IDatasetPolicyNoteEditFormsActions = new DatasetPolicyNoteEditFormsActions();

export default datasetPolicyNoteEditFormsActions;
