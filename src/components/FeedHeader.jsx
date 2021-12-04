import React from 'react';

const FeedHeader = ({ label }) => {
  return (
    <section className="feed-header">
      <span>{label === 'B' ? '버스' : '지하철'}</span>
    </section>
  );
};

export default FeedHeader;
