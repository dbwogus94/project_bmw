import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import BusFeed from '../bus/BusFeed';
import Spinner from '../shared/Spinner';

const StationBusFeeds = ({ stationService }) => {
  const [busList, setBusList] = useState([]);
  const [spinnerActive, setSpinnerActive] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { stationId } = useParams();
  const { stationName, arsId, districtName, regionName, type } = location.state;

  useEffect(() => {
    setSpinnerActive(true);
    stationService
      .getBusList(stationId, type)
      .then(busList => {
        return setBusList([...busList]);
      })
      .catch(err => {
        window.alert('정류소에 정차하는 버스가 없습니다.');
        navigate(-1);
      })
      .finally(() => setSpinnerActive(false));
  }, [stationService, stationId, type, navigate]);

  // 버스 클릭 => 정류장 리스트 페이지 이동
  const onBusFeedClick = event => {
    const routeId = event.currentTarget.dataset.routeId;
    const type = event.currentTarget.dataset.type;
    navigate(`/buses/${routeId}/stations?type=${type}`);
  };

  return (
    <>
      {spinnerActive && Spinner()}
      {!spinnerActive && busList && busList.length !== 0 && (
        <>
          <div className="bm-info">
            <p>{regionName ? regionName : districtName}</p>
            <h2>{stationName}</h2>
            <p>
              정류소번호: {stationId} / 모바일번호: {arsId}
            </p>
          </div>
          <ul className="feeds">
            {busList.map(bus => {
              const { routeId } = bus;
              return (
                <BusFeed //
                  key={type === 'gyeonggi' ? 'G' + routeId : 'S' + routeId}
                  bus={bus}
                  onfeedClick={onBusFeedClick}
                  info={true}
                  edit={false}
                ></BusFeed>
              );
            })}
          </ul>
        </>
      )}
    </>
  );
};

export default StationBusFeeds;
