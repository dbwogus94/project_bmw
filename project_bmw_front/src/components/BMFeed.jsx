import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const BMFeed = ({ bm, onfeedClick, onDeleteClick, info, edit }) => {
  const { routeId, routeName, routeTypeName, type, bookMarkId } = bm;
  const [edited, setEdited] = useState(false);

  useEffect(() => {
    setEdited(edit);
  }, [edit]);

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
          <div className="feed-info">
            {info && (
              <Link to={`/buses/${routeId}?type=${type}`}>
                <img src="./img/info.png" alt="info Logo" className="feed-info-img" />
              </Link>
            )}
            {edited && (
              <button className="tweet-action-btn" onClick={onDeleteClick} data-book-mark-id={bookMarkId}>
                x
              </button>
            )}
          </div>
        </article>
      </li>
      {/* <div className="feed-bottom"></div> */}
    </>
  );
};
export default BMFeed;
