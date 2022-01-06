import { Switch, useRouteMatch } from 'react-router-dom';
import { Route } from 'react-router-dom';
import BusInfo from '../components/bus/BusInfo';
import BMSearch from '../components/BMSearch';
import Stations from '../components/Stations';

const Bus = ({ busService, bmGroupService }) => {
  const { path } = useRouteMatch();
  return (
    <>
      <Switch>
        <Route exact path={`${path}`}>
          <BMSearch service={busService} button={'버스 검색'} />
        </Route>
        <Route exact path={`${path}/:routeId`}>
          <BusInfo service={busService}></BusInfo>
        </Route>
        <Route exact path={`${path}/:routeId/stations`}>
          <Stations service={busService} bmGroupService={bmGroupService}></Stations>
        </Route>
      </Switch>
    </>
  );
};

export default Bus;
