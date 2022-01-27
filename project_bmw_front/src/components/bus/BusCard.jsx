import React, { memo } from 'react';
import Avatar from '../shared/Avatar';

const BusCard = memo(({ bookMark, onBusNameClick, onStationNameClick }) => {
  const {
    // bookMarkId, checkColumn, routeId, stationSeq, stationId, type
    label,
    routeName,
    stationName,
    direction,
    arrival,
  } = bookMark;

  const {
    serverTime, //
    firstTime,
    firstLocation,
    // isFirstActive,
    firstState, // '운행중' | '곧 도착' | '출발대기'  | '운행종료'
    secondTime,
    secondLocation,
    isSecondActive,
    secondState,
  } = arrival;

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
                <span className="tweet-date">{`${direction} 방향`}</span>
                <span className="tweet-date"> · {serverTime} 기준</span>
              </p>
            </div>
          </div>
          <div className="tweet-bottom-div">
            <p>
              {firstState === '운행중' && ( //
                <>
                  <span className="tweet-feed-time">{`${firstTime}분 후`}</span>
                  <span className="tweet-feed-text">{`${firstLocation}전 정류장 출발`}</span>
                </>
              )}
              {firstState === '곧 도착' && ( //
                <>
                  <span className="tweet-feed-time">{firstState}</span>
                  <span className="tweet-feed-text">{`${firstLocation}전 정류장 출발`}</span>
                </>
              )}
              {firstState === '출발대기' && ( //
                <>
                  <span className="tweet-feed-time">{firstState}</span>
                  <span className="tweet-feed-text">{'도착정보 없음'}</span>
                </>
              )}
              {firstState === '운행종료' && ( //
                <>
                  <span className="tweet-feed-time">{firstState}</span>
                  <span className="tweet-feed-text">{'도착정보 없음'}</span>
                </>
              )}
            </p>
            <p>
              {isSecondActive &&
                secondState === '운행중' && ( //
                  <>
                    <span className="tweet-feed-time">{`${secondTime}분 후`}</span>
                    <span className="tweet-feed-text">{`${secondLocation}전 정류장 출발`}</span>
                  </>
                )}
              {isSecondActive &&
                secondState === '곧 도착' && ( //
                  <>
                    <span className="tweet-feed-time">{secondState}</span>
                    <span className="tweet-feed-text">{`${secondLocation}전 정류장 출발`}</span>
                  </>
                )}
              {isSecondActive &&
                secondState === '출발대기' && ( //
                  <>
                    <span className="tweet-feed-time">{secondState}</span>
                    <span className="tweet-feed-text">{'도착정보 없음'}</span>
                  </>
                )}
              {isSecondActive &&
                secondState === '운행종료' && ( //
                  <>
                    <span className="tweet-feed-time">{secondState}</span>
                    <span className="tweet-feed-text">{'도착정보 없음'}</span>
                  </>
                )}
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
export default BusCard;
