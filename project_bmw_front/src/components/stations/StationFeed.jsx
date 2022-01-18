import React from 'react';
import { Link } from 'react-router-dom';

const StationFeed = ({ sation, onfeedClick, info }) => {
  const { routeId, routeName, routeTypeName, type, stationName } = sation;

  return (
    <>
      <li className="feed">
        <article className="feed-container">
          <div className="feed-main" onClick={onfeedClick} data-route-id={routeId} data-type={type}>
            <p>
              <span className="feed-main-name">{routeName}</span>
              <span className="feed-main-routeTypeName">{routeTypeName ? routeTypeName : stationName}</span>
            </p>
          </div>
          <div className="feed-info">
            {info && (
              <Link to={`/station/${routeId}?type=${type}`}>
                <img src="./img/info.png" alt="info Logo" className="feed-info-img" />
              </Link>
            )}
          </div>
        </article>
      </li>
    </>
  );
};
export default StationFeed;
