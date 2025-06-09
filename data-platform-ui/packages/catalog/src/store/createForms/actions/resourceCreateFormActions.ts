import { AnyAction } from 'redux';

import { DefaultThunkDispatch, ThunkExtraArgument } from 'redux-thunk';
import { IAPIDatasetOwnership, IPerson, IResourceFailedVerification, ResourceCreateModel } from '../../../types';
import ErrorsUtil from '../../../utils/errors';
import { datasetsActions, IUpdatedDataset } from '../../datasets';
import { peopleActions } from '../../people';
import { resourcesActions } from '../../resources';
import { EntityKind, NormalizerUtility } from '../../shared';
import { INormalizedPeopleResult } from '../../shared/normalizer';
import AbstractCreateFormsActions, { IAbstractCreateFormsActions } from './abstractCreateFormsActions';

class ResourceCreateFormActions
  extends AbstractCreateFormsActions<EntityKind.RESOURCE, ResourceCreateModel>
  implements IResourceCreateFormActions
{
  constructor() {
    super(EntityKind.RESOURCE);

    this.doSave = this.doSave.bind(this);

    this._createUpdateActions = this._createUpdateActions.bind(this);
  }

  public async doSave(
    model: ResourceCreateModel,
    thunkExtraArgument: ThunkExtraArgument,
    dispatch: DefaultThunkDispatch
  ): Promise<number | [number, AnyAction[]]> {
    const resourceIdOrFailedVerification: number | IResourceFailedVerification =
      await thunkExtraArgument.resourceService.create(model);

    if (typeof resourceIdOrFailedVerification !== 'number') {
      throw ErrorsUtil.resourceVerifyError(resourceIdOrFailedVerification);
    }

    const resourceId: number = resourceIdOrFailedVerification;

    await dispatch(resourcesActions.fetchAsync(resourceId));

    const actions: AnyAction[] = await this._createUpdateActions(resourceId, model, thunkExtraArgument);

    return [resourceId, actions];
  }

  private async _createUpdateActions(
    resourceId: number,

    model: ResourceCreateModel,
    { datasetService }: ThunkExtraArgument
  ): Promise<AnyAction[]> {
    let updateDataset: IUpdatedDataset = {
      id: model.datasetId,
      addResourceIds: [resourceId]
    };
    if (!model.withOwners) {
      return [datasetsActions.update(updateDataset)];
    }

    const apiDatasetOwnership: IAPIDatasetOwnership | undefined = await datasetService.getDatasetOwnership(
      model.datasetId
    );

    if (apiDatasetOwnership === undefined) {
      return [datasetsActions.update(updateDataset)];
    }

    updateDataset = {
      ...updateDataset,
      hasDataStore: apiDatasetOwnership.hasDataStore,
      dataOwnerGroupId: apiDatasetOwnership.dataOwnerGroupId,
      engineeringOwnerGroupId: apiDatasetOwnership.engineeringOwnerGroupId
    };

    const normalPeople: INormalizedPeopleResult | undefined = NormalizerUtility.normalPeople(
      apiDatasetOwnership.dataOwners,
      apiDatasetOwnership.engineeringOwners
    );

    const people: IPerson[] = [];

    if (normalPeople !== undefined) {
      updateDataset.dataOwnerIds = normalPeople[0];
      updateDataset.engineeringOwnerIds = normalPeople[1];

      people.push(...normalPeople.allPeople);
    }

    const updateDatasetAction: AnyAction = datasetsActions.update(updateDataset);

    return people.length > 0 ? [peopleActions.add(people), updateDatasetAction] : [updateDatasetAction];
  }
}

const resourceCreateFormActions: IResourceCreateFormActions = new ResourceCreateFormActions();

export default resourceCreateFormActions;

export interface IResourceCreateFormActions
  extends IAbstractCreateFormsActions<EntityKind.RESOURCE, ResourceCreateModel> {}
