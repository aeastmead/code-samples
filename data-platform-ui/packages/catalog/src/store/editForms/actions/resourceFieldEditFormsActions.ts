import { AnyAction } from 'redux';
import isNil from 'lodash/isNil';
import {
  IAPIResourceField,
  IAPIResourceFieldEditModel,
  IResourceFieldEditModel,
  IAPITagEditModel
} from '../../../types';
import { resourceActions } from '../../resource';
import { resourceFieldsActions, resourceFieldsSelectors } from '../../resourceFields';
import { EntityKind } from '../../shared';
import AbstractEditFormsActions, { IAbstractEditFormsActions, IEditFormsSaveContext } from './abstractEditFormsActions';
import EditFormsUtils from '../utils';

class ResourceFieldEditFormsActions
  extends AbstractEditFormsActions<EntityKind.RESOURCE_FIELD, IResourceFieldEditModel>
  implements IResourceFieldEditFormsActions
{
  constructor() {
    super(EntityKind.RESOURCE_FIELD);
  }

  async doSave({
    entityId,
    saveData,
    dependencies: { resourceFieldService },
    getState
  }: IEditFormsSaveContext<IResourceFieldEditModel>): Promise<AnyAction[] | undefined> {
    const { resourceFieldTags, ...rest } = saveData;
    let model: IAPIResourceFieldEditModel = { ...rest };

    if (!isNil(resourceFieldTags)) {
      const currentTagIds: number[] | undefined = resourceFieldsSelectors._selectTagIds(getState(), {
        entityId,
        tagTypeId: resourceFieldTags.tagTypeId
      });
      const tagFields: IAPITagEditModel = EditFormsUtils.buildTagFields(resourceFieldTags.tagIds, currentTagIds);
      model = {
        ...model,
        addResourceFieldTagIds: tagFields?.addTagIds,
        removeResourceFieldTagIds: tagFields?.removeTagIds
      };
    }
    const field: IAPIResourceField = await resourceFieldService.patchById(entityId, model);

    return [resourceActions.updateField(field), resourceFieldsActions.addFromAPI(field)];
  }
}

const resourceFieldEditFormsActions: IResourceFieldEditFormsActions = new ResourceFieldEditFormsActions();

export default resourceFieldEditFormsActions;

export interface IResourceFieldEditFormsActions
  extends IAbstractEditFormsActions<EntityKind.RESOURCE_FIELD, IResourceFieldEditModel> {}
