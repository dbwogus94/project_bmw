import React from 'react';

const BMfeed = ({ tweet, edit, onInfoClick }) => {
  const {
    // id, //
    // label,
    name,
    username,
    // server_time,
    // first_time,
    // first_text,
    // second_time,
    // second_text,
    // direction,
    routeTypeName,
  } = tweet;

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
          <div className="feed-like">{edit && <span className="feed-like-text">♥</span>}</div>
          <div className="feed-info">
            <img src="./img/info.png" alt="info Logo" className="feed-info-img" />
          </div>
        </article>
      </li>
      <div className="feed-bottom"></div>
    </>
  );
};
export default BMfeed;
