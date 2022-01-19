import React from 'react';
import { Link } from 'react-router-dom';

const StationFeed = ({ sation, onfeedClick, info }) => {
  const {
    // districtCd, districtName, regionName, label,
    stationId, //
    stationName,
    arsId,
    type,
  } = sation;

  return (
    <>
      <li className="feed">
        <article className="feed-container">
          <div className="feed-main" onClick={onfeedClick} data-station-id={stationId} data-type={type} data-ars-id={arsId}>
            <p>
              <span className="feed-main-name">{stationName}</span>
              <span className="feed-main-routeTypeName">{stationId}</span>
            </p>
          </div>
          <div className="feed-info">
            {info && (
              <Link to={`/station/${stationId}?type=${type}`}>
                <img src={`${process.env.PUBLIC_URL}/img/info.png`} alt="info Logo" className="feed-info-img" />
              </Link>
            )}
          </div>
        </article>
      </li>
    </>
  );
};
export default StationFeed;
