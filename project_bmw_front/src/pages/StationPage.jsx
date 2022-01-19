import React from 'react';
import { Route, Routes } from 'react-router-dom';
import BMSearch from '../components/shared/BMSearch';
import StationBusFeeds from '../components/station/StationBusFeeds';

const StationPage = ({ stationService }) => {
  return (
    <>
      <Routes>
        <Route path={`/`} element={<BMSearch service={stationService} button={'정류장 검색'} edit={false} />} />
        <Route path={`/:stationId/buses`} element={<StationBusFeeds stationService={stationService}></StationBusFeeds>} />
      </Routes>
    </>
  );
};
export default StationPage;
