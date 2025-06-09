import APIClient from './apiClient';
import DatasetPolicyNoteService from './datasetPolicyNoteService';
import DatasetService from './datasetService';
import LookupService from './lookupService';
import PersonService from './personService';
import ResourceFieldService from './resourceFieldService';
import ResourceService from './resourceService';
import ClassificationQuestionnaireService from './classificationQuestionnaireService';


/**
 * Create dependency injections for Redux middleware
 */
export default function createContainer(): DependenciesContainer {
  const apiClient: APIClient = new APIClient();
  const resourceFieldService: ResourceFieldService = new ResourceFieldService(apiClient);
  return {
    datasetService: new DatasetService(apiClient),
    datasetPolicyNoteService: new DatasetPolicyNoteService(apiClient),
    resourceService: new ResourceService(apiClient, resourceFieldService),
    personService: new PersonService(apiClient),
    resourceFieldService,
    lookupService: new LookupService(apiClient),
    classificationQuestionnaireService: new ClassificationQuestionnaireService(apiClient)
  };
}

export interface DependenciesContainer {
  datasetService: DatasetService;
  datasetPolicyNoteService: DatasetPolicyNoteService;
  resourceService: ResourceService;
  personService: PersonService;
  resourceFieldService: ResourceFieldService;
  lookupService: LookupService;
  classificationQuestionnaireService: ClassificationQuestionnaireService;
};
