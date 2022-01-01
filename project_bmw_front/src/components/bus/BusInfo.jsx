import { memo, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { onError } from '../../util/on-error';
import useQuery from '../../util/url-query-parser';
import Banner from '../Banner';
import Spinner from '../Spinner';

const BusInfo = memo(({ service }) => {
  const [info, setInfo] = useState({});
  const [error, setError] = useState('');
  const { routeId } = useParams();
  const query = useQuery();
  const type = query.get('type');

  useEffect(() => {
    service
      .searchInfoByRouteId(routeId, type)
      .then(res => setInfo(res.info))
      .catch(err => onError(err, setError, true));
  }, [service, routeId, type]);

  const makeInfo = info => {
    const {
      routeName,
      startStationName, //
      endStationName,
      routeTypeName,
      districtName,
      minTerm,
      maxTerm,
      companyName,
      companyTel,
      type,
      upFirstTime,
      upLastTime,
      downFirstTime,
      downLastTime,
      firstBusTm,
      lastBusTm,
      firstLowTm,
      lastLowTm,
    } = info;

    return (
      <>
        <li className="info-header">
          <h2>{routeName}</h2>
        </li>
        <li className="info-container">
          <h4>운행지역</h4>
          <p>
            {startStationName} ↔ {endStationName}
          </p>
          <p className="info-district">
            {districtName} {routeTypeName}
          </p>
        </li>
        <li className="info-container">
          <h4>운행시간</h4>
          <p>
            {type === 'gyeonggi' //
              ? `기점 ${upFirstTime} ~ ${upLastTime}`
              : `종점 ${firstBusTm} ~ ${lastBusTm}`}
          </p>
          <p>
            {type === 'gyeonggi' //
              ? `일반 ${downFirstTime} ~ ${downLastTime}`
              : `저상 ${firstLowTm} ~ ${lastLowTm}`}
          </p>
        </li>
        <li className="info-container">
          <h4>배차간격</h4>
          <p>{`${minTerm} ~ ${maxTerm}분`}</p>
        </li>
        <li className="info-container">
          <h4>운수업체</h4>
          <p>업체명: {companyName}</p>
          <p>Tel: {companyTel}</p>
        </li>
        <li className="info-container">
          <h4>경유지</h4>
          <p>
            <Link to={`/bus/${routeId}/stations?type=${type}`}>@{routeName} </Link>
            경유지 확인
          </p>
        </li>
      </>
    );
  };

  return (
    <>
      {error && <Banner text={error} isAlert={true} transient={true} />}
      {Object.keys(info).length === 0 ? (
        Spinner() //
      ) : (
        <ul className="info">{makeInfo(info)}</ul>
      )}
    </>
  );
});

export default BusInfo;
