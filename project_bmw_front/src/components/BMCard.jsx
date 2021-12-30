import React, { memo } from 'react';
import Avatar from './Avatar';

const BMCard = memo(({ tweet, onUsernameClick, onNameClick }) => {
  const {
    label, //
    name,
    username,
    server_time,
    first_time,
    first_text,
    second_time,
    second_text,
    direction,
  } = tweet;

  return (
    <li className="tweet">
      <article className="tweet-container">
        <Avatar label={label} />
        <div className="tweet-body">
          <div className="tweet-top-div">
            <div className="tweet-top-main">
              <span className="tweet-name" onClick={() => onNameClick(tweet)}>
                {name}
              </span>
            </div>
            <div className="tweet-top-side">
              <span className="tweet-username" onClick={() => onUsernameClick(tweet)}>
                @{username}
              </span>
              <p>
                <span className="tweet-date">{direction}</span>
                <span className="tweet-date"> · {server_time} 기준</span>
              </p>
            </div>
          </div>
          <div className="tweet-bottom-div">
            <p>
              <span className="tweet-feed-time">{first_time}</span>
              <span className="tweet-feed-text">{first_text}</span>
            </p>
            <p>
              <span className="tweet-feed-time">{second_time}</span>
              <span className="tweet-feed-text">{second_text}</span>
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
