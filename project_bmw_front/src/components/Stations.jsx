import { memo, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { onError } from '../util/on-error';
import useQuery from '../util/url-query-parser';
import Banner from './Banner';
import LikeModal from './model/LikeModal';
import Spinner from './Spinner';
import Station from './Station';

const Stations = memo(({ service, tweetService }) => {
  const [stations, setStations] = useState([]);
  const [info, setInfo] = useState({});
  const [error, setError] = useState('');
  //
  const [station, setStation] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
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
      .catch(err => onError(err, setError, true));
  }, [service, routeId, type]);

  // 즐겨찾기 모달 오픈
  const onLikeClick = event => {
    const stationSeq = event.currentTarget.dataset.stationSeq;
    const station = stations.find(station => {
      return station.stationSeq === Number(stationSeq);
    });
    setStation(station);
    setIsModalOpen(true);
  };

  // 즐겨찾기 모달 닫기
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // 모달 체크박스에 전달할 이벤트
  const onUpdateLike = event => {
    // 체크된 그룹 id
    const bmGroupId = event.target.value;
    // 체크 여부
    const checked = event.target.checked;

    const { stationSeq, stationId } = station;
    const direction = getDirection(stationSeq);
    const { routeName } = info;

    if (!checked) {
      // 즐겨찾기 제거
      return tweetService
        .deleteLike({ bmGroupId, routeId, stationId })
        .then(() => {
          return true;
        })
        .catch(err => onError(err, setError, true));
    }
    // 즐겨찾기 추가
    return tweetService
      .insertLike({ bmGroupId, routeName, ...station, direction })
      .then()
      .catch(err => onError(err, setError, true));

    // 진행 방향 찾기
    function getDirection(selectSeq) {
      // 회차지 순번 찾기
      const { stationSeq } = stations.find(station => station.turnYn === 'Y');
      const { startStationName, endStationName } = info;
      // 회차지 >= 선택 정류장 순번
      return stationSeq >= selectSeq //
        ? endStationName
        : startStationName;
    }
  };

  /* make element */
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
      <LikeModal
        tweetService={tweetService} //
        onUpdateLike={onUpdateLike}
        isOpen={isModalOpen}
        onClose={closeModal}
        routeId={routeId}
        stationId={station.stationId}
      ></LikeModal>
    </>
  );
});

export default Stations;
