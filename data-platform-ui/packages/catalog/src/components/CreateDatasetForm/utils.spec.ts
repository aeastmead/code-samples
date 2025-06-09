import { ValidationError } from 'yup';
import { CreateDatasetFormModel, createDatasetValidationSchema } from './utils';

describe('CreateDatasetForm Utils', () => {
  describe('createDatasetValidationSchema', () => {
    it.each<[label: string, values: CreateDatasetFormModel]>([
      [
        'creating new PVFX and new PWho',
        {
          name: 'Dataset Name',
          datasetCategoryId: 2,
          description: 'Any description value',
          newPVFX: true,
          privileging: {
            approverIds: [2333, 40585]
          },
          newPWho: true,
          technicalContacts: {
            engineeringOwnerGroupId: 1234,
            engineeringOwnerIds: [48563, 8374],
            dataOwnerIds: [84763, 2079]
          }
        }
      ],
      [
        'external PVFX and PWho values are set',
        {
          name: 'Dataset Name',
          datasetCategoryId: 2,
          description: 'Any description value',
          newPVFX: false,
          privileging: {
            pvfFunction: 'NLSS',
            pvfLevel: 2,
            pvfxObjectName: 'NLSS-Datasets',
            pvfxValueName: 'DRQS_TICKETS'
          },
          newPWho: false,
          technicalContacts: {
            pwhoId: 30484
          }
        }
      ]
    ])('should validate when %s', async (_: string, values: CreateDatasetFormModel) => {
      await expect(createDatasetValidationSchema.validate(values)).resolves.toEqual(values);
    });

    it('should require at least 2 pvfx approverIds', async () => {
      const values: CreateDatasetFormModel = {
        name: 'Dataset Name',
        datasetCategoryId: 2,
        description: 'Any description value',
        newPVFX: true,
        privileging: {
          approverIds: [3456]
        },
        newPWho: false,
        technicalContacts: {
          pwhoId: 2039
        } as any
      };
      const result = await createDatasetValidationSchema
        .validate(values, { abortEarly: false })
        .catch((err: ValidationError) => err);

      expect(result).toBeInstanceOf(ValidationError);

      if (result instanceof ValidationError) {
        expect(result.errors).toBeArrayOfSize(1);

        expect(result.errors[0]).toMatch(/approver/i);
      }
    });
  });
});
