import React, { memo, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
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
  const history = useHistory();

  useEffect(() => {
    setSpinnerActive(true);
    bmGroupService
      .getBmGroups()
      .then(bmGroups => {
        setBmGroups([...bmGroups]);
        const bmGroupId = localStorage.getItem('MyBM_bmGroupId') //
          ? Number(localStorage.getItem('MyBM_bmGroupId'))
          : bmGroups[0].bmGroupId;
        setBmGroupId(bmGroupId);
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
    // 그룹리스트가 조회되어 값이 있는 경우만 실행
    return bmGroupId === 0
      ? false
      : // 1. 그룹ID에 속한 북마크 리스트 조회
        bmGroupService
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
    //   ? history.push(`/stop/${bookMark.stationId}`) // 버스 정류소
    //   : history.push(`/stop/${bookMark.stationId}`); // 지하철 노선
  };

  const onNameClick = bookMark => {
    const { label, routeId, type } = bookMark;
    return label === 'B'
      ? history.push(`/buses/${routeId}/stations?type=${type}`) // 버스 id로 버스 정보
      : history.push(`/metro/${routeId}`); // 지하철 id로 역정보
  };

  // 그룹 select box 변경 이벤트
  const onGroupChange = async event => {
    const bmGroupId = event.target.value;
    localStorage.setItem('MyBM_bmGroupId', bmGroupId);
    setBmGroupId(bmGroupId);
    setSpinnerActive(true);
  };

  // 새로고침
  const onButtonClick1 = () => {
    const reload = reloadCnt + 1;
    setReloadCnt(reload);
    setSpinnerActive(true);
  };

  // 수정하기
  const onButtonClick2 = () => {
    return history.push(`/bmgroup`);
  };

  return (
    <>
      <SelectBMGroup //
        button1="새로고침"
        onButtonClick1={onButtonClick1}
        button2="수정하기"
        onButtonClick2={onButtonClick2}
        onGroupChange={onGroupChange}
        itemList={bmGroups}
        selectedItem={bmGroupId}
      />

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
