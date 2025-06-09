import { AnyAction } from 'redux';
import { IDatasetEditModel } from '../../../types';
import { datasetsActions } from '../../datasets';
import { EntityKind } from '../../shared';
import AbstractEditFormsActions, { IAbstractEditFormsActions, IEditFormsSaveContext } from './abstractEditFormsActions';

class DatasetEditFormsActions
  extends AbstractEditFormsActions<EntityKind.DATASET, IDatasetEditModel>
  implements IDatasetEditFormsActions
{
  constructor() {
    super(EntityKind.DATASET);
  }

  /**
   * Attempts to update dataset, then returns action for updating dataset. Error handling passed to parent.
   * @param {number} entityId
   * @param {IDatasetEditModel} model
   * @param {ReduxSideEffectIOC} datasetService
   * @return {Promise<AnyAction[] | undefined>}
   */
  doSave({
    entityId,
    saveData,
    dependencies: { datasetService }
  }: IEditFormsSaveContext<IDatasetEditModel>): Promise<AnyAction[] | undefined> {
    return datasetService.patchById(entityId, saveData).then(datasetsActions.updateFromAPI);
  }
}

const datasetEditFormActions: IDatasetEditFormsActions = new DatasetEditFormsActions();

export default datasetEditFormActions;

export interface IDatasetEditFormsActions extends IAbstractEditFormsActions<EntityKind.DATASET, IDatasetEditModel> {}
