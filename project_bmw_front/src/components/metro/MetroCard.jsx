import React, { memo } from 'react';
import Avatar from '../shared/Avatar';

const MetroCard = memo(({ bookMark, onMetroNameClick, onStationNameClick }) => {
  const {
    // bookMarkId, checkColumn, routeId, stationSeq, stationId, type
    label,
    routeName,
    stationName,
    // direction,
    arrival,
  } = bookMark;

  const {
    routeId, //
    // stationId,
    inOutTag,
    serverTime,
    firstTime,
    // isFirstActive,
    firstState,
    firstDestStationName,
    isFirstExpress,
    secondTime,
    isSecondActive,
    secondState,
    secondDestStationName,
    isSecondExpress,
  } = arrival;

  return (
    <li className="tweet">
      <article className="tweet-container">
        <Avatar label={label} />
        <div className="tweet-body">
          <div className="tweet-top-div">
            <div className="tweet-top-main">
              <span className="tweet-name" onClick={() => onMetroNameClick(bookMark)}>
                {routeName}
              </span>
            </div>
            <div className="tweet-top-side">
              <span className="tweet-username" onClick={() => onStationNameClick(bookMark)}>
                @{stationName}
              </span>
              <p>
                {Number(routeId) !== 2 && <span className="tweet-date">{inOutTag === '1' ? '상행' : '하행'}</span>}
                {Number(routeId) === 2 && <span className="tweet-date">{inOutTag === '1' ? '외선' : '내선'}</span>}
                <span className="tweet-date"> · {serverTime} 기준</span>
              </p>
            </div>
          </div>
          <div className="tweet-bottom-div">
            <p>
              {firstState === '운행중' && ( //
                <>
                  <span className="tweet-feed-time">{Number(firstTime) === 0 ? '곧 도착' : `${firstTime}분 후`}</span>
                  <span className="tweet-feed-text">
                    {isFirstExpress ? '(급)' : ''}
                    {`${firstDestStationName}행 열차`}
                  </span>
                </>
              )}
              {firstState === '지원예정' && ( //
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
                    <span className="tweet-feed-time">{Number(secondTime) === 0 ? '곧 도착' : `${secondTime}분 후`}</span>
                    <span className="tweet-feed-text">
                      {isSecondExpress ? '(급)' : ''}
                      {`${secondDestStationName}행 열차`}
                    </span>
                  </>
                )}
              {isSecondActive &&
                secondState === '지원예정' && ( //
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
export default MetroCard;
