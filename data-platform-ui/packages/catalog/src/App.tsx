import React from 'react';
import { datasetsActions, resourceActions, resourceFieldsActions, resourcesActions } from './store';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import NLSSTheme from './theme';
import { GlobalStyles, ResourceView, Layout, Fetcher, DatasetDetailView } from './components';
import CreateDatasetForm from './components/CreateDatasetForm';

const datasetDetailRender = (props: RouteComponentProps<{ id: string }>) => {
  const datasetId: number = parseInt(props.match.params.id);
  return (
    <Fetcher
      fetchAsync={() => datasetsActions.fetchAsync(datasetId)}
      resetAction={[resourcesActions.resetByDatasetId(datasetId)]}>
      <DatasetDetailView id={datasetId} />
    </Fetcher>
  );
};

const resourceViewRender = (props: RouteComponentProps<{ id: string }>) => {
  const resourceId: number = parseInt(props.match.params.id);
  return (
    <Fetcher
      fetchAsync={() => resourcesActions.fetchDetailsAsync(resourceId)}
      resetAction={[resourceFieldsActions.reset(), resourceActions.reset(resourceId)]}>
      <ResourceView entityId={resourceId} />
    </Fetcher>
  );
};

export interface NLSSCatalogAppProps {
  userName: string;
}

/**
 * Unique keys added to Fetcher routes to force recreation between routes.
 * @see https://reactrouter.com/web/api/Route
 * @returns {React.ReactElement}
 * @constructor
 */
export default function App(props: NLSSCatalogAppProps): React.ReactElement {
  return (
    <ThemeProvider theme={NLSSTheme}>
      <GlobalStyles />
      <Layout userName={props.userName}>
        <Switch>
          <Route path="/resource/:id" key="resourcePage" render={resourceViewRender} />
          <Route path="/dataset/:id" key="datasetPage" render={datasetDetailRender} />
          <Route path="/createDataset" component={CreateDatasetForm} />
        </Switch>
      </Layout>
    </ThemeProvider>
  );
}
