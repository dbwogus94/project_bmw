import React from 'react';
import BMCards from '../components/BMCards';

const MyBM = ({ bmGroupService, busService }) => {
  return <BMCards bmGroupService={bmGroupService} busService={busService} />;
};

export default MyBM;
