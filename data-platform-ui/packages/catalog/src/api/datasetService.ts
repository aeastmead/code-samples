import { gql } from 'graphql-request';
import isNil from 'lodash/isNil';
import {
  CanRestrictState,
  CreateDatasetRequest,
  IAPIDataset,
  IAPIDatasetOwnership,
  IDataClassification,
  IDatasetEditModel,
  IPerson
} from '../types';
import APIClient from './apiClient';

export default class DatasetService {
  constructor(private apiClient: APIClient) {
    this.map = this.map.bind(this);
    this.getById = this.getById.bind(this);

    this.patchById = this.patchById.bind(this);
    this.getSnapshot = this.getSnapshot.bind(this);
    this.getDatasetOwnership = this.getDatasetOwnership.bind(this);
  }

  public getById(dataSubsetId: number): Promise<IAPIDataset | undefined> {
    return this.apiClient
      .request<{ result: DataSubset | null }, { dataSubsetId: number }>(
        gql`
          query DataSubset($dataSubsetId: Int!) {
            result: dataSubsetById(dataSubsetId: $dataSubsetId) {
              ...dataSubsetFields
            }
          }

          ${DatasetService.FIELDS}
        `,
        { dataSubsetId }
      )
      .then((data: { result: DataSubset | null }) => this.map(data.result));
  }

  public async patchById(datasetId: number, model: IDatasetEditModel): Promise<IAPIDataset | undefined> {
    const { personIds, name, ...rest }: IDatasetEditModel = model;

    const input: PatchDataSubsetInput = { ...rest };
    if (personIds !== undefined && personIds !== null && personIds.length > 0) {
      input.approverIds = [...personIds];
    }

    if (name !== undefined && name !== null) {
      input.displayName = name;
    }

    return this.apiClient
      .request<{ patchDataSubset: DataSubset }, { dataSubsetId: number; input: PatchDataSubsetInput }>(
        gql`
          mutation PatchDataSubsetV2($dataSubsetId: Int!, $input: PatchDataSubsetV2Input!) {
            patchDataSubset: patchDataSubsetV2(dataSubsetId: $dataSubsetId, input: $input) {
              ...dataSubsetFields
            }
          }
          ${DatasetService.FIELDS}
        `,
        { dataSubsetId: datasetId, input }
      )
      .then(({ patchDataSubset }: { patchDataSubset: DataSubset }) => this.map(patchDataSubset));
  }

  public create(input: CreateDatasetRequest): Promise<number> {
    return this.apiClient
      .request<{ id: number }, { input: CreateDatasetRequest }>(
        gql`
          mutation NewDataset($input: CreateDatasetV2Input!) {
            id: createDatasetV2(input: $input)
          }
        `,
        { input }
      )
      .then(({ id }: { id: number }) => id);
  }

  public delete(datasetId: number): Promise<number> {
    return this.apiClient
      .request<{ id: number }, { datasetId: number }>(
        gql`
          mutation DeleteDataset($datasetId: Int!) {
            id: deleteDataset(datasetId: $datasetId)
          }
        `,
        { datasetId }
      )
      .then(({ id }: { id: number }) => id);
  }

  public async getSnapshot(datasetId: number): Promise<IAPIDataset | undefined> {
    const dataSubset: DataSubset | undefined = await this.apiClient
      .request<{ dataSubset: DataSubset | null }, { datasetId: number }>(
        gql`
          query DatasetSnapship($datasetId: Int!) {
            dataSubset: dataSubsetById(dataSubsetId: $datasetId) {
              ...dataSubsetSnapshotFields
              ...dataSubsetOwnershipFields
            }
          }

          ${DatasetService.SNAPSHOT_FIELDS}
          ${DatasetService.OWNERSHIP_FIELDS}
        `,
        { datasetId }
      )
      .then(({ dataSubset }: { dataSubset: DataSubset | null }) => (dataSubset !== null ? dataSubset : undefined));

    return dataSubset !== undefined ? this.map(dataSubset, true) : undefined;
  }

