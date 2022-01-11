import React, { memo, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Banner from './Banner';
import SelectBMGroup from './SelectBMGroup';
import BMCard from './BMCard';
import { onError } from '../util/on-error';
import Spinner from './Spinner';

const BMCards = memo(({ bmGroupService }) => {
  const [bookMarks, setBookMarks] = useState([]);
  const [bmGroups, setBmGroups] = useState([]);
  const [bmGroupId, setBmGroupId] = useState(0);
  const [spinnerActive, setSpinnerActive] = useState(false);
  const [error, setError] = useState('');
  const history = useHistory();

  useEffect(() => {
    setSpinnerActive(true);
    bmGroupService
      .getBmGroups()
      .then(bmGroups => {
        const { bmGroupId } = bmGroups[0];
        setBmGroups([...bmGroups]);
        setBmGroupId(bmGroupId);
        return bmGroupId;
      })
      .then(bmGroupId => bmGroupService.getGroupById(bmGroupId, true))
      .then(bmGroup => {
        setSpinnerActive(false);
        setBookMarks(bmGroup.bookMarks);
      })
      .catch(onError);
  }, [bmGroupService]);

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
    setBmGroupId(bmGroupId);
    getBookMarks(bmGroupId);
  };

  // 새로고침
  const onButtonClick1 = () => {
    getBookMarks(bmGroupId);
  };

  const getBookMarks = async bmGroupId => {
    setSpinnerActive(true);
    bmGroupService
      .getGroupById(bmGroupId, true)
      .then(bmGroup => {
        const { bookMarks } = bmGroup;
        setSpinnerActive(false);
        setBookMarks([...bookMarks]);
        // TODO: 도착정보 조회 API 완료되면 => 모든 북마크 도착 정보 조회
        // Promise.all(bookMarks)
      })
      .catch(err => onError(err, setError));
  };

  // 수정하기
  const onButtonClick2 = tweet => {
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
        bmGroups={bmGroups}
      />
      {error && <Banner text={error} isAlert={true} transient={true} />}
      {bookMarks.length === 0 && <p className="tweets-empty">아직 추가된 BM이 없습니다.</p>}

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
