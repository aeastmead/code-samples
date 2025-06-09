import { CreateFormsActionUnion, CreateFormsState } from './createForms';
import { DatasetsActionUnion, IDatasetsState } from './datasets';
import { ILookupsState, LookupsActionUnion } from './lookups';
import { IPeopleState, PeopleActionUnion } from './people';
import { IResourcesState, ResourcesActionUnion } from './resources';
import { IResourceState, ResourceActionUnion } from './resource';
import { EditFormsActionUnion, IEditFormsState } from './editForms';
import { IResourceFieldsState, ResourceFieldsActionUnion } from './resourceFields';
import { DatasetPolicyNotesActionUnion, DatasetPolicyNotesState } from './datasetPolicyNotes';
import type {
  ClassificationQuestionnaireActionUnion,
  ClassificationQuestionnaireState
} from './classificationQuestionnaire';
import { ClassificationAnswersActionUnion, ClassificationAnswersState } from './classificationAnswers';

export type DefaultActionUnion =
  | DatasetsActionUnion
  | ResourcesActionUnion
  | PeopleActionUnion
  | ResourceActionUnion
  | EditFormsActionUnion
  | LookupsActionUnion
  | CreateFormsActionUnion
  | ResourceFieldsActionUnion
  | DatasetPolicyNotesActionUnion
  | ClassificationQuestionnaireActionUnion
  | ClassificationAnswersActionUnion;

export type RootState = {
  datasets: IDatasetsState;
  resources: IResourcesState;
  resource: IResourceState;
  people: IPeopleState;
  editForms: IEditFormsState;
  lookups: ILookupsState;
  createForms: CreateFormsState;
  resourceFields: IResourceFieldsState;
  datasetPolicyNotes: DatasetPolicyNotesState;
  classificationQuestionnaire: ClassificationQuestionnaireState;
  classificationAnswers: ClassificationAnswersState;
};
