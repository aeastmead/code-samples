import React from 'react';
import cn from 'classnames';
import type { DefaultTheme, StyledComponent } from 'styled-components';
import styled from 'styled-components';
import ProductLayout, { IProductLayoutProps } from '../ProductLayout';
import { DropdownField, Form, FormButtons, FormSection, InputField, TextAreaField, UUIDFieldArray } from '../Form';
import { convertFormToRequest, CreateDatasetFormModel, createDatasetValidationSchema } from './utils';
import { useDispatch, useSelector } from 'react-redux';
import { createFormsSelectors, datasetCreateFormActions, lookupsSelectors } from '../../store';
import { OptionValue } from '@nlss/brain-trust';
import { CreateDatasetRequest } from '../../types';
import { useHistory } from 'react-router-dom';
import type H from 'history';
import ToggledFieldGroup from './ToggledFieldGroup';
import TruncatedNameWarning from './TruncatedNameWarning';

const Container: StyledComponent<typeof ProductLayout, DefaultTheme> = styled(ProductLayout)`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: visible;
  overflow-x: hidden;
  .nlss-product-layout {
    &__main {
      flex-grow: 1;
      padding: ${({ theme }: { theme: DefaultTheme }) => theme.spacingSizes.large}
        ${({ theme }: { theme: DefaultTheme }) => theme.spacingSizes.xlarge};
    }

    &__title-bar {
      flex: 0 0 auto;
    }
  }

  .nlss-createDatasetForm {
    width: 100%;
    max-width: 1000px;
    margin: 0 auto;

    &-sect:not(:first-child) {
      margin-top: ${({ theme }: { theme: DefaultTheme }) => theme.spacingSizes.xlarge};
    }
  }

  .nlss-cdf-tech {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 4px 1fr;
    grid-template-rows: max-content 80px max-content;
    grid-gap: ${({ theme }: { theme: DefaultTheme }) => theme.spacingSizes.medium}
      ${({ theme }: { theme: DefaultTheme }) => theme.spacingSizes.large};

    &__header {
      grid-row: 1/2;
      margin: unset;
      padding: ${({ theme }: { theme: DefaultTheme }) => theme.spacingSizes.large} 0;
      font-size: ${({ theme }: { theme: DefaultTheme }) => theme.fontSizes.medium};
      font-weight: ${({ theme }: { theme: DefaultTheme }) => theme.fontWeights.medium};
      text-align: center;

      &--eng {
        grid-column: 1/2;
      }

      &--data {
        grid-column: 3/4;
      }
    }

    &__drqs {
      grid-row: 2/3;
      grid-column: 1/2;
    }

    &__owner {
      grid-row: 3/4;

      &--eng {
        grid-column: 1/2;
      }

      &--data {
        grid-column: 3/4;
      }
    }

    &__divider {
      grid-column: 2/3;
      grid-row: 1/4;
      background: black;
    }
  }

  .nlss-cdf-single-col-sect {
    display: flex;
    justify-content: center;
    align-items: flex-start;

    &__fields {
      flex-basis: 600px;

      @media (max-width: 1200px) {
        flex-basis: 100%;
      }
    }
  }

  .nlss-cdf__btnBar {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: ${({ theme }: { theme: DefaultTheme }) => theme.spacingSizes.large};
  }
  .bbui-formfield {
    & > div:last-child:not(.bbui-formfield-content) {
      min-height: unset;
    }
  }
`;

