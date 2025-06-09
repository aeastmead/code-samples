import { gql } from 'graphql-request';
import isNil from 'lodash/isNil';
import { IAPIResourceField, IAPIResourceFieldEditModel, IResourceFieldEditModel } from '../types';
import APIClient from './apiClient';

export default class ResourceFieldService {
  constructor(private apiClient: APIClient) {
    this.map = this.map.bind(this);
    this.patchById = this.patchById.bind(this);
  }

  public patchById(id: number, model: IAPIResourceFieldEditModel): Promise<IAPIResourceField> {
    return this.apiClient
      .request<{ result: DataStoreResourceField }, { id: number; input: IResourceFieldEditModel }>(
        gql`
          mutation PatchResourceField($id: Int!, $input: PatchDataStoreResourceFieldInput!) {
            result: patchDataStoreResourceField(dataStoreResourceFieldId: $id, input: $input) {
              ...dataStoreResourceFields
            }
          }

          ${ResourceFieldService.FIELDS}
        `,
        { id, input: model }
      )
      .then(({ result }: { result: DataStoreResourceField }) => this.map(result));
  }

  public map(entity: DataStoreResourceField): IAPIResourceField;
  public map(entity: DataStoreResourceField | undefined | null): IAPIResourceField | undefined;
  public map(entity: DataStoreResourceField | undefined | null): IAPIResourceField | undefined {
    if (isNil(entity)) {
      return undefined;
    }

    return {
      id: entity.dataStoreResourceFieldId,
      resourceId: entity.dataStoreResourceFieldId,
      name: entity.name,
      description: entity.description ?? '',
      type: entity.type ?? '',
      canEdit: entity.canEdit === true,
      isRetentionColumn: entity.isRetentionColumn === true,
      tags:
        !isNil(entity.resourceFieldTags) && entity.resourceFieldTags.length > 0 ? entity.resourceFieldTags : undefined
    };
  }

  public static readonly RESOURCE_FIELD_TAG_MIN_FIELDS = gql`
    fragment resourceFieldTagMinFields on ResourceFieldTag {
      id: resourceFieldTagId
      tagTypeId
    }
  `;

  public static readonly RESOURCE_FIELD_TAG_FIELDS = gql`
    fragment resourceFieldTagFields on ResourceFieldTag {
      name
      ...resourceFieldTagMinFields
    }

    ${ResourceFieldService.RESOURCE_FIELD_TAG_MIN_FIELDS}
  `;

  public static readonly FIELDS = gql`
    fragment dataStoreResourceFields on DataStoreResourceField {
      dataStoreResourceFieldId
      dataStoreResourceId
      type
      name
      description
      canEdit
      isRetentionColumn
      resourceFieldTags {
        ...resourceFieldTagMinFields
      }
    }
    ${ResourceFieldService.RESOURCE_FIELD_TAG_MIN_FIELDS}
  `;
}

type ResourceFieldTagMin = {
  id: number;
  tagTypeId: number;
};

export type DataStoreResourceField = {
  dataStoreResourceFieldId: number;
  type: string;
  name: string;
  description?: string | null;
  canEdit?: boolean;
  isRetentionColumn?: boolean;
  resourceFieldTags?: ResourceFieldTagMin[] | null;
};
