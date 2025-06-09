import cloneDeep from 'lodash/cloneDeep';
import { IResourceFieldsState, ResourceFieldsActionUnion, ResourceFieldsActionType } from './types';

const initialState: IResourceFieldsState = {
  entities: {}
};

export default function reducer(
  state: IResourceFieldsState = initialState,
  action: ResourceFieldsActionUnion
): IResourceFieldsState {
  switch (action.type) {
    case ResourceFieldsActionType.RESET: {
      return {
        entities: {}
      };
    }
    case ResourceFieldsActionType.ADD: {
      if (action.payload.length <= 0) {
        return state;
      }

      const newEntities: IResourceFieldsState['entities'] = cloneDeep(state.entities);

      for (const field of action.payload) {
        newEntities[field.id] = { ...field };
      }

      return {
        entities: newEntities
      };
    }
    default: {
      return state;
    }
  }
}