  public async getDatasetOwnership(datasetId: number): Promise<IAPIDatasetOwnership | undefined> {
    const res: DataSubset | undefined = await this.apiClient
      .request<{ dataSubset: DataSubset | null }, { datasetId: number }>(
        gql`
          query GetDatasetOwnership($datasetId: Int!) {
            dataSubset: dataSubsetById(dataSubsetId: $datasetId) {
              ...dataSubsetOwnershipFields

              hasDataStore
            }
          }
          ${DatasetService.OWNERSHIP_FIELDS}
        `,
        { datasetId }
      )
      .then(({ dataSubset }: { dataSubset: DataSubset | null }) => (dataSubset !== null ? dataSubset : undefined));

    if (res === undefined) {
      return undefined;
    }
    let dataOwners: IPerson[] | undefined;

    let engineeringOwners: IPerson[] | undefined;

    let dataOwnerGroupId: number | undefined;

    let engineeringOwnerGroupId: number | undefined;

    let pwhoId: number | undefined;

    let pwhoWebLink: string | undefined;

    const datasetOwnership: DatasetOwnership | undefined | null = res.datasetOwnership;
    if (!isNil(datasetOwnership)) {
      pwhoId = !isNil(datasetOwnership.pwhoId) ? datasetOwnership.pwhoId : undefined;

      pwhoWebLink = !isNil(datasetOwnership.pwhoWebLink) ? datasetOwnership.pwhoWebLink : undefined;

      dataOwners =
        !isNil(datasetOwnership.dataOwners) && datasetOwnership.dataOwners.length > 0
          ? datasetOwnership.dataOwners
          : undefined;

      engineeringOwners =
        !isNil(datasetOwnership.engineeringOwners) && datasetOwnership.engineeringOwners.length > 0
          ? datasetOwnership.engineeringOwners
          : undefined;

      dataOwnerGroupId = !isNil(datasetOwnership.dataOwnerGroupId) ? datasetOwnership.dataOwnerGroupId : undefined;
      engineeringOwnerGroupId = !isNil(datasetOwnership.engineeringOwnerGroupId)
        ? datasetOwnership.engineeringOwnerGroupId
        : undefined;
    }

    return {
      id: res.dataSubsetId,
      hasDataStore: res.hasDataStore === true,
      canEditDevOwnership: res.canEditDevOwnership === true,
      dataOwnerGroupId,
      dataOwners,
      engineeringOwnerGroupId,
      engineeringOwners,
      pwhoId,
      pwhoWebLink
    };
  }

  public map(entity: DataSubset, isSnapshot?: boolean): IAPIDataset;
  public map(entity: DataSubset | undefined | null, isSnapshot?: boolean): IAPIDataset | undefined;
  public map(entity: DataSubset | undefined | null, isSnapshot?: boolean): IAPIDataset | undefined {
    if (isNil(entity)) {
      return undefined;
    }
    const canEdit = entity.canEdit === true;
    const result: IAPIDataset = {
      id: entity.dataSubsetId,
      name: entity.displayName ?? '',
      description: entity.description ?? '',
      resourceIds: undefined,
      people: undefined,
      canEdit: entity.canEdit === true,
      canDelete: entity.canDelete === true,
      canEditApproverIds: canEdit,
      canRestrictState: !isNil(entity.canRestrictState) ? entity.canRestrictState : CanRestrictState.FALSE,
      canAccess: entity.canAccess === true,
      externalPrivilegeUrl: undefined,
      categoryName: undefined,
      dataOwnerGroupId: undefined,
      engineeringOwnerGroupId: undefined,
      engineeringOwners: undefined,
      pwhoId: undefined,
      pwhoWebLink: undefined,
      dataOwners: undefined,
      hasDataStore: entity.hasDataStore === true,
      isSnapshot: isSnapshot === true,
      metadataHealthScores:
        entity.datasetMetadataHealthScores !== null ? entity.datasetMetadataHealthScores : undefined,
      mdcLinkUrl: undefined,
      compactName: entity.compactName,
      mdcRegistration: !isNil(entity.mdcRegistration) ? entity.mdcRegistration : false,
      pvfxValue: entity.externalPrivilegeId?.externalPrivilegeValue,
      pvfxObject: entity.externalPrivilegeId?.externalPrivilegeObject,
      dataClassifications: undefined,
      classifications: undefined,
      brmRiskValue: entity.riskScore?.score,
      brmRiskCategory: entity.riskScore?.category,
      brmRiskHyperLink: entity.riskScore?.hyperlink,
      isRestricted: entity.isRestricted === true,
      requestAccessTerminalFunction: entity.externalPrivilegeId?.webLink.terminalFunction,
      requestAccessBlink: entity.externalPrivilegeId?.webLink.url
    };
    if (
      !isNil(entity.externalPrivilegeId?.dataClassification) &&
      entity.externalPrivilegeId?.dataClassification.length > 0
    ) {
      result.dataClassifications = entity.externalPrivilegeId?.dataClassification.sort(
        (c1: IDataClassification, c2: IDataClassification) => c2.ranking - c1.ranking
      );
      result.classifications = entity.externalPrivilegeId?.dataClassification.map(
        (dc: IDataClassification) => dc.dataClassificationTypeName
      );
    }

    // @TODO: switch to just datasetCatagoryId. Name is in lookup state
    if (!isNil(entity.dataset) && !isNil(entity.dataset.datasetCategory)) {
      result.categoryName = entity.dataset.datasetCategory.displayName;
    }

    // @TODO: for now we are guaranteed to get the base url for the mdc link from the API, but we need to construct the rest here; we need the locationName and resource name to generate the mdcLink.
    result.mdcLinkUrl = `${entity.mdcLinkURL}${entity.compactName}-${entity.dataSubsetId}`;

    if (!isNil(entity.ownershipInfo)) {
      result.people =
        !isNil(entity.ownershipInfo.owners) && entity.ownershipInfo.owners.length > 0
          ? entity.ownershipInfo.owners
          : undefined;

      result.externalPrivilegeUrl = !isNil(entity.ownershipInfo.webLink) ? entity.ownershipInfo.webLink.url : undefined;
      result.canEditApproverIds = entity.ownershipInfo.canEdit === true;
    }

    if (!isNil(entity.datasetOwnership)) {
      const { dataOwners, dataOwnerGroupId, engineeringOwners, engineeringOwnerGroupId, pwhoId, pwhoWebLink } =
        entity.datasetOwnership;

      result.dataOwners = !isNil(dataOwners) && dataOwners.length > 0 ? dataOwners : undefined;
      result.engineeringOwners =
        !isNil(engineeringOwners) && engineeringOwners.length > 0 ? engineeringOwners : undefined;

      result.engineeringOwnerGroupId = !isNil(engineeringOwnerGroupId) ? engineeringOwnerGroupId : undefined;
      result.dataOwnerGroupId = !isNil(dataOwnerGroupId) ? dataOwnerGroupId : undefined;

      result.pwhoId = !isNil(pwhoId) ? pwhoId : undefined;
      result.pwhoWebLink = !isNil(pwhoWebLink) ? pwhoWebLink : undefined;
    }

    return result;
  }

