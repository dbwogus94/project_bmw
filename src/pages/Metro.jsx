import React from 'react';
import BMSearch from '../components/BMSearch';

const Metro = ({ metroService }) => <BMSearch service={metroService} button={'지하철 검색'} edit={true} />;

export default Metro;
