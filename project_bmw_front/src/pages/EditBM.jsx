import React from 'react';
import BMFeeds from '../components/BMFeeds';

const EditBM = ({ bmGroupService, busService }) => <BMFeeds bmGroupService={bmGroupService} busService={busService} edit={false} />;

export default EditBM;
