import { memo, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { onError } from '../util/on-error';
import useQuery from '../util/url-query-parser';
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

  // TODO: 노선이 중복되는 정류소를 지나가는지 체크하기 위한 임시 함수
  // const chkOverlap = stationList => {
  //   for (let i in stationList) {
  //     let chk = stationList[i].stationId;
  //     let temp = 0;
  //     let result = stationList.some((station, index) => {
  //       if (index === Number(i)) return false;
  //       temp = station;
  //       return station.stationId === chk;
  //     });
  //     if (result) {
  //       console.log('===============================================================================================');
  //       console.log(`${result}: ${stationList[i].stationSeq}번째 정류장과 ${temp.stationSeq}번째 정류장이 중복됩니다.`);
  //       console.log(`${stationList[i].stationSeq}번 정류장 정보:`, stationList[i]);
  //       console.log(`${temp.stationSeq}번 정류장 정보:`, temp);
  //     }
  //   }
  // };

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
    const { stationSeq } = station;
    const direction = getDirection(stationSeq);

    if (isChecked) {
      // 즐겨찾기 추가
      return bmGroupService.createBookMark({ bmGroupId, ...info, ...station, direction });
    }

    if (bookMarkId) {
      // 즐겨찾기 제거
      return bmGroupService.deleteBookMark(bmGroupId, bookMarkId);
    }
    return;

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
              <Station key={station.stationId} station={station} onBookMarkClick={onBookMarkClick} />
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
