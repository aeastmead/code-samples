import React, { useState } from 'react';
import styled, { DefaultTheme, StyledComponent } from 'styled-components';
import cn from 'classnames';
import DetailLayoutHAreaItem from './DetailLayoutHAreaItem';
import ProductLayoutTitleBar from '../ProductLayout/ProductLayoutTitleBar';
import ProductThemeProvider from '../ProductThemeProvider';
import { FormDisplayToggle, IFormDisplayToggleProps } from '../SharedEditForms';
import { PageTitle } from '../SharedLayout';
import Crumby, { CrumbyType } from '../Crumby/CrumbyContainer';
import { HeaderExpansionProvider } from './HeaderExpansion';

const Container: StyledComponent<'div', DefaultTheme> = styled.div`
  height: 100%;
  width: 100%;
  overflow-x: hidden;
  padding-bottom: ${({ theme }: { theme: DefaultTheme }) => theme.spacingSizes.xlarge};
  display: grid;
  grid-template-rows: 32px 16px 1fr;
  grid-template-columns: 1fr;
  gap: ${({ theme }: { theme: DefaultTheme }) => theme.spacingSizes.medium};

  .nlss-detailLayout {
    &__banner {
      grid-row: 1;
      grid-column: 1;
    }

    &__crumbs {
      grid-row: 2;
      grid-column: 1;
    }

    &__main {
      grid-row: 3;
      grid-column: 1;
      overflow-y: auto;
      overflow-x: hidden;
    }

    &__gutter {
      padding-left: ${({ theme }) => theme.layout.gridSideOffset};
      padding-right: ${({ theme }) => theme.layout.gridSideOffset};
    }
  }

  .nlss-detailLayout-main {
    height: 100%;
    width: 100%;
    display: grid;
    grid-template-rows: [pageTitle] minmax(30px, max-content) [headerGroup] 350px [mainContent] 1fr;
    grid-template-columns: 4fr 4fr 2fr;
    gap: ${({ theme }: { theme: DefaultTheme }) => theme.spacingSizes.large}
      ${({ theme }: { theme: DefaultTheme }) => theme.spacingSizes.medium};
    &.nlss-detailLayout-main--hExpended {
      grid-template-rows: [pageTitle] minmax(30px, max-content) [headerGroup] minmax(350px, fit-content(600px)) [mainContent] 1fr;
    }

    &__pgTitle {
      grid-row: pageTitle;
    }

    &__fullRow {
      grid-column: 1 / 4;
      &--gutter {
        padding-left: ${({ theme }) => theme.layout.gridSideOffset};
        padding-right: ${({ theme }) => theme.layout.gridSideOffset};
      }
    }

    &__harea {
      height: auto;
      grid-row: headerGroup;
      grid-column: span 1;
      overflow: hidden;
      overflow-wrap: anywhere;
      background: ${({ theme }: { theme: DefaultTheme }) => theme.colors.backgroundShades.softest};
      padding: ${({ theme }: { theme: DefaultTheme }) => theme.spacingSizes.medium};
      display: grid;
      grid-auto-rows: max-content;
      grid-template-columns: 1fr;
      grid-auto-flow: row;
      row-gap: ${({ theme }: { theme: DefaultTheme }) => theme.spacingSizes.medium};

      & > * {
        grid-column: 1;
      }

      &--left {
        margin-left: ${({ theme }) => theme.layout.gridSideOffset};
      }

      &--right {
        margin-right: ${({ theme }) => theme.layout.gridSideOffset};
      }
    }

    &__content {
      grid-row: mainContent;

      padding: ${({ theme }: { theme: DefaultTheme }) => theme.spacingSizes.large} 0;
    }
  }

  .nlss-detailLayout-main--hExpended {
    grid-template-rows: [pageTitle] minmax(30px, max-content) [headerGroup] minmax(350px, auto) [mainContent] 1fr;
    .nlss-detailLayout-main__harea {
      max-height: 800px;
      overflow-y: auto;
    }
  }
  .nlss-detailLayout-pgTitle {
    grid-column: 1;
    align-items: center;
    &--editable {
      display: flex;
    }
    &__btn {
      width: ${({ theme }) => theme.font.title};
      margin-right: ${({ theme }: { theme: DefaultTheme }) => theme.spacingSizes.medium};
    }
  }
  .nlss-detailLayout-deleteEntity {
    grid-column: 3;
    margin-right: 32px;
  }
`;

