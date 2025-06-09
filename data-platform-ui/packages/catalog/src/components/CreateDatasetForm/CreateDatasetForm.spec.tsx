import React from 'react';
import userEvents from '@testing-library/user-event';
import { waitFor } from '@testing-library/react';
import { byLabelText, byName, byRole, byText, render } from '../../testUtils';
import CreateDatasetForm from './CreateDatasetForm';
import { lookupsSelectors } from '../../store';

describe('CreateDatasetForm', () => {
  const selectors = {
    category: byRole<HTMLInputElement>('combobox', {}, { timeout: 20000 }),
    name: byRole('textbox', { name: /name/i }),
    description: byName<HTMLTextAreaElement>('description'),
    newPVFXBtn: byText(/new.*pvfx/i),
    existingPVFXBtn: byText(/existing.*pvfx/i),
    approverIds: byName(/approverIds/i),
    pvfFunction: byLabelText('PVF Function'),
    pvfLevel: byLabelText('PVF Level'),
    pvfxObjectName: byLabelText(/pvfx\sobject/i),

    pvfxValueName: byLabelText(/pvfx\svalue/i),
    newPWhoBtn: byText(/new.*pwho/i),
    existingPWhoBtn: byText(/existing.*pwho/i),
    drqsGroup: byName<HTMLInputElement>('technicalContacts.engineeringOwnerGroupId'),
    primaryEngineer: byName('technicalContacts.engineeringOwnerIds.0'),
    backupEngineer: byName('technicalContacts.engineeringOwnerIds.1'),

    primaryData: byName('technicalContacts.dataOwnerIds.0'),
    backupData: byName('technicalContacts.dataOwnerIds.0'),
    pwhoValue: byLabelText(/pwho/i, { selector: 'input' }),
    saveBtn: byText<HTMLButtonElement>(/save/i)
  };

  let getCategoryOptionsSpy: jest.SpyInstance;

  beforeAll(() => {
    getCategoryOptionsSpy = jest.spyOn(lookupsSelectors, 'getDatasetCategoryOptions');
  });

  beforeEach(() => {
    jest.resetAllMocks();
    getCategoryOptionsSpy.mockReturnValue(datasetCategories);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should render with default fields', async () => {
    render(<CreateDatasetForm />);
    const saveBtnElem: HTMLButtonElement = await selectors.saveBtn.find();

    expect(saveBtnElem).toBeDisabled();

    expect(selectors.name.query()).toBeInTheDocument();
    expect(selectors.description.query()).toBeInTheDocument();
    expect(selectors.existingPVFXBtn.query()).toBeInTheDocument();
    expect(selectors.approverIds.queryAll()).toBeArrayOfSize(2);
    expect(selectors.drqsGroup.query()).toBeInTheDocument();
    expect(selectors.primaryEngineer.query()).toBeInTheDocument();
    expect(selectors.backupEngineer.query()).toBeInTheDocument();
  });

  /**
   * Test takes too long in ci
   */
  it.skip('should require name, description and name', async () => {
    jest.setTimeout(10000);
    render(<CreateDatasetForm />);
    await selectors.saveBtn.find();

    const nameEl: HTMLElement = selectors.name.get();
    expect(nameEl).not.toBeInvalid();
    userEvents.type(nameEl, 't{backspace}');

    await waitFor(
      () => {
        expect(nameEl).toHaveFocus();
      },
      { timeout: 500 }
    );

    const descriptionEl: HTMLElement = selectors.description.get();
    userEvents.click(descriptionEl);
    await waitFor(
      () => {
        expect(nameEl).toBeInvalid();
      },
      { timeout: 500 }
    );

    userEvents.type(nameEl, 'Dataset Name');

    await waitFor(
      () => {
        expect(nameEl).toHaveFocus();
        expect(nameEl).not.toBeInvalid();
        expect(descriptionEl).toHaveAttribute('validation', 'error');
      },
      { timeout: 500 }
    );

    userEvents.type(descriptionEl, 'Checking validations on top fields');

    await waitFor(
      () => {
        expect(descriptionEl).toHaveFocus();
        expect(descriptionEl).not.toHaveAttribute('validation', 'error');
      },
      { timeout: 500 }
    );
  });
});

const TARGET_CATEGORY = {
  label: 'BIO',
  value: 1
};

const datasetCategories = [
  {
    label: 'Enterprise Products',
    value: 32
  },
  TARGET_CATEGORY,
  {
    label: 'Bloomberg Intelligence',
    value: 2
  },
  {
    label: 'Customer',
    value: 3
  },
  {
    label: 'CRCO',
    value: 4
  }
];
