import React from 'react';
import { Route, Routes } from 'react-router-dom';
import BMSearch from '../components/shared/BMSearch';
import Stations from '../components/shared/Stations';

const StationPage = ({ stationService }) => {
  return (
    <>
      <Routes>
        <Route path={`/`} element={<BMSearch service={stationService} button={'정류장 검색'} edit={false} />} />
        {/* <Route path={`/:routeId/buses`} element={<Stations service={stationService}></Stations>} /> */}
      </Routes>
    </>
  );
};
export default StationPage;