const Content: StyledComponent<'div', DefaultTheme> = styled.div`
  min-height: 100%;
  width: 100%;

  display: flex;
  flex-direction: column;

  & > * {
    padding: 0 ${({ theme }) => theme.layout.gridSideOffset};
  }

  .bbui-tabs {
    border: none;
    border-bottom: solid 1px #d7d7d7;

    &-pane {
      &[data-active='true'] {
        border-color: ${({ theme }) => theme.tabs.colors.border};
        border-width: 1px 1px 0;
      }
      &:focus {
        outline: none;
      }
    }
  }

  .nlss-tabs {
    &__pane {
      &--disabled {
        cursor: not-allowed;
        background-color: ${({ theme }) => theme.tabs.colors.disabled};
      }
    }
  }
  .bbui-tabs-content-container {
    grid-row: 2;
    width: 100%;
    min-height: 100%;
    padding: 8px ${({ theme }) => theme.layout.gridSideOffsetPx + 20}px;
    background: ${({ theme }) => theme.tabs.colors.paneBackground};
  }

  .bbui-tabs-content-container > * {
    min-height: 100%;
    width: 100%;
  }

  .nlss-dataset-resources {
    &__icon {
      color: #ffb04c;
    }

    &__name-text {
      padding-left: ${({ theme }: { theme: DefaultTheme }) => theme.spacingSizes.small};
    }
  }
`;

function DetailLayout({
  className,
  children,
  forResource = false,
  leftHeaderElement,
  rightHeaderElement,
  middleHeaderElement,
  deleteEntityButton,
  entityName,
  entityId,
  editable,
  entityNameFormRender,
  ...rest
}: DetailLayout.Props) {
  const [headerExpended, setHeaderExpended] = useState(false);
  return (
    <ProductThemeProvider resource={forResource}>
      <Container {...rest} className={cn('nlss-detailLayout', className)}>
        <ProductLayoutTitleBar className="nlss-detailLayout__banner" resource={forResource} />
        <Crumby
          className="nlss-detailLayout__crumbs nlss-detailLayout__gutter"
          activeEntityType={forResource ? CrumbyType.RESOURCE : CrumbyType.DATASET}
          entityId={entityId}
        />
        <HeaderExpansionProvider onExpansionChange={setHeaderExpended}>
          <div
            className={cn('nlss-detailLayout-main__main nlss-detailLayout-main', {
              'nlss-detailLayout-main--hExpended': headerExpended
            })}>
            <FormDisplayToggle
              editButtonClassName="nlss-detailLayout-pgTitle__btn"
              editable={editable}
              formRender={entityNameFormRender}
              editableClassName="nlss-detailLayout-pgTitle--editable"
              className="nlss-detailLayout-main__pgTitle nlss-detailLayout-main__fullRow nlss-detailLayout-main__fullRow--gutter nlss-detailLayout-pgTitle">
              <PageTitle className="nlss-detailLayout-pgTitle__text">{entityName}</PageTitle>
            </FormDisplayToggle>

            <div className="nlss-detailLayout-deleteEntity">{deleteEntityButton}</div>

            <div className="nlss-detailLayout-main__harea nlss-detailLayout-main__harea--left nlss">
              {leftHeaderElement}
            </div>
            <div className="nlss-detailLayout-main__harea nlss-detailLayout-main__harea--middle">
              {middleHeaderElement}
            </div>
            <div className="nlss-detailLayout-main__harea nlss-detailLayout-main__harea--right">
              {rightHeaderElement}
            </div>
            <Content className="nlss-detailLayout-main__content nlss-detailLayout-main__fullRow">{children}</Content>
          </div>
        </HeaderExpansionProvider>
      </Container>
    </ProductThemeProvider>
  );
}

namespace DetailLayout {
  export interface Props extends React.HTMLAttributes<HTMLDivElement> {
    forResource?: boolean;
    leftHeaderElement?: React.ReactNode;
    middleHeaderElement?: React.ReactNode;
    rightHeaderElement?: React.ReactNode;
    deleteEntityButton?: React.ReactNode;
    editable?: boolean;
    entityId: number;
    entityName?: string;
    entityNameFormRender?: IFormDisplayToggleProps['formRender'];
  }

  export const HAreaItem = DetailLayoutHAreaItem;
}

DetailLayout.displayName = 'NLSSDetailLayout';
export default DetailLayout;
