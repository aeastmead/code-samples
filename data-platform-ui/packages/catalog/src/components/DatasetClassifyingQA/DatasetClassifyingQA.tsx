import React from 'react';
import {
  ClassificationAnsweredCategory,
  ClassificationQuestionnairePersonalDataType,
  EntityLeafNode
} from '../../types';
import styled, { DefaultTheme, StyledComponent } from 'styled-components';
import cn from 'classnames';
import { Overlay } from '@bbnpm/bb-ui-framework';
import ClassificationQuestionnaireForm from '../ClassificationQuestionnaireForm';
import { EditPencil } from '../SharedLayout';

export interface DatasetClassifyingQAProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onLoad' | 'onUnload'> {
  entityId: number;
  loading: boolean;
  canEdit: boolean;
  categories?: ClassificationAnsweredCategory[];
  personalDataTypes?: ClassificationQuestionnairePersonalDataType[];
  onLoad?: () => void;
}

type State = {
  showForm: boolean;
};

export default class DatasetClassifyingQA extends React.PureComponent<DatasetClassifyingQAProps, State> {
  state: State = { showForm: false };

  formWrapperRef: React.RefObject<HTMLDivElement>;

  constructor(props: DatasetClassifyingQAProps) {
    super(props);
    this.formWrapperRef = React.createRef<HTMLDivElement>();

    this.handleOpen = this.handleOpen.bind(this);

    this.handleClose = this.handleClose.bind(this);
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
    this.cleanup = this.cleanup.bind(this);
  }

  render() {
    const { loading, categories, onLoad, entityId, className, personalDataTypes, canEdit, ...rest } = this.props;
    if (loading) {
      return <div>loading</div>;
    }
    return (
      <>
        <Container {...rest} className={cn('nlss-dc-qa', className)}>
          <div className="nlss-dc-qa__header nlss-dc-qa-header">
            <h3 className="nlss-dc-qa-header__text">Classification Questionnaire</h3>
            {canEdit && <EditPencil className="nlss-dc-qa-header__btn" onClick={this.handleOpen} />}
            <div className="nlss-dc-qa-header__description">
              The data classification is assigned based on the use cases selected. Below is the summary of the currently
              selected use case. Please uise the edit icon to choose different ones. On saving your new selections, the
              data classification will be automatically updated.
            </div>
          </div>
          <div className="nlss-dc-qa__main">
            {categories &&
              categories.map((category: ClassificationAnsweredCategory) => (
                <div key={category.id} className="nlss-dc-qa__group nlss-dc-qa-group">
                  <h4 className="nlss-dc-qa-group__header">{category.name}</h4>
                  {category.children.map((child: EntityLeafNode) => (
                    <div key={child.id} className="nlss-dc-qa-group__item">
                      {child.name}
                    </div>
                  ))}
                </div>
              ))}

            {!categories && (
              <div className="nlss-dc-qa__group  nlss-dc-qa-group nlss-dc-qa-group--empty">
                <h4 className="nlss-dc-qa-group__header">Types of Data</h4>
                <div className="nlss-dc-qa-group__item nlss-dc-qa-group__item--empty">No Results</div>
              </div>
            )}

            <div className="nlss-dc-qa__group nlss-dc-qa-group nlss-dc-qa-group--empty">
              <h4 className="nlss-dc-qa-group__header"> Personal Data</h4>
              {personalDataTypes &&
                personalDataTypes.map((personalDataType: ClassificationQuestionnairePersonalDataType) => (
                  <div className="nlss-dc-qa-group__item" key={personalDataType.id}>
                    {personalDataType.name}
                  </div>
                ))}
              {!personalDataTypes && <div className="nlss-dc-qa-group__item">NO RESULTS</div>}
            </div>
          </div>
        </Container>
        <Overlay
          portalContainerId="nlss-modal-root"
          onClose={this.handleClose}
          isOpen={this.state.showForm}
          closeOnEscKey
          closeOnOverlayClick={false}
          showShadow>
          <FormContainer ref={this.formWrapperRef}>
            <ClassificationQuestionnaireForm entityId={entityId} onComplete={this.handleClose} />
          </FormContainer>
        </Overlay>
      </>
    );
  }

  handleOutsideClick(event: MouseEvent) {
    if (
      this.formWrapperRef.current !== null &&
      event.target instanceof Element &&
      !this.formWrapperRef.current.contains(event.target)
    ) {
      this.handleClose();
    }
  }

  componentDidMount() {
    this.props.onLoad && this.props.onLoad();
  }

  componentWillUnmount() {
    this.cleanup();
  }

  handleOpen() {
    this.setState({ showForm: true });
    document.addEventListener('mousedown', this.handleOutsideClick);
  }

  cleanup() {
    document.removeEventListener('mousedown', this.handleOutsideClick);
  }

  handleClose() {
    this.cleanup();
    this.setState({ showForm: false });
  }
}

const FormContainer: StyledComponent<'div', DefaultTheme> = styled.div`
  z-index: 1100;
  width: 80vw;
  height: 80vh;
  overflow: hidden;
  background: ${({ theme }: { theme: DefaultTheme }) => theme.colors.background};

  & > * {
    min-height: 100%;
    max-height: 80vh;
    background: ${({ theme }: { theme: DefaultTheme }) => theme.colors.background};
  }
`;

const Container: StyledComponent<'div', DefaultTheme> = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100%;
  padding-top: 16px;

  h3,
  h4 {
    margin: 0;
  }

  .nlss-dc-qa {
    &__main {
      display: flex;
      flex-direction: column;
    }

    &__group {
      padding-bottom: 16px;
    }
  }

  .nlss-dc-qa-header {
    padding: 0 0 32px;
    display: grid;
    grid-template-columns: 1fr 40px;
    grid-template-rows: repeat(2, max-content);
    grid-row-gap: 32px;
    grid-column-gap: 8px;
    justify-content: flex-start;

    &__text {
      grid-column: 1;
      grid-row: 1;
      font-size: ${({ theme }: { theme: DefaultTheme }) => theme.font.size.large};
      font-weight: ${({ theme }: { theme: DefaultTheme }) => theme.font.weight.demi};
    }

    &__btn {
      grid-column: 2;
      grid-row: 1;
    }

    &__description {
      grid-column: 1/2;
      grid-row: 2;
    }
  }

  .nlss-dc-qa-group {
    display: flex;
    flex-direction: column;

    &:not(:first-child) {
      border-top: solid 2px ${({ theme }: { theme: DefaultTheme }) => theme.tables.colors.border};
    }

    &__header {
      padding: 8px 8px 16px;
      font-weight: ${({ theme }: { theme: DefaultTheme }) => theme.font.weight.demi};

      border-bottom: solid 2px ${({ theme }: { theme: DefaultTheme }) => theme.tables.colors.border};
    }

    &__item {
      padding: 8px 8px 8px 16px;
    }
  }
`;
