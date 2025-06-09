/* eslint-disable @typescript-eslint/no-namespace */
import { EntityKind } from '../shared';
import { EditFormFieldName } from './types';
import { IAPITagEditModel } from '../../types';

export default abstract class EditFormsUtils {
  public static editFormStateId<Kind extends EntityKind>({
    kind,
    fieldName,
    id
  }: IEditFormsStateIdOptions<Kind>): string {
    const values: string[] = [kind, fieldName];

    if (id !== undefined) {
      values.push(id.toString());
    }
    return values.join(':');
  }

  public static buildTagFields(nextTagIds: number[] | undefined, prevTagIds: number[] | undefined): IAPITagEditModel {
    if (nextTagIds === undefined) {
      return {
        removeTagIds: prevTagIds
      };
    } else if (prevTagIds === undefined) {
      return {
        addTagIds: nextTagIds
      };
    }

    const addTagIds: number[] = [...nextTagIds];

    const removeTagIds: number[] = [];

    for (const pastTagId of prevTagIds) {
      const index: number = addTagIds.indexOf(pastTagId);

      if (index >= 0) {
        addTagIds.splice(index, 1);
      } else {
        removeTagIds.push(pastTagId);
      }
    }

    const result: IAPITagEditModel = {};

    if (addTagIds.length > 0) {
      result.addTagIds = addTagIds;
    }

    if (removeTagIds.length > 0) {
      result.removeTagIds = removeTagIds;
    }
    return result;
  }
}

export interface IEditFormsStateIdOptions<Kind extends EntityKind> {
  id?: number;
  kind: Kind;
  fieldName: EditFormFieldName<Kind>;
}
