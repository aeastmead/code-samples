import { gql } from 'graphql-request';
import {
  APIDatasetPolicyNote,
  DisplayLink,
  IAPIDeletedDatasetPolicyNote,
  DatasetPolicyNoteCreateModel,
  DatasetPolicyNoteEditModel
} from '../types';
import { BLNKUtils } from '../utils';
import APIClient from './apiClient';
import isNil from 'lodash/isNil';

const FIELDS = gql`
  fragment datasetPolicyNoteFields on DatasetPolicyNoteV2 {
    id: datasetPolicyNoteId
    datasetId: dataSubsetId
    canEdit
    createdAt
    policyNoteTypeId
    note
    contactPeople {
      id
      name
    }
    links {
      url
      label
      ... on BLink {
        terminalFunction
      }
    }
  }
`;

interface RawDatasetPolicyNote extends Omit<APIDatasetPolicyNote, 'createdAt' | 'links'> {
  createdAt: string;
  links: DisplayLink[] | null;
}

function mapResponse(rawValue: undefined | null): undefined;
function mapResponse(rawValue: RawDatasetPolicyNote): APIDatasetPolicyNote;
function mapResponse(rawValue: RawDatasetPolicyNote | undefined | null): APIDatasetPolicyNote | undefined {
  if (isNil(rawValue)) {
    return undefined;
  }

  return {
    ...rawValue,
    links: rawValue.links !== null ? rawValue.links : undefined,
    createdAt: new Date(rawValue.createdAt)
  };
}
export default class DatasetPolicyNoteService {
  constructor(private apiClient: APIClient) {}

  public async getByDatasetId(datasetId: number): Promise<APIDatasetPolicyNote[] | undefined> {
    const response: { datasetPolicyNotes: RawDatasetPolicyNote[] | null } = await this.apiClient.request(
      gql`
        query PolicyNotesById($datasetId: Int!) {
          datasetPolicyNotes(dataSubsetId: $datasetId) {
            ...datasetPolicyNoteFields
          }
        }

        ${FIELDS}
      `,
      { datasetId }
    );
    if (response.datasetPolicyNotes === null || response.datasetPolicyNotes.length <= 0) {
      return undefined;
    }
    return response.datasetPolicyNotes.map(mapResponse);
  }

  public create(model: DatasetPolicyNoteCreateModel): Promise<APIDatasetPolicyNote> {
    const input: CreateDatasetPolicyNoteInput = DatasetPolicyNoteService.convertCreateToInput(model);

    return this.apiClient
      .request<{ createDatasetPolicyNoteV2: RawDatasetPolicyNote }, { input: CreateDatasetPolicyNoteInput }>(
        gql`
          mutation CreateDatasetPolicyNote($input: CreateDatasetPolicyNoteInput!) {
            createDatasetPolicyNoteV2(input: $input) {
              ...datasetPolicyNoteFields
            }
          }
          ${FIELDS}
        `,
        { input }
      )
      .then(({ createDatasetPolicyNoteV2 }: { createDatasetPolicyNoteV2: RawDatasetPolicyNote }) =>
        mapResponse(createDatasetPolicyNoteV2)
      );
  }

  public patchById(datasetPolicyNoteId: number, model: DatasetPolicyNoteEditModel): Promise<APIDatasetPolicyNote> {
    const input: PatchDatasetPolicyNoteInput = DatasetPolicyNoteService.convertEditToInput(model);

    return this.apiClient
      .request<
        { patchDatasetPolicyNoteV2: RawDatasetPolicyNote },
        { datasetPolicyNoteId: number; input: PatchDatasetPolicyNoteInput }
      >(
        gql`
          mutation PatchDatasetPolicyNote($datasetPolicyNoteId: Int!, $input: PatchDatasetPolicyNoteInput!) {
            patchDatasetPolicyNoteV2(datasetPolicyNoteId: $datasetPolicyNoteId, input: $input) {
              ...datasetPolicyNoteFields
            }
          }
          ${FIELDS}
        `,
        { datasetPolicyNoteId, input }
      )
      .then(
        ({ patchDatasetPolicyNoteV2 }: { patchDatasetPolicyNoteV2: RawDatasetPolicyNote }): APIDatasetPolicyNote =>
          mapResponse(patchDatasetPolicyNoteV2)
      );
  }

  public deleteById(datasetPolicyNoteId: number): Promise<IAPIDeletedDatasetPolicyNote> {
    return this.apiClient
      .request<{ deleteDatasetPolicyNoteV2: IAPIDeletedDatasetPolicyNote }, { datasetPolicyNoteId: number }>(
        gql`
          mutation DeleteDatasetPolicyNote($datasetPolicyNoteId: Int!) {
            deleteDatasetPolicyNoteV2(datasetPolicyNoteId: $datasetPolicyNoteId) {
              id: datasetPolicyNoteId
              datasetId: dataSubsetId
            }
          }
        `,
        { datasetPolicyNoteId }
      )
      .then(
        ({
          deleteDatasetPolicyNoteV2
        }: {
          deleteDatasetPolicyNoteV2: IAPIDeletedDatasetPolicyNote;
        }): IAPIDeletedDatasetPolicyNote => {
          console.log({ deleteDatasetPolicyNoteV2 });
          return deleteDatasetPolicyNoteV2;
        }
      );
  }

  static convertCreateToInput(model: DatasetPolicyNoteCreateModel): CreateDatasetPolicyNoteInput {
    const input: CreateDatasetPolicyNoteInput = {
      dataSubsetId: model.datasetId,
      note: model.note.trim(),
      policyNoteTypeId: model.policyNoteTypeId,
      contactId: model.contactId
    };

    const link: string | undefined = BLNKUtils.parseLinkOrFunction(model.link);

    if (link !== undefined) {
      input.link = link;
    }

    return input;
  }

  static convertEditToInput(model: DatasetPolicyNoteEditModel): PatchDatasetPolicyNoteInput {
    const input: PatchDatasetPolicyNoteInput = {};

    for (const field of ['note', 'policyNoteTypeId', 'contactId']) {
      if (!isNil(model[field])) {
        input[field] = model[field];
      }
    }

    if ('link' in model) {
      const link: string | undefined = BLNKUtils.parseLinkOrFunction(model.link);
      input.link = link !== undefined ? link : null;
    }

    return input;
  }
}

interface CreateDatasetPolicyNoteInput {
  dataSubsetId: number;
  link?: string;
  contactId: number;
  note: string;
  policyNoteTypeId: number;
};

interface PatchDatasetPolicyNoteInput {
  link?: string | null;
  contactId?: number;
  note?: string;
  policyNoteTypeId?: number;
};
