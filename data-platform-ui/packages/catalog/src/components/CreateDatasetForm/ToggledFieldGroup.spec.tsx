import React from 'react';
import userEvent from '@testing-library/user-event';
import { byText, render, screen, waitFor } from '../../testUtils';
import { Formik } from 'formik';
import ToggledFieldGroup from './ToggledFieldGroup';

describe('ToggledFieldGroup', () => {
  const trueButtonLabel = 'Internal';

  const falseButtonLabel = 'External';

  const truePanelText = 'Something is true';

  const falsePanelText = 'Nope very false';

  const selectors = {
    trueBtn: byText(trueButtonLabel),
    falseBtn: byText(falseButtonLabel),
    trueRenderer: byText(truePanelText),
    falseRenderer: byText(falsePanelText)
  };

  it('should show display true panel', () => {
    render(
      <Formik initialValues={{ newPVFX: true } as any} onSubmit={() => {}}>
        <ToggledFieldGroup
          name="newPVFX"
          sectionTitle="Test Simple Panels"
          trueButtonLabel={trueButtonLabel}
          falseButtonLabel={falseButtonLabel}
          falseRenderer={<>{falsePanelText}</>}
          trueRenderer={<>{truePanelText}</>}
        />
      </Formik>
    );

    expect(selectors.trueRenderer.query()).toBeInTheDocument();
    expect(selectors.falseRenderer.query()).not.toBeInTheDocument();

    expect(screen.getByRole('option', { selected: true })).toHaveTextContent(trueButtonLabel);
  });

  it('should change visible panel on toggle', async () => {
    render(
      <Formik initialValues={{ newPVFX: true } as any} onSubmit={() => {}}>
        <ToggledFieldGroup
          name="newPVFX"
          sectionTitle="Test Simple Panels"
          trueButtonLabel={trueButtonLabel}
          falseButtonLabel={falseButtonLabel}
          falseRenderer={<>{falsePanelText}</>}
          trueRenderer={<>{truePanelText}</>}
        />
      </Formik>
    );
    expect(selectors.trueRenderer.query()).toBeInTheDocument();
    expect(selectors.falseRenderer.query()).not.toBeInTheDocument();

    const falseBtn = selectors.falseBtn.get();

    await userEvent.click(falseBtn);

    await waitFor(
      () => {
        expect(selectors.trueRenderer.query()).not.toBeInTheDocument();
        expect(selectors.falseRenderer.query()).toBeInTheDocument();
      },
      { timeout: 2000 }
    );
  });
});
