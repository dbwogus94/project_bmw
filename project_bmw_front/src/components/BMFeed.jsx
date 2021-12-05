import React from 'react';

const BMFeed = ({ tweet, edit, onInfoClick, onLickClick }) => {
  const { name, username, routeTypeName, like } = tweet;

  return (
    <>
      <li className="feed">
        <article className="feed-container">
          <div className="feed-main">
            <p>
              <span className="feed-main-name">{name}</span>
              <span className="feed-main-routeTypeName">{routeTypeName || username}</span>
            </p>
          </div>
          <div className="feed-like">
            {edit && (
              <span className="feed-like-text" onClick={onLickClick}>
                {like ? '♥' : '♡'}
              </span>
            )}
          </div>
          <div className="feed-info">
            <img src="./img/info.png" alt="info Logo" className="feed-info-img" onClick={onInfoClick} />
          </div>
        </article>
      </li>
      <div className="feed-bottom"></div>
    </>
  );
};
export default BMFeed;
