import React, { memo, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Banner from './Banner';
import SelectBMGroup from './SelectBMGroup';
import BMCard from './BMCard';
import { onError } from '../util/on-error';
import Spinner from './Spinner';

const BMCards = memo(({ bmGroupService, busService }) => {
  const [bookMarks, setBookMarks] = useState([]);
  const [bmGroups, setBmGroups] = useState([]);
  const [bmGroupId, setBmGroupId] = useState(0);
  const [spinnerActive, setSpinnerActive] = useState(false);
  const [reloadCnt, setReloadCnt] = useState(0);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setSpinnerActive(true);
    bmGroupService
      .getBmGroups()
      .then(bmGroups => {
        // localStorage에 select된 그룹 있는지 확인
        const getBmGroupId = localStorage.getItem('MyBM_bmGroupId') //
          ? Number(localStorage.getItem('MyBM_bmGroupId'))
          : null;
        const bmGroupId = !!bmGroups.find(bmGroup => bmGroup.bmGroupId === getBmGroupId) //
          ? getBmGroupId
          : bmGroups[0].bmGroupId;
        setBmGroupId(bmGroupId);
        setBmGroups([...bmGroups]);
      })
      .catch(err => {
        onError(err, setError);
        setSpinnerActive(false);
      });
    return () => {
      // 컴포넌트 unmount시 호출
      setSpinnerActive(false);
    };
  }, [bmGroupService]);

  useEffect(() => {
    setSpinnerActive(true);
    // 그룹리스트가 조회되어 값이 있는 경우만 실행
    return bmGroupId === 0
      ? setSpinnerActive(false)
      : bmGroupService
          // 1. 그룹ID에 속한 북마크 리스트 조회
          .getGroupById(bmGroupId, true)
          .then(async bmGroup => {
            const { bookMarks } = bmGroup;
            // 2. 조회된 전체 북마크 도착 정보 조회
            return Promise.all(bookMarks.map(bookMark => busService.getArrivalByBookMark(bookMark))) //
              .then(bookMarks => {
                // 3. 도착 시간 빠른 순으로 정렬
                bookMarks.sort((a, b) => a.arrival.firstTime - b.arrival.firstTime);
                return setBookMarks([...bookMarks]);
              });
          })
          .catch(err => onError(err, setError))
          .finally(() => setSpinnerActive(false));
  }, [bmGroupService, busService, bmGroupId, reloadCnt]);

  // 정류장 클릭, TODO: API 정해지면 API URL 적용
  const onUsernameClick = bookMark => {
    // return bookMark.label === 'B' //
    //   ? navigate(`/stop/${bookMark.stationId}`) // 버스 정류소
    //   : navigate(`/stop/${bookMark.stationId}`); // 지하철 노선
  };

  const onNameClick = bookMark => {
    const { label, routeId, type } = bookMark;
    return label === 'B'
      ? navigate(`/buses/${routeId}/stations?type=${type}`) // 버스 id로 버스 정보
      : navigate(`/metro/${routeId}`); // 지하철 id로 역정보
  };

  // 그룹 select box 변경 이벤트
  const onGroupChange = async value => {
    const selectedId = value.bmGroupId;
    if (selectedId === bmGroupId) return false;
    localStorage.setItem('MyBM_bmGroupId', selectedId);
    setBmGroupId(selectedId);
  };

  // 새로고침
  const onButtonClick1 = () => {
    const reload = reloadCnt + 1;
    setReloadCnt(reload);
  };

  // 수정하기
  const onButtonClick2 = () => {
    return navigate(`/bmgroups`);
  };

  return (
    <>
      {bmGroups && bmGroups.length !== 0 && (
        <SelectBMGroup //
          firstButton="새로고침"
          onFirstButtonClick={onButtonClick1}
          secondButton="수정하기"
          onSecondButtonClick={onButtonClick2}
          onGroupChange={onGroupChange}
          bmGroups={bmGroups}
          selected={bmGroupId}
          edit={false}
        />
      )}

      {!spinnerActive && error && <Banner text={error} isAlert={true} transient={true} />}

      {!spinnerActive && bookMarks.length === 0 && <p className="tweets-empty">아직 추가된 BM이 없습니다.</p>}

      {spinnerActive && Spinner()}

      {!spinnerActive && bookMarks && bookMarks.length !== 0 && (
        <ul className="tweets">
          {bookMarks.map(bookMark => (
            <BMCard
              key={bookMark.bookMarkId} //
              bookMark={bookMark}
              onBusNameClick={onNameClick}
              onStationNameClick={onUsernameClick}
            />
          ))}
        </ul>
      )}
    </>
  );
});

export default BMCards;
