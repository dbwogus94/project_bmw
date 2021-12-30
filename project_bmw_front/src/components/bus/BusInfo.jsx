import { memo, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import Banner from '../Banner';

const BusInfo = memo(({ service }) => {
  const [info, setInfo] = useState({});
  const [error, setError] = useState('');
  const history = useHistory();
  const { type, routeId } = useParams();

  useEffect(() => {
    service
      .searchInfoByRouteId(routeId, type)
      .then(res => setInfo(res.info))
      .catch(onError);
  }, [service, routeId, type]);

  // TODO: 공통으로 빼서 외부에서 넣자
  const onError = error => {
    setError(error.toString());
    setTimeout(() => {
      setError('');
    }, 3000);
  };

  const onBackClick = () => {
    history.goBack();
  };

  const onHomeClick = () => {
    history.push('/');
  };

  const onStationClick = () => {
    history.push(`/bus/${type}/${routeId}/stations`);
  };

  const makeInfo = info => {
    const {
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
          <h2>{info.routeName}</h2>
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
      </>
    );
  };

  return (
    <>
      {error && <Banner text={error} isAlert={true} transient={true} />}
      <ul className="info">{makeInfo(info)}</ul>
      <div className="left-btn">
        <span onClick={onBackClick}>◀</span>
      </div>
      <div className="middle-btn">
        <span onClick={onHomeClick}>home</span>
      </div>
      <div className="right-btn">
        <span onClick={onStationClick}>경유지</span>
      </div>
    </>
  );
});

export default BusInfo;
