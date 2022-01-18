import { Routes } from 'react-router-dom';
import { Route } from 'react-router-dom';
import BusInfo from '../components/bus/BusInfo';
import BMSearch from '../components/shared/BMSearch';
import Stations from '../components/shared/Stations';

const Bus = ({ busService, bmGroupService }) => {
  return (
    <>
      <Routes>
        <Route path={`/`} element={<BMSearch service={busService} button={'버스 검색'} />} />
        <Route path={`/:routeId`} element={<BusInfo service={busService}></BusInfo>} />
        <Route path={`/:routeId/stations`} element={<Stations service={busService} bmGroupService={bmGroupService}></Stations>} />
      </Routes>
    </>
  );
};

export default Bus;
