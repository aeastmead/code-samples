import APIClient from './apiClient';
import { gql } from 'graphql-request';
import {
  APIClassificationQuestionnaire,
  ClassificationAnswerEditForm,
  ClassificationAnswer,
  ClassificationAnswerPendingUseCase
} from '../types';
import DatasetService, { DatasetBriFields } from './datasetService';

export default class ClassificationQuestionnaireService {
  constructor(private apiClient: APIClient) {}

  public async getAll(): Promise<
    [APIClassificationQuestionnaire.Category[], APIClassificationQuestionnaire.PersonalDataType[]]
  > {
    const results: {
      categories: APIClassificationQuestionnaire.Category[];
      personalDataTypes: APIClassificationQuestionnaire.PersonalDataType[];
    } = await this.apiClient
      .request<{
        result: {
          categories: APIClassificationQuestionnaire.Category[];
          personalDataTypes: APIClassificationQuestionnaire.PersonalDataType[];
        };
      }>(
        gql`
          query {
            result: datasetClassificationQuestionnaire {
              categories: categoryList {
                ...dataClassificationCategoryFields
                useCases: useCaseList {
                  ...dataClassificationUseCaseFields
                }
              }
              personalDataTypes: personalDataTypeList {
                ...dataClassificationPersonalDataTypeFields
              }
            }
          }
          ${ClassificationQuestionnaireService.USE_CASE}
          ${ClassificationQuestionnaireService.CATEGORY}
          ${ClassificationQuestionnaireService.PERSONAL_DATA_TYPE}
        `
      )
      .then(
        ({
          result
        }: {
          result: {
            categories: APIClassificationQuestionnaire.Category[];
            personalDataTypes: APIClassificationQuestionnaire.PersonalDataType[];
          };
        }) => result
      );

    return [results.categories, results.personalDataTypes];
  }

  public async getSelectionsById(datasetId: number): Promise<ClassificationAnswer | undefined> {
    const res: SelectionResult | null = await this.apiClient
      .request<{ result: SelectionResult | null }, { datasetId: number }>(
        gql`
          query GetClassificationSelections($datasetId: Int!) {
            result: dataSubsetById(dataSubsetId: $datasetId) {
              datasetClassification {
                ...datasetClassificationFields
              }

              briValues: externalPrivilegeId {
                ...datasetBriFields
              }
            }
          }

          ${ClassificationQuestionnaireService.DATASET_CLASSIFICATION}
          ${DatasetService.BRI_FIELDS}
        `,
        { datasetId }
      )
      .then(({ result }: { result: SelectionResult | null }) => result);
    if (res === null || res.briValues === null) return undefined;
    const { datasetClassification, briValues } = res;
    const result: ClassificationAnswer = {
      id: datasetId,
      bri: `bri:pvfx:object:${briValues.externalPrivilegeObject}:value:${briValues.externalPrivilegeValue}`,
      personalDataTypeIds: undefined,
      useCaseIds: undefined
    };

    for (const key in datasetClassification) {
      if (datasetClassification[key] !== null) {
        result[key] = datasetClassification[key];
      }
    }

    return result;
  }

  public async update(
    datasetId: number,
    model: ClassificationAnswerEditForm,
    bri: string
  ): Promise<ClassificationAnswer | undefined> {
    const input: GQLUpdateDCInput = {
      bri,
      useCaseIdList: model.useCaseIds || [],
      personalDataTypeIdList: model.personalDataTypeIds
    };

    if (model.pendingUseCases !== undefined && model.pendingUseCases.length > 0) {
      input.pendingUseCaseList = model.pendingUseCases;
    }
    await this.apiClient.request<unknown, { input: GQLUpdateDCInput }>(
      gql`
        mutation UpdateClassification($input: UpdateDatasetDataClassificationInput!) {
          updateDatasetDataClassification(input: $input)
        }
      `,
      { input }
    );

    return this.getSelectionsById(datasetId);
  }

  static readonly USE_CASE = gql`
    fragment dataClassificationUseCaseFields on DataClassificationUseCase {
      id: useCaseId
      name: useCaseName
    }
  `;

  static readonly CATEGORY = gql`
    fragment dataClassificationCategoryFields on DataClassificationCategory {
      id: categoryId
      name: categoryName
    }
  `;
  static readonly PERSONAL_DATA_TYPE = gql`
    fragment dataClassificationPersonalDataTypeFields on DataClassificationPersonalDataType {
      id: personalDataTypeId
      name: personalDataTypeName
    }
  `;

  static readonly DATASET_CLASSIFICATION = gql`
    fragment datasetClassificationFields on DatasetClassification {
      personalDataTypeIds
      useCaseIds
    }
  `;
}

interface SelectionResult  {
  datasetClassification: ClassificationSelection | null;
  briValues: DatasetBriFields | null;
};

interface ClassificationSelection {
  useCaseIds: number[] | null;
  personalDataTypeIds: number[] | null;
};

interface GQLUpdateDCInput {
  bri: string;
  pendingUseCaseList?: ClassificationAnswerPendingUseCase[];
  personalDataTypeIdList?: number[];
  useCaseIdList: number[];
};
