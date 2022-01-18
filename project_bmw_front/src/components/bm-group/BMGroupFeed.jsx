import React, { useEffect, useState } from 'react';

const BMGroupFeed = ({ bmGroup, onDeleteClick, edit }) => {
  const { bmGroupId, bmGroupName } = bmGroup;
  const [edited, setEdited] = useState(false);

  useEffect(() => {
    setEdited(edit);
  }, [edit]);

  return (
    <>
      <li className="feed">
        <article className="feed-container">
          <div className="feed-main">
            <p>
              <span className="feed-main-name">{bmGroupName}</span>
              <span className="feed-main-routeTypeName"></span>
            </p>
          </div>
          <div className="feed-info">
            {edited && (
              <button className="bm-group-delete-btn" onClick={onDeleteClick} data-bm-group-id={bmGroupId}>
                x
              </button>
            )}
          </div>
        </article>
      </li>
    </>
  );
};
export default BMGroupFeed;
