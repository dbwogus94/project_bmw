import React from 'react';
import { Link } from 'react-router-dom';
import { useRouteMatch } from 'react-router-dom/cjs/react-router-dom.min';

const BMFeed = ({ bm, onfeedClick }) => {
  const { routeId, routeName, routeTypeName, type } = bm;
  const { path } = useRouteMatch();

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
            <Link to={`${path}/${routeId}?type=${type}`}>
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
