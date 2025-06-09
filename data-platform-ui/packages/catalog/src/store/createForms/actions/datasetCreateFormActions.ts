import { AnyAction } from 'redux';

import { ThunkExtraArgument } from 'redux-thunk';
import { CreateDatasetRequest } from '../../../types';
import { EntityKind } from '../../shared';
import AbstractCreateFormsActions, { IAbstractCreateFormsActions } from './abstractCreateFormsActions';

class DatasetCreateFormActions
  extends AbstractCreateFormsActions<EntityKind.DATASET, CreateDatasetRequest>
  implements IDatasetCreateFormActions
{
  constructor() {
    super(EntityKind.DATASET);
  }

  public doSave(
    model: CreateDatasetRequest,
    { datasetService }: ThunkExtraArgument
  ): Promise<number | [number, AnyAction[]]> {
    return datasetService.create(model);
  }
}

const datasetCreateFormActions: IDatasetCreateFormActions = new DatasetCreateFormActions();

export default datasetCreateFormActions;

export interface IDatasetCreateFormActions
  extends IAbstractCreateFormsActions<EntityKind.DATASET, CreateDatasetRequest> {}
