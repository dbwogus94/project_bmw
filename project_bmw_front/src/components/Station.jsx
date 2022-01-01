const Station = ({ station, onLikeClick }) => {
  const { arsId, stationId, stationName, stationSeq, turnYn, type } = station;
  const like = false;

  const textWrap = stationName => {
    if (!stationName) return '';
    return stationName.length > 16 //
      ? stationName.slice(0, 15) + '...'
      : stationName;
  };

  return (
    <>
      <li className={turnYn === 'N' ? 'station' : 'station turnY'}>
        <article className="station-container">
          <div className="station-left">
            <span>{turnYn === 'N' ? stationSeq : '회차'}</span>
          </div>
          <div className="station-main">
            <p>
              <span className="station-main-name">{textWrap(stationName)}</span>
              <span className="station-main-id">{type === 'gyeonggi' ? arsId : stationId}</span>
            </p>
          </div>
          <div className="station-right">
            <span onClick={onLikeClick} data-station-seq={stationSeq}>
              {like ? '♥' : '♡'}
            </span>
          </div>
        </article>
      </li>
    </>
  );
};

export default Station;
