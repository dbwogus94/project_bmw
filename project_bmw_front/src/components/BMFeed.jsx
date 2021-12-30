import React from 'react';
import { Link } from 'react-router-dom';

const BMFeed = ({ bm, onfeedClick }) => {
  const { routeId, routeName, routeTypeName, type } = bm;

  return (
    <>
      <li className="feed">
        <article className="feed-container">
          <div className="feed-main" onClick={onfeedClick} data-route-id={routeId} data-type={type}>
            <p>
              <span className="feed-main-name">{routeName}</span>
              <span className="feed-main-routeTypeName">{routeTypeName}</span>
            </p>
          </div>
          {/* <div className="feed-like">
            {edit && (
              <span className="feed-like-text" onClick={onfeedClick}>
                {edit && like ? '♥' : '♡'}
              </span>
            )}
          </div> */}
          <div className="feed-info">
            <Link to={`/bus/${type}/${routeId}`}>
              <img src="./img/info.png" alt="info Logo" className="feed-info-img" />
            </Link>
          </div>
        </article>
      </li>
      {/* <div className="feed-bottom"></div> */}
    </>
  );
};
export default BMFeed;
