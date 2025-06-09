import { EntityLeafNode, EntityNode, Entity } from './common';

/**
 * id is the datasetId
 */
export interface ClassificationAnswer extends Entity {
  bri: string;
  useCaseIds: number[] | undefined;
  personalDataTypeIds: number[] | undefined;
}

export interface ClassificationAnswerPendingUseCase {
  categoryId: number;
  useCaseText: string;
}

export interface ClassificationAnswerEditForm {
  pendingUseCases?: ClassificationAnswerPendingUseCase[];
  useCaseIds?: number[];
  personalDataTypeIds: number[];
}

export interface ClassificationAnsweredCategory extends EntityNode<EntityLeafNode> {}
