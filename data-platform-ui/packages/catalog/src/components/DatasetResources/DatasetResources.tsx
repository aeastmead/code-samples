import React from 'react';
import { DatasetResource } from '../../types';
import createNLSSTable, { FilterFieldType, INLSSTableProps, NLSSTableCellRenderer } from '../NLSSTable';
import ResourceType from '../ResourceType';
import DatasetResourceNameCell from './DatasetResourceNameCell';
import ResourceTagContainer from '../ResourceTags/ResourceTagsContainer';

const ResourceTypeCellRenderer: NLSSTableCellRenderer<DatasetResource> = ({ resourceTypeId }: DatasetResource) => (
  <ResourceType id={resourceTypeId} />
);

const ResourceNameCellRenderer: NLSSTableCellRenderer<DatasetResource> = (rowData: DatasetResource) => (
  <DatasetResourceNameCell>{rowData.name}</DatasetResourceNameCell>
);

function ResourceTagsRenderer(rowData: DatasetResource, _: number): React.ReactElement {
  return <ResourceTagContainer entityId={rowData.id} />;
}

export default createNLSSTable<DatasetResource>(
  [
    {
      dataKey: 'name',
      headerLabel: 'Name',
      gridColumnSpan: 4,
      cellClassName: 'nlss-dataset-resources__name nlss-text-wrap',
      filter: {
        type: FilterFieldType.SEARCH
      },
      cellRenderer: ResourceNameCellRenderer
    },
    {
      dataKey: 'resourceTypeId',
      headerLabel: 'Type',
      gridColumnSpan: 1,
      displayDataKey: 'resourceType',
      isNumberValue: true,
      cellClassName: 'nlss-text-wrap--break-word',
      filter: {
        type: FilterFieldType.DROPDOWN,
        placeholder: 'type'
      },
      cellRenderer: ResourceTypeCellRenderer
    },
    {
      dataKey: 'locationName',
      headerLabel: 'Location',
      gridColumnSpan: 2,
      filter: {
        type: FilterFieldType.DROPDOWN,
        placeholder: 'schema/db name'
      }
    },
    {
      dataKey: 'description',
      headerLabel: 'Description',
      gridColumnSpan: 3,
      filter: {
        type: FilterFieldType.SEARCH
      }
    },
    {
      dataKey: 'tagIds',
      headerLabel: 'Tags',
      cellRenderer: ResourceTagsRenderer,
      gridColumnSpan: 2,
      disableSort: true
    }
  ],
  {
    initialSortDataKey: 'name',
    mapRowLinkTo: ({ id }: DatasetResource) => `/resource/${id}`
  }
);

export interface DatasetResourcesProps extends INLSSTableProps<DatasetResource> {}
