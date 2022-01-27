import React from 'react';
import BMCards from '../components/shared/BMCards';

const MyBM = ({ bmGroupService, busService, metroService }) => {
  return <BMCards bmGroupService={bmGroupService} busService={busService} metroService={metroService} />;
};

export default MyBM;
