import { IAPIResourceField, IResourceField } from '../../types';
import { ResourceFieldsAction, ResourceFieldsActionType } from './types';
import isNil from 'lodash/isNil';

export interface IResourceFieldsActions {
  addFromAPI(fields: IAPIResourceField | IAPIResourceField[]): ResourceFieldsAction.IAddAction;
  add(fields: IResourceField | IResourceField[]): ResourceFieldsAction.IAddAction;
  reset(): ResourceFieldsAction.IResetAction;

  /**
   *
   * @param {IAPIResourceField | IAPIResourceField[]} apiFieldOrAPIFields
   * @returns {[number[], IResourceField[], (number | undefined)]} - [ids, resourceFields, retentionFieldId]
   */
  normalize(
    apiFieldOrAPIFields: IAPIResourceField | IAPIResourceField[]
  ): [number[], IResourceField[], number | undefined];
}

class ResourceFieldsActions implements IResourceFieldsActions {
  constructor() {
    this.addFromAPI = this.addFromAPI.bind(this);
    this.add = this.add.bind(this);

    this.normalize = this.normalize.bind(this);
  }

  public reset(): ResourceFieldsAction.IResetAction {
    return {
      type: ResourceFieldsActionType.RESET
    };
  }

  public add(fieldOrFields: IResourceField | IResourceField[]): ResourceFieldsAction.IAddAction {
    return {
      type: ResourceFieldsActionType.ADD,
      payload: Array.isArray(fieldOrFields) ? fieldOrFields : [fieldOrFields]
    };
  }

  public addFromAPI(fieldOrFields: IAPIResourceField | IAPIResourceField[]): ResourceFieldsAction.IAddAction {
    const [, fields] = this.normalize(fieldOrFields);

    return this.add(fields);
  }

  /**
   *
   * @param {IAPIResourceField | IAPIResourceField[]} apiFieldOrAPIFields
   * @returns {[number[], IResourceField[], (number | undefined)]} - [ResourceFieldIds, ResourceFields, ResourceFieldId used for retention]
   */
  public normalize(
    apiFieldOrAPIFields: IAPIResourceField | IAPIResourceField[]
  ): [number[], IResourceField[], number | undefined] {
    if (!Array.isArray(apiFieldOrAPIFields)) {
      const field: IResourceField = ResourceFieldsActions._fromAPI(apiFieldOrAPIFields);

      return [[field.id], [field], apiFieldOrAPIFields.isRetentionColumn ? apiFieldOrAPIFields.id : undefined];
    }
    const ids: number[] = [];
    const fields: IResourceField[] = [];

    let retentionResourceFieldId: number | undefined;

    for (const apiField of apiFieldOrAPIFields) {
      fields.push(ResourceFieldsActions._fromAPI(apiField));
      ids.push(apiField.id);

      if (apiField.isRetentionColumn) {
        retentionResourceFieldId = apiField.id;
      }
    }

    return [ids, fields, retentionResourceFieldId];
  }

  private static _fromAPI(apiField: IAPIResourceField): IResourceField {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { isRetentionColumn, tags, ...rest }: IAPIResourceField = apiField;

    const resourceField: IResourceField = {
      ...rest,
      tagIdByTagTypeId: undefined
    };

    if (!isNil(tags) && tags.length > 0) {
      resourceField.tagIdByTagTypeId = {};
      for (const tag of tags) {
        if (isNil(resourceField.tagIdByTagTypeId[tag.tagTypeId])) {
          resourceField.tagIdByTagTypeId[tag.tagTypeId] = [tag.id];
        } else {
          resourceField.tagIdByTagTypeId[tag.tagTypeId].push(tag.id);
        }
      }
    }

    return resourceField;
  }
}

const resourceFieldsActions: IResourceFieldsActions = new ResourceFieldsActions();

export default resourceFieldsActions;
