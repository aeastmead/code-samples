import { DefaultRootState } from 'react-redux';
import { IAPIResource, IResourceEditModel, IAPITagEditModel } from '../../../types';
import { EntityKind } from '../../shared';
import AbstractEditFormsActions, { IAbstractEditFormsActions, IEditFormsSaveContext } from './abstractEditFormsActions';
import { resourceActions, resourceSelectors } from '../../resource';
import { AnyAction } from 'redux';
import isNil from 'lodash/isNil';
import EditFormsUtils from '../utils';

class ResourceEditFormActions extends AbstractEditFormsActions<EntityKind.RESOURCE, IResourceEditModel> {
  constructor() {
    super(EntityKind.RESOURCE);
  }

  async doSave({
    entityId: _entityId,
    saveData,
    getState,
    dependencies: { resourceService }
  }: IEditFormsSaveContext<IResourceEditModel>): Promise<AnyAction[] | undefined> {
    let entityId: number = _entityId;
    const { resourceTagIds, ...rest } = saveData;
    let model: IResourceEditModel = { ...rest };

    if (_entityId <= 0) {
      const {
        resource: { data }
      }: DefaultRootState = getState();

      entityId = !isNil(data) ? data.id : -1;
    }
    if ('resourceTagIds' in saveData) {
      const currentTagIds: number[] | undefined = resourceSelectors.getTagIds(getState());
      const tagFields: IAPITagEditModel = EditFormsUtils.buildTagFields(resourceTagIds, currentTagIds);
      model = {
        ...model,
        addResourceTagIds: tagFields?.addTagIds,
        removeResourceTagIds: tagFields?.removeTagIds
      };
    }

    const resourceEditModel: IAPIResource = await resourceService.patchResourceById(entityId, model);
    return resourceActions.updateFromAPI(resourceEditModel);
  }
}

const resourceEditForms = new ResourceEditFormActions();

export default resourceEditForms;

export interface IResourceEditFormsActions extends IAbstractEditFormsActions<EntityKind.RESOURCE, IResourceEditModel> {}
