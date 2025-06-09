import { Entity } from './common';

export interface ClassificationQuestionnaireUseCase extends Entity {
  name: string;
  categoryId: number;
}

export interface ClassificationQuestionnaireCategory extends Entity {
  name: string;
  useCaseIds: number[];
}

export interface ClassificationQuestionnairePersonalDataType extends Entity {
  name: string;
}

export namespace APIClassificationQuestionnaire {
  export interface UseCase {
    id: number;
    name: string;
  }

  export interface Category {
    id: number;
    name: string;
    useCases: UseCase[];
  }

  export interface PersonalDataType {
    id: number;
    name: string;
  }
}
