import { Button, Icon } from '@bbnpm/bb-ui-framework';
import React from 'react';
import cn from 'classnames';
import styled, { DefaultTheme, StyledComponent } from 'styled-components';
import DatasetPolicyNoteTable from '../DatasetPolicyNoteTable';
import DatasetPolicyNoteForm from '../DatasetPolicyNoteForm';

export interface IDatasetPolicyNotesProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onLoad' | 'onUnload'> {
  entityId: number;
  datasetPolicyNoteIds?: number[];
  loading?: boolean;
  canAdd?: boolean;
  onLoad?: () => void;
  onUnload?: () => void;
}

type State = {
  showForm: boolean;
};

const Container: StyledComponent<'div', DefaultTheme> = styled.div`
  position: relative;
  padding-top: 32px;
  display: flex;

  .nlss-dataset-policy-notes {
    &__main {
      min-height: 100%;
      flex-grow: 1;

      &--empty {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: ${({ theme }) => theme.font.size.xlarge};
        font-weight: ${({ theme }) => theme.font.weight.medium};
      }
    }
    &__add-btn {
      padding: 0 5px;
      font-size: ${({ theme }) => theme.font.size.base};
      text-transform: none;
      position: absolute;
      height: 30px;
      top: 5px;
      right: -10px;
      z-index: 100;

      &:focus {
        box-shadow: none;
      }
    }

    &--hide {
      display: none;
    }
    &__link {
      overflow-wrap: anywhere;
      color: ${({ theme }) => theme.links.colors.default};
      text-decoration: none;
      font-weight: ${({ theme }) => theme.font.weight.medium};

      &:hover {
        color: ${({ theme }) => theme.links.colors.hover};
      }

      &:visited {
        color: ${({ theme }) => theme.links.colors.visited};
      }
    }
  }
  .nlss-datasetPolicyNotes {
    &-list {
      all: unset;
      list-style: none;
      margin: 0;

      li:not(:first-child) {
        padding-top: ${({ theme }) => theme.spacingSizes.small};
      }
    }

    &-note > * {
      white-space: pre-wrap;
    }
  }
`;

export default class DatasetPolicyNotes extends React.PureComponent<IDatasetPolicyNotesProps, State> {
  static displayName = 'NLSSDatasetPolicyNotes';

  state: State = {
    showForm: false
  };

  constructor(props: IDatasetPolicyNotesProps) {
    super(props);
    this.handleHideForm = this.handleHideForm.bind(this);
    this.handleShowForm = this.handleShowForm.bind(this);
  }

  public componentDidMount(): void {
    this.props.onLoad && this.props.onLoad();
  }

  public componentWillUnmount(): void {
    this.props.onUnload && this.props.onUnload();
  }

  private handleHideForm(): void {
    this.setState({ showForm: false });
  }

  private handleShowForm(): void {
    this.setState({ showForm: true });
  }

  public render(): React.ReactElement | null {
    const {
      loading,
      datasetPolicyNoteIds,
      onUnload,
      onLoad,
      className,
      entityId,
      canAdd: _canAdd,
      ...rest
    } = this.props;

    if (loading === true) {
      return null;
    }

    const canAdd = _canAdd === true;

    const showForm = canAdd && this.state.showForm;

    return (
      <Container
        {...rest}
        className={cn('nlss-dataset-policy-notes', { 'nlss-dataset-policy-notes--show-form': showForm }, className)}>
        {showForm && (
          <DatasetPolicyNoteForm
            className="nlss-dataset-policy-notes__form"
            onCancel={this.handleHideForm}
            datasetId={entityId}
          />
        )}

        {datasetPolicyNoteIds && datasetPolicyNoteIds.length > 0 ? (
          <DatasetPolicyNoteTable
            entityIds={datasetPolicyNoteIds}
            className={cn('nlss-dataset-policy-notes__main', { 'nlss-dataset-policy-notes--hide': showForm })}
          />
        ) : (
          <div
            className={cn('nlss-dataset-policy-notes__main nlss-dataset-policy-notes__main--empty', {
              'nlss-dataset-policy-notes--hide': showForm
            })}>
            No Policies have been added to this Dataset yet
          </div>
        )}
        {canAdd && (
          <Button
            type="button"
            kind="tertiary"
            className={cn('nlss-dataset-policy-notes__add-btn', { 'nlss-dataset-policy-notes--hide': showForm })}
            onClick={this.handleShowForm}>
            <Icon name="plus-circle" title="Add Resources" className="nlss-dataset-policy-notes__add-icon" />
            Add
          </Button>
        )}
      </Container>
    );
  }
}
