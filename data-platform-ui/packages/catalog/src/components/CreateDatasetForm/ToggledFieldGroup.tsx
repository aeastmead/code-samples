import React, { useMemo } from 'react';
import cn from 'classnames';
import styled, { DefaultTheme, StyledComponent } from 'styled-components';
import type { ConditionalKeys } from 'type-fest';
import { FormikContextType, useFormikContext } from 'formik';
import type { CreateDatasetFormModel } from './utils';
import type { OptionValue } from '@nlss/brain-trust';
import type { FormLayoutSectionType } from '../Form';
import { ButtonBarField } from '../Form';

const Container: StyledComponent<FormLayoutSectionType, DefaultTheme> = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;

  .nlss-toggledFldGroup {
    &__top {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-bottom: ${({ theme }: { theme: DefaultTheme }) => theme.spacingSizes.xlarge};
    }

    &__title {
      margin: unset;
      padding-bottom: ${({ theme }: { theme: DefaultTheme }) => theme.spacingSizes.medium};
      font-size: ${({ theme }: { theme: DefaultTheme }) => theme.fontSizes.large};
      font-weight: ${({ theme }: { theme: DefaultTheme }) => theme.fontWeights.medium};
    }
  }
`;

function ToggledFieldGroup<TFieldName extends ConditionalKeys<CreateDatasetFormModel, boolean>>({
  name,
  trueButtonLabel,
  falseButtonLabel,
  falseRenderer,
  trueRenderer,
  className,
  sectionTitle,
  ...rest
}: ToggledFieldGroup.Props<TFieldName>) {
  const buttonBarOptions: OptionValue<boolean>[] = useMemo(
    () => [
      { label: trueButtonLabel, value: true },
      { label: falseButtonLabel, value: false }
    ],
    [trueButtonLabel, falseButtonLabel]
  );

  const formik: FormikContextType<CreateDatasetFormModel> = useFormikContext();

  const selectedValue: boolean = useMemo(() => formik.values[name] === true, [name, formik.values[name]]);

  return (
    <Container {...rest} className={cn('nlss-toggledFldGroup', className)}>
      <div className="nlss-toggledFldGroup__top">
        <h4 className="nlss-toggledFldGroup__title">{sectionTitle}</h4>
        <ButtonBarField
          className="nlss-toggledFldGroup__toggle"
          options={buttonBarOptions}
          name={name}
          type="boolean"
        />
      </div>
      <div className={cn('nlss-toggledFldGroup__main', `nlss-toggledFldGroup__main--${selectedValue}`)}>
        {selectedValue ? trueRenderer : falseRenderer}
      </div>
    </Container>
  );
}

namespace ToggledFieldGroup {
  export interface Props<TFieldName extends ConditionalKeys<CreateDatasetFormModel, boolean>>
    extends React.HTMLAttributes<HTMLDivElement> {
    name: TFieldName;
    trueButtonLabel: string;
    falseButtonLabel: string;
    trueRenderer: React.ReactElement;
    falseRenderer: React.ReactElement;
    sectionTitle?: string;
  }
}

export default ToggledFieldGroup;
