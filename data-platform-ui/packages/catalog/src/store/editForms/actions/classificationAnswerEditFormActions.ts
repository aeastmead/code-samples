import AbstractEditFormsActions, { IEditFormsSaveContext } from './abstractEditFormsActions';
import { EntityKind } from '../../shared';
import { ClassificationAnswer, ClassificationAnswerEditForm, IError } from '../../../types';
import { AnyAction } from 'redux';
import { classificationAnswersActions, classificationAnswersSelectors } from '../../classificationAnswers';
import ErrorsUtil from '../../../utils/errors';
import { DefaultThunkAction } from 'redux-thunk';
import { EditFormFieldName, EditFormsAction } from '../types';

class DCEditActions extends AbstractEditFormsActions<EntityKind.CLASSIFICATION_ANSWER> {
  constructor() {
    super(EntityKind.CLASSIFICATION_ANSWER);
  }

  async doSave({
    entityId,
    saveData,
    getState,
    dependencies: { classificationQuestionnaireService }
  }: IEditFormsSaveContext<ClassificationAnswerEditForm>): Promise<AnyAction[] | undefined> {
    const bri: string | undefined = classificationAnswersSelectors._selectBriForId(getState(), entityId);

    if (bri === undefined) {
      const error: IError = ErrorsUtil.apiSaveError({
        message: `Data Classification id for ${entityId} is not loaded`
      });
      throw error;
    }

    const updatedDC: ClassificationAnswer | undefined = await classificationQuestionnaireService.update(
      entityId,
      saveData,
      bri
    );
    return updatedDC != undefined ? [classificationAnswersActions.update(updatedDC)] : undefined;
  }
}
const editActions = new DCEditActions();

const FIELD_NAME: EditFormFieldName<EntityKind.CLASSIFICATION_ANSWER> = 'all';
function saveAsync(entityId: number, editForm: ClassificationAnswerEditForm): DefaultThunkAction<Promise<boolean>> {
  return editActions.saveAsync(FIELD_NAME, entityId, editForm);
}

function reset(entityId: number): EditFormsAction.IResetAction {
  return editActions.reset(FIELD_NAME, entityId);
}

export default {
  saveAsync,
  reset,
  FIELD_NAME
};
