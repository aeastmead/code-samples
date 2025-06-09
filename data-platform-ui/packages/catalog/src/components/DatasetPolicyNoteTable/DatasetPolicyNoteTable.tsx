import React from 'react';
import { DatasetPolicyNoteView, DisplayLink } from '../../types';
import Blink from '../Blink';
import {
  DatasetPolicyNoteContactForm,
  DatasetPolicyNoteLinkForm,
  DatasetPolicyNoteNoteForm,
  DatasetPolicyNoteTypeForm
} from '../DatasetPolicyNoteEditForms';
import DeleteDatasetPolicyNote from '../DeleteDatasetPolicyNote';
import createNLSSTable, { FilterFieldType, INLSSTableProps } from '../NLSSTable';
import { FormDisplayToggleRenderProps } from '../SharedEditForms';

export interface IDatasetPolicyNoteTableProps extends INLSSTableProps<DatasetPolicyNoteView> {}

function LinksCellRender(rowData: DatasetPolicyNoteView) {
  if (rowData.links === undefined) {
    return null;
  }
  return (
    <ul className="nlss-datasetPolicyNotes-links nlss-datasetPolicyNotes-list">
      {rowData.links.map((link: DisplayLink, index: number) => (
        <li key={index.toString()}>
          {DisplayLink.isBLink(link) ? (
            <Blink linkFunction={link.terminalFunction} url={link.url} />
          ) : (
            <a
              className="nlss-dataset-policy-notes__link nlss-text--hard-wrap"
              target="_blank"
              rel="noopener noreferrer"
              href={link.url}>
              {link.label}
            </a>
          )}
        </li>
      ))}
    </ul>
  );
}

function ContactsCell(rowData: DatasetPolicyNoteView) {
  if (rowData.contactNames === undefined) {
    return null;
  }
  return (
    <ul className="nlss-datasetPolicyNotes-contacts nlss-datasetPolicyNotes-list">
      {rowData.contactNames &&
        rowData.contactNames.map((contact: string, index: number) => (
          <li key={index.toString()} className="nlss-datasetPolicyNotes-contacts__contact">
            {contact}
          </li>
        ))}
    </ul>
  );
}

function formRenderFactory(
  FormComponent: React.ComponentType<any>
): (rowData: DatasetPolicyNoteView, props: FormDisplayToggleRenderProps) => React.ReactNode {
  return (rowData: DatasetPolicyNoteView, props: FormDisplayToggleRenderProps) =>
    (<FormComponent {...props} entityId={rowData.id} />) as any;
}

function ActionCellRender(rowData: DatasetPolicyNoteView): React.ReactElement | null {
  if (!rowData.canEdit) {
    return null;
  }

  return <DeleteDatasetPolicyNote entityId={rowData.id} />;
}

export default createNLSSTable<DatasetPolicyNoteView>(
  [
    {
      dataKey: 'createdAtEpoch',
      headerLabel: 'Date',
      gridColumnSpan: 1,
      isNumberValue: true,
      displayDataKey: 'created',
      cellClassName: 'nlss-dataset-resources__name nlss-text-wrap'
    },
    {
      dataKey: 'policyNoteType',
      headerLabel: 'Type',
      gridColumnSpan: 1,
      cellClassName: 'nlss-text-wrap--break-word',
      filter: {
        type: FilterFieldType.DROPDOWN,
        placeholder: 'type'
      },

      editableDeciderKey: 'canEdit',
      formRender: formRenderFactory(DatasetPolicyNoteTypeForm)
    },
    {
      dataKey: 'contactNames',
      isArrayValue: true,
      headerLabel: 'Contact',
      gridColumnSpan: 2,
      filter: {
        type: FilterFieldType.SEARCH
      },
      cellRenderer: ContactsCell,
      editableDeciderKey: 'canEdit',
      formRender: formRenderFactory(DatasetPolicyNoteContactForm)
    },
    {
      dataKey: 'note',
      headerLabel: 'Note',
      cellClassName: 'nlss-datasetPolicyNotes-note',
      gridColumnSpan: 4,
      filter: {
        type: FilterFieldType.SEARCH
      },

      editableDeciderKey: 'canEdit',
      formRender: formRenderFactory(DatasetPolicyNoteNoteForm)
    },
    {
      dataKey: 'searchableLinkValue',
      headerLabel: 'Link',
      gridColumnSpan: 3,
      filter: {
        type: FilterFieldType.SEARCH
      },
      cellRenderer: LinksCellRender,
      editableDeciderKey: 'canEdit',
      formRender: formRenderFactory(DatasetPolicyNoteLinkForm)
    },
    {
      dataKey: 'id',
      headerLabel: 'Actions',
      gridColumnSpan: 1,
      cellRenderer: ActionCellRender,
      disableSort: true
    }
  ],
  {
    initialSortDataKey: 'createdAtEpoch'
  }
);
