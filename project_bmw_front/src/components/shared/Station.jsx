const Station = ({ station, onBookMarkClick }) => {
  const { stationId, stationName, stationSeq, turnYn } = station;

  const textWrap = stationName => {
    if (!stationName) return '';
    return stationName.length > 18 //
      ? stationName.slice(0, 18) + '...'
      : stationName;
  };

  return (
    <>
      <li className={turnYn === 'Y' ? 'station turnY' : 'station'}>
        <article className="station-container">
          <div className="station-left">
            <span>{turnYn === 'Y' ? '회차' : stationSeq}</span>
          </div>
          <div className="station-main">
            <p>
              <span className="station-main-name">{textWrap(stationName)}</span>
              <span className="station-main-id">{stationId}</span>
            </p>
          </div>
          <div className="station-right">
            <span onClick={onBookMarkClick} data-station-seq={stationSeq}>
              <svg
                viewBox="0 0 24 24" //
                preserveAspectRatio="xMidYMid meet"
                focusable="false"
                className="style-scope book-mark-icon"
              >
                <g className="style-scope yt-icon">
                  <path d="M22,13h-4v4h-2v-4h-4v-2h4V7h2v4h4V13z M14,7H2v1h12V7z M2,12h8v-1H2V12z M2,16h8v-1H2V16z" className="style-scope yt-icon"></path>
                </g>
              </svg>
            </span>
          </div>
        </article>
      </li>
    </>
  );
};

export default Station;
