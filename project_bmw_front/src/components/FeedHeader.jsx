import React from 'react';

const FeedHeader = ({ label }) => {
  return (
    <section className="feed-header">
      <span>{label}</span>
    </section>
  );
};

export default FeedHeader;
