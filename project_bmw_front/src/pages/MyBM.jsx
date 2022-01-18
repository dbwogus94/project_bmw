import React from 'react';
import BMCards from '../components/shared/BMCards';

const MyBM = ({ bmGroupService, busService }) => {
  return <BMCards bmGroupService={bmGroupService} busService={busService} />;
};

export default MyBM;
