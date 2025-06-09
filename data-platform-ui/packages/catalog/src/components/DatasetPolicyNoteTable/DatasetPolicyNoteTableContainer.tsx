import React from 'react';
import cn from 'classnames';
import { datasetPolicyNotesSelectors, useSelectorFactory } from '../../store';
import { DatasetPolicyNoteView } from '../../types';
import DatasetPolicyNoteTable, { IDatasetPolicyNoteTableProps } from './DatasetPolicyNoteTable';

type StateProps = {
  items: DatasetPolicyNoteView[] | undefined;
};

export interface IDatasetPolicyNoteTableContainerProps extends Omit<IDatasetPolicyNoteTableProps, keyof StateProps> {
  entityIds: number[];
}

export default function DatasetPolicyNoteTableContainer({
  entityIds,
  className,
  ...rest
}: IDatasetPolicyNoteTableContainerProps): React.ReactElement | null {
  const items: DatasetPolicyNoteView[] | undefined = useSelectorFactory<
    { entityIds: number[] },
    DatasetPolicyNoteView[] | undefined
  >(datasetPolicyNotesSelectors.makeGetViewsSelector, { entityIds });

  if (items === undefined) {
    return null;
  }

  return <DatasetPolicyNoteTable {...rest} className={cn('nlss-dataset-policy-note-table', className)} items={items} />;
}

DatasetPolicyNoteTableContainer.displayName = 'NLSSDatasetPolicyNoteTableContainer';
