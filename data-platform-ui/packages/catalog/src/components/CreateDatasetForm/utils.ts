import * as yup from 'yup';
import uniq from 'lodash/uniq';
import type { CreateDatasetRequest, PVFXCoordinates, TechnicalOwnerIds } from '../../types';
import isNil from 'lodash/isNil';

export declare type CreateDatasetFormModel = {
  name: string;
  description: string;
  datasetCategoryId: number;
} & CreateDatasetFormModel.Privileging &
  CreateDatasetFormModel.TechnicalContacts;

export namespace CreateDatasetFormModel {
  /**
   * New PVFX fields
   */
  export interface NewPVFX {
    newPVFX: true;
    privileging: { approverIds: number[] };
  }

  /**
   * Union for PVFX fields
   */
  export type Privileging =
    | NewPVFX
    | {
        newPVFX: false;
        privileging: PVFXCoordinates;
      };

  export interface NewPWho {
    newPWho: true;
    technicalContacts: TechnicalOwnerIds;
  }
  export type TechnicalContacts =
    | NewPWho
    | {
        newPWho: false;
        technicalContacts: { pwhoId: number };
      };

  export function isNewPVFX(value: Privileging): value is NewPVFX {
    return value.newPVFX === true;
  }

  export function isNewPWho(values: TechnicalContacts): values is NewPWho {
    return values.newPWho === true;
  }
}

/**
 * Flattening form values to match  API request
 * @param formValues
 */
export function convertFormToRequest(formValues: CreateDatasetFormModel): CreateDatasetRequest {
  const request: CreateDatasetRequest = {
    name: formValues.name.trim(),
    description: formValues.description.trim(),
    datasetCategoryId: 1,
    approverIds: undefined,
    pvfFunction: undefined,
    pvfLevel: undefined,
    pvfxObjectName: undefined,
    pvfxValueName: undefined,
    engineeringOwnerGroupId: undefined,
    engineeringOwnerIds: undefined,
    dataOwnerIds: undefined,
    pwhoId: undefined
  };

  if (CreateDatasetFormModel.isNewPVFX(formValues)) {
    request.approverIds = formValues.privileging.approverIds;
  } else {
    const pvfxCoords: PVFXCoordinates = formValues.privileging;
    request.pvfFunction = pvfxCoords.pvfFunction.toUpperCase();
    request.pvfLevel = +pvfxCoords.pvfLevel;
    request.pvfxObjectName = pvfxCoords.pvfxObjectName.trim().toUpperCase();
    request.pvfxValueName = pvfxCoords.pvfxValueName.trim().toUpperCase();
  }

  if (CreateDatasetFormModel.isNewPWho(formValues)) {
    const contacts: TechnicalOwnerIds = formValues.technicalContacts;

    request.engineeringOwnerGroupId = +contacts.engineeringOwnerGroupId;
    request.engineeringOwnerIds = [...formValues.technicalContacts.engineeringOwnerIds];
    request.dataOwnerIds = [...formValues.technicalContacts.dataOwnerIds];
  } else {
    request.pwhoId = +formValues.technicalContacts.pwhoId;
  }

  return request;
}

function uuidSchema() {
  return yup
    .number()
    .required('UUID is required')
    .integer('Not a valid number for UUID')
    .min(9, 'Not a valid for UUID');
}

function isUniqueTest<T = any>(values: T[] | undefined | null): boolean {
  return isNil(values) || values.length <= 1 || uniq(values).length === values.length;
}

/**
 *
 */

export const createDatasetValidationSchema = yup.object({
  name: yup.string().required('Name is required').min(5, 'Name must be at least 5 characters').max(150),
  datasetCategoryId: yup.number().required('Category is required').min(1),
  description: yup.string().required('Description is required').min(5, 'Description must be at least 5 characters'),
  newPVFX: yup.boolean().required(),
  privileging: yup
    .object()
    .when('newPVFX', {
      is: true,
      then: yup.object({
        approverIds: yup
          .array(uuidSchema())
          .required('PVFX Approvers are required')
          .min(2, 'At least 2 Approvers are required')
          .test({
            name: 'approverIdsUnique',
            message: 'PVFX Approvers are not unique',
            test: isUniqueTest
          })
      }),
      otherwise: yup.object({
        pvfFunction: yup
          .string()
          .required()
          .min(2)
          .matches(/^[a-z]{2,}$/i),
        pvfLevel: yup.number().required().integer().min(1),
        pvfxObjectName: yup.string().required().min(3),
        pvfxValueName: yup.string().required().min(3)
      })
    })
    .required()
    .strip(true),
  technicalContacts: yup
    .object()
    .when('newPWho', {
      is: true,
      then: yup.object({
        engineeringOwnerGroupId: yup
          .number()
          .required('DRQS group is required')
          .integer('Not a validate DRQS group')
          .min(9, 'Not a validate DRQS group'),
        engineeringOwnerIds: yup.array(uuidSchema()).required().min(2).test({
          name: 'engineeringOwnerIdsUnique',
          message: 'Engineering Owners are not unique',
          test: isUniqueTest
        }),
        dataOwnerIds: yup.array(uuidSchema()).required().min(2).test({
          name: 'dataOwnerIdsUnique',
          message: 'Data Owners are not unique',
          test: isUniqueTest
        })
      }),
      otherwise: yup.object({
        pwhoId: yup.number().required().integer().min(10)
      })
    })
    .required()
});
