import { combineReducers } from 'redux';
import resource from './resource';
import datasets from './datasets';
import resources from './resources';
import { RootState } from './types';
import people from './people';
import editForms from './editForms';
import lookups from './lookups';
import createForms from './createForms';
import resourceFields from './resourceFields';
import datasetPolicyNotes from './datasetPolicyNotes';
import classificationQuestionnaire from './classificationQuestionnaire';
import classificationAnswers from './classificationAnswers';

export default combineReducers<RootState, any>({
  datasets,
  resources,
  resource,
  people,
  editForms,
  lookups,
  createForms,
  resourceFields,
  datasetPolicyNotes,
  classificationQuestionnaire,
  classificationAnswers
});
