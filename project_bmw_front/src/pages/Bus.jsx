import { Switch, useRouteMatch } from 'react-router-dom';
import { Route } from 'react-router-dom';
import BusInfo from '../components/bus/BusInfo';
import BMSearch from '../components/BMSearch';
import Stations from '../components/Stations';

const Bus = ({ busService }) => {
  const { path } = useRouteMatch();
  return (
    <>
      <Switch>
        <Route exact path={`${path}`}>
          <BMSearch service={busService} button={'버스 검색'} />
        </Route>
        <Route exact path={`${path}/:type/:routeId`}>
          <BusInfo service={busService}></BusInfo>
        </Route>
        <Route exact path={`${path}/:type/:routeId/stations`}>
          <Stations service={busService}></Stations>
        </Route>
      </Switch>
    </>
  );
};

export default Bus;
