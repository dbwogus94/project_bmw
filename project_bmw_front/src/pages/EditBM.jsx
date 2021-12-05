import React from 'react';
import BMFeeds from '../components/BMFeeds';

const EditBM = ({ tweetService }) => <BMFeeds tweetService={tweetService} edit={false} />;

export default EditBM;
