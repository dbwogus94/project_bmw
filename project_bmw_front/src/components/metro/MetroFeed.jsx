import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const MetroFeed = ({ metro, onfeedClick, onDeleteClick, info, edit }) => {
  const { routeId, routeName, stationName, stationSeq, bookMarkId } = metro;
  const [edited, setEdited] = useState(false);

  useEffect(() => {
    setEdited(edit);
  }, [edit]);

  return (
    <>
      <li className="feed">
        <article className="feed-container">
          <div className="feed-main" onClick={onfeedClick} data-route-id={routeId} data-station-seq={stationSeq}>
            <p>
              <span className="feed-main-name">{stationName}</span>
              <span className="feed-main-routeTypeName">{routeName}</span>
            </p>
          </div>
          <div className="feed-info">
            {info && (
              <Link to={`/metros/${routeId}`}>
                <img src={`${process.env.PUBLIC_URL}/img/info.png`} alt="info Logo" className="feed-info-img" />
              </Link>
            )}
            {edited && (
              <button className="bm-feed-delete-btn" onClick={onDeleteClick} data-book-mark-id={bookMarkId}>
                x
              </button>
            )}
          </div>
        </article>
      </li>
    </>
  );
};
export default MetroFeed;