function CreateDatasetForm({ className, ...rest }: CreateDatasetForm.Props): React.ReactElement | null {
  const datasetCategories: OptionValue<number>[] | undefined = useSelector(lookupsSelectors.getDatasetCategoryOptions);

  const saveProps: createFormsSelectors.CreateSaveFormProps = useSelector(createFormsSelectors.getDatasetSaveProps);

  const dispatch = useDispatch();

  const history: H.History = useHistory();
  const handleSubmit: (formValues: CreateDatasetFormModel) => void=React.useCallback((formValues: CreateDatasetFormModel)=>{
    const request: CreateDatasetRequest = convertFormToRequest(formValues);
    dispatch(datasetCreateFormActions.saveAsync(request));
  }, [dispatch])


  const handleComplete: () => void=React.useCallback(()=>    history.replace(`/dataset/${saveProps.entityId}`),[saveProps.entityId])

  if (datasetCategories === undefined || datasetCategories.length <= 0) {
    return null;
  }




  return (
    <Container {...rest} className={cn('nlss-createDatasetForm-layout', className)}>
      <Form
        className="nlss-createDatasetForm"
        saved={saveProps.saved}
        onSubmit={handleSubmit}
        onComplete={handleComplete}
        hasRootError={saveProps.hasRootError}
        rootError={saveProps.rootError}
        validationSchema={createDatasetValidationSchema}
        headerElement={<TruncatedNameWarning />}
        formTitle="Create Dataset"
        initialValues={
          {
            name: '',
            categoryId: '',
            description: '',
            newPVFX: true,
            privileging: { approverIds: ['', ''] as any },
            newPWho: true,
            technicalContacts: {
              engineeringOwnerGroupId: '',
              engineeringOwnerIds: ['', ''],
              dataOwnerIds: ['', '']
            }
          } as any
        }>
        <FormSection className="nlss-createDatasetForm__info nlss-createDatasetForm-sect nlss-createDatasetForm-info">
          <DropdownField
            className="nlss-grid--4"
            placeholder="Select Category"
            name="datasetCategoryId"
            label="Category"
            options={datasetCategories}
          />
          <InputField
            className="nlss-grid--8"
            name="name"
            label="Name (Spaces are fine. e.g. Raw DRQS Tickets)"
            placeholder="Spaces are fine. e.g. Raw DRQS Tickets"
          />
          <TextAreaField
            className="nlss-grid--12 nlss-createDataset__description"
            name="description"
            label="Description"
          />
        </FormSection>
        <ToggledFieldGroup
          name="newPVFX"
          className="nlss-createDatasetForm-sect"
          sectionTitle="Data Privileging (PVFX) "
          trueButtonLabel="Create a new PVFX"
          trueRenderer={
            <div className="nlss-cdf__approvers nlss-cdf-single-col-sect">
              <UUIDFieldArray
                className="nlss-cdf-single-col-sect__fields"
                label="PVFX Approvers"
                name="privileging.approverIds"
                minimum={2}
              />
            </div>
          }
          falseButtonLabel="Use my existing PVFX"
          falseRenderer={
            <div className="nlss-grid--12 nlss-grid">
              <InputField
                className="nlss-grid--2"
                name="privileging.pvfFunction"
                label="PVF Function"
                placeholder="PVF Function e.g. NLSS"
                type="text"
                value={''}
              />
              <InputField
                className="nlss-grid--2"
                name="privileging.pvfLevel"
                label="PVF Level"
                placeholder="PVF Level"
                type="number"
                value={'' as any}
              />
              <InputField
                className="nlss-grid--4"
                name="privileging.pvfxObjectName"
                label="PVFX Object Name"
                type="text"
                value={''}
              />
              <InputField
                className="nlss-grid--4"
                name="privileging.pvfxValueName"
                label="PVFX Value Name"
                type="text"
                value={''}
              />
            </div>
          }
        />

        <ToggledFieldGroup
          name="newPWho"
          sectionTitle="Technical Ownership (PWho) "
          trueButtonLabel="Create a new PWho"
          className="nlss-createDatasetForm-sect"
          trueRenderer={
            <div className="nlss-cdf-tech">
              <h5 className="nlss-cdf-tech__header nlss-cdf-tech__header--eng">Engineering Contacts</h5>
              <InputField
                className="nlss-cdf-tech__drqs"
                name="technicalContacts.engineeringOwnerGroupId"
                label="DRQS Group"
                type="number"
              />
              <UUIDFieldArray
                className="nlss-cdf-tech__owner nlss-cdf-tech__owner--eng"
                label="Engineering Owners (Primary and Backup)"
                name="technicalContacts.engineeringOwnerIds"
                minimum={2}
                fixedCount
              />
              <div className="nlss-cdf-tech__divider" />
              <h5 className="nlss-cdf-tech__header nlss-cdf-tech__header--data">Data Contacts</h5>
              <UUIDFieldArray
                className="nlss-cdf-tech__owner nlss-cdf-tech__owner--data"
                label="Data Owners (Primary and Backup)"
                name="technicalContacts.dataOwnerIds"
                minimum={2}
                fixedCount
              />
            </div>
          }
          falseButtonLabel="Use an existing PWho"
          falseRenderer={
            <div className="nlss-cdf-single-col-sect">
              <InputField
                className="nlss-cdf-single-col-sect__fields"
                name="technicalContacts.pwhoId"
                label="My PWho Id"
                type="number"
                value={''}
              />
            </div>
          }
        />

        <FormButtons className="nlss-cdf__btnBar" onCancel={() =>     history.push('../')} />
      </Form>
    </Container>
  );
}

namespace CreateDatasetForm {
  export interface Props extends Omit<IProductLayoutProps, 'resource'> {}
}

export default CreateDatasetForm;
