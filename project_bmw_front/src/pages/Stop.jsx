import React from 'react';
import BMSearch from '../components/BMSearch';

const Stop = ({ stopService }) => <BMSearch service={stopService} button={'정류장 검색'} edit={false} />;

export default Stop;
