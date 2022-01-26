import React from 'react';
import { Route, Routes } from 'react-router-dom';
import MetroSearch from '../components/metro/MetroSearch';
import Stations from '../components/shared/Stations';

const Metro = ({ metroService, bmGroupService }) => {
  return (
    <>
      <Routes>
        <Route path={`/`} element={<MetroSearch metroService={metroService} button={'지하철 검색'} edit={true} />} />
        <Route path={`/:routeId/stations`} element={<Stations service={metroService} bmGroupService={bmGroupService}></Stations>} />
      </Routes>
    </>
  );
};
export default Metro;
