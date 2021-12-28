import { Switch, useRouteMatch } from 'react-router-dom';
import { Route } from 'react-router-dom';
import BMInfo from '../components/BMInfo';
import BMSearch from '../components/BMSearch';

const Bus = ({ busService }) => {
  const { path } = useRouteMatch();
  return (
    <>
      <Switch>
        <Route exact path={`${path}`}>
          <BMSearch service={busService} button={'버스 검색'} />
        </Route>
        <Route exact path={`${path}/:type/:routeId`}>
          <BMInfo service={busService}></BMInfo>
        </Route>
        <Route exact path={`${path}/:type/:routeId/stations`}>
          <h1>stations</h1>
        </Route>
      </Switch>
    </>
  );
};

export default Bus;
