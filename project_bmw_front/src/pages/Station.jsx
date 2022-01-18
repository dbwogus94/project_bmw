import React from 'react';
import BMSearch from '../components/shared/BMSearch';

const Stations = ({ stationService }) => <BMSearch service={stationService} button={'정류장 검색'} edit={false} />;

export default Stations;
