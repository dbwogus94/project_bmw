import { memo, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { onError } from '../../util/on-error';
import useQuery from '../../util/url-query-parser';
import Banner from './Banner';
import BookMarkModal from './model/BookMarkModal';
import Spinner from './Spinner';
import Station from './Station';

const Stations = memo(({ service, bmGroupService }) => {
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
        const { info, stations } = res;
        setInfo(info);
        setStations(stations);
        return;
      })
      .catch(err => onError(err, setError, true));
  }, [service, routeId, type]);

  // 즐겨찾기 모달 오픈
  const onBookMarkClick = event => {
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
  const onBookMarkChange = (isChecked, bmGroupId, bookMarkId) => {
    if (isChecked) {
      // 즐겨찾기 추가
      return bmGroupService.createBookMark({ bmGroupId, ...info, ...station });
    }

    if (bookMarkId) {
      // 즐겨찾기 제거
      return bmGroupService.deleteBookMark(bmGroupId, bookMarkId);
    }
    return !isChecked;
  };

  /* =================== Make Component =================== */
  const makeInfo = info => {
    return info.label === 'B' //
      ? makeBusInfo(info)
      : makeMetroInfo(info);
  };

  // label(B): 버스 정보 생성
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

  // label(M): 지하철 정보 생성
  const makeMetroInfo = info => {
    const { metroName, startStationName, endStationName } = info;
    return (
      <>
        <h2>{metroName}</h2>
        <p>
          {startStationName} ↔ {endStationName}
        </p>
      </>
    );
  };

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
              <Station key={station.stationSeq} station={station} onBookMarkClick={onBookMarkClick} />
            ))}
          </ul>
        </>
      )}
      {isModalOpen && (
        <BookMarkModal
          bmGroupService={bmGroupService} //
          onBookMarkChange={onBookMarkChange}
          onClose={closeModal}
          isOpen={isModalOpen}
          station={station}
        ></BookMarkModal>
      )}
    </>
  );
});

export default Stations;
