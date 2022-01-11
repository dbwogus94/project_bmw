import React, { memo } from 'react';
import Avatar from './Avatar';

const BMCard = memo(({ bookMark, onBusNameClick, onStationNameClick }) => {
  const {
    // bookMarkId, checkColumn, routeId, stationSeq, stationId, type
    label,
    routeName,
    stationName,
    direction,
  } = bookMark;

  const time = {
    server_time: '12시 10분',
    first_time: '10분',
    first_text: 'xxx 에서 출발',
    second_time: '15분',
    second_text: 'xxx 에서 출발',
  };

  return (
    <li className="tweet">
      <article className="tweet-container">
        <Avatar label={label} />
        <div className="tweet-body">
          <div className="tweet-top-div">
            <div className="tweet-top-main">
              <span className="tweet-name" onClick={() => onBusNameClick(bookMark)}>
                {routeName}
              </span>
            </div>
            <div className="tweet-top-side">
              <span className="tweet-username" onClick={() => onStationNameClick(bookMark)}>
                @{stationName}
              </span>
              <p>
                <span className="tweet-date">{direction}</span>
                <span className="tweet-date"> · {time.server_time} 기준</span>
              </p>
            </div>
          </div>
          <div className="tweet-bottom-div">
            <p>
              <span className="tweet-feed-time">{time.first_time}</span>
              <span className="tweet-feed-text">{time.first_text}</span>
            </p>
            <p>
              <span className="tweet-feed-time">{time.second_time}</span>
              <span className="tweet-feed-text">{time.second_text}</span>
            </p>
          </div>
        </div>
      </article>
      {/* {owner && (
        <div className="tweet-action">
          <button className="tweet-action-btn" onClick={() => onDelete(id)}>
            x
          </button>
          <button className="tweet-action-btn" onClick={() => setEditing(true)}>
            ✎
          </button>
        </div>
      )} */}
    </li>
  );
});
export default BMCard;
