import { memo, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useQuery from '../util/url-query-parser';
import Banner from './Banner';
import Spinner from './Spinner';
import Station from './Station';

const Stations = memo(({ service }) => {
  const [stations, setStations] = useState([]);
  const [info, setInfo] = useState({});
  const [error, setError] = useState('');
  const { routeId } = useParams();
  const query = useQuery();
  const type = query.get('type');

  useEffect(() => {
    service
      .searchStationsByRouteId(routeId, type)
      .then(res => {
        const { info, stationList } = res;
        setInfo(info);
        setStations(stationList);
        return;
      })
      .catch(onError);
  }, [service, routeId, type]);

  // 즐겨찾기
  const onLikeClick = event => {};

  // TODO: 공통으로 빼서 외부에서 넣자
  const onError = error => {
    setError(error.toString());
    setTimeout(() => {
      setError('');
    }, 3000);
  };

  const makeInfo = info => {
    return info.bmType === 'B' //
      ? makeBusInfo(info)
      : makeMetroInfo(info);
  };

  const makeBusInfo = info => {
    const {
      routeName,
      routeTypeName,
      districtName,
      startStationName, //
      endStationName,
    } = info;
    return (
      <>
        <p>
          {districtName} {routeTypeName}
        </p>
        <h2>{routeName}</h2>
        <p>
          {startStationName} ↔ {endStationName}
        </p>
      </>
    );
  };

  const makeMetroInfo = info => {};

  return (
    <>
      {error && <Banner text={error} isAlert={true} transient={true} />}
      {stations.length === 0 ? (
        Spinner()
      ) : (
        <>
          <div className="bm-info">{makeInfo(info)}</div>
          <ul className="stations">
            {stations.map(station => (
              <Station key={station.stationId} station={station} onLikeClick={onLikeClick} />
            ))}
          </ul>
        </>
      )}
    </>
  );
});

export default Stations;