  static SNAPSHOT_FIELDS = gql`
    fragment dataSubsetSnapshotFields on DataSubset {
      dataSubsetId
      displayName
      description
      canAccess
      canEdit
      canDelete
      hasDataStore
      dataset {
        datasetCategory {
          displayName
        }
      }
    }
  `;

  static OWNERSHIP_FIELDS = gql`
    fragment dataSubsetOwnershipFields on DataSubset {
      ownershipInfo {
        canEdit
        owners {
          id
          name
        }
        webLink {
          url
        }
      }
      datasetOwnership {
        pwhoId
        pwhoWebLink
        dataOwnerGroupId
        engineeringOwnerGroupId
        dataOwners {
          id
          name
        }
        engineeringOwners {
          id
          name
        }
      }
    }
  `;

  static FIELDS = gql`
    fragment dataSubsetFields on DataSubset {
      ...dataSubsetSnapshotFields
      ...dataSubsetOwnershipFields
      datasetMetadataHealthScores {
        label
        score
      }
      externalPrivilegeId {
        externalPrivilegeValue
        externalPrivilegeObject
        dataClassification {
          dataClassificationTypeName
          description
          ranking
        }
        webLink {
          url
          terminalFunction
        }
      }
      compactName
      mdcRegistration
      mdcLinkURL
      riskScore {
        score
        category
        hyperlink
      }
      isRestricted
      canRestrictState
    }

    ${DatasetService.SNAPSHOT_FIELDS}
    ${DatasetService.OWNERSHIP_FIELDS}
  `;

  static BRI_FIELDS = gql`
    fragment datasetBriFields on ExternalPrivilegeId {
      externalPrivilegeObject
      externalPrivilegeValue
    }
  `;
}

type DatasetOwnership = {
  pwhoId: number | null;
  pwhoWebLink: string | null;
  dataOwnerGroupId: number | null;
  engineeringOwnerGroupId: number | null;
  engineeringOwners: Owner[] | null;
  dataOwners: Owner[] | null;
};

export type DatasetBriFields = {
  externalPrivilegeValue: string;
  externalPrivilegeObject: string;
};

type ExternalPrivilegeId = {
  externalPrivilegeValue: string;
  externalPrivilegeObject: string;
  dataClassification: IDataClassification[] | undefined;
  webLink: {
    terminalFunction: string;
    url: string;
  };
};

export type DataSubset = {
  dataSubsetId: number;
  displayName: string;
  compactName: string;
  description: string;
  ownershipInfo?: OwnershipInfo;
  externalPrivilegeId: ExternalPrivilegeId;
  canEdit?: boolean;
  canDelete?: boolean;
  canAccess?: boolean;
  canEditDevOwnership?: boolean;
  dataset?: {
    datasetCategory?: {
      displayName?: string;
    };
  };
  hasDataStore?: boolean;
  datasetOwnership?: DatasetOwnership;
  datasetMetadataHealthScores?: MetadataHealthScore[] | null;
  mdcRegistration?: boolean;
  mdcLinkURL?: string | null;
  riskScore?: RiskScore | null;
  isRestricted?: boolean;
  canRestrictState?: CanRestrictState;
};

type MetadataHealthScore = {
  label: string;
  score: number;
};

type OwnershipInfo = {
  owners?: Owner[];
  webLink?: {
    url: string;
  };
  canEdit?: boolean;
};

type Owner = {
  id: number;
  name: string;
};

type PatchDataSubsetInput = {
  displayName?: string;
  description?: string;
  approverIds?: number[];
  isRestricted?: boolean;
  engineeringOwnerIds?: number[];
  dataOwnerIds?: number[];
  engineeringOwnerGroupId?: number;
  dataOwnerGroupId?: number;
};
type RiskScore = {
  score: number;
  category: string;
  hyperlink: string;
};
