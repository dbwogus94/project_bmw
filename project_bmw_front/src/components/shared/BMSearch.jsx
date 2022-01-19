import { memo, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { onError } from '../../util/on-error';
import BusFeed from '../bus/BusFeed';
import MetroFeed from '../metro/MetroFeed';
import StationFeed from '../station/StationFeed';
import Banner from './Banner';
import FeedHeader from './FeedHeader';
import SearchForm from './SearchForm';
import Spinner from './Spinner';
import uuid from 'react-uuid';

const BMSearch = memo(({ service, button }) => {
  const [bmList, setbmList] = useState([]);
  // Spinner 활성화 여부
  const [spinnerActive, setSpinnerActive] = useState(false);
  // localStorage 저장
  const [isEmpty, setIsEmpty] = useState(false);
  // http 에러 헨들러
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { pathname } = useLocation();

  /* 조회 상태 유지: useEffect + localStorage */
  // 1. localStorage 값 가져오기 (**빈 배열을 전달하면 의존하는 값이 없어, 최초 화면에 렌더링 때만 실행)
  useEffect(() => {
    return window.localStorage.getItem('BMSearchResult') //
      ? setbmList(JSON.parse(window.localStorage.getItem('BMSearchResult')).bmList)
      : setIsEmpty(false);
  }, []);
  // 2. localStorage 값 저장 (**bmList의 값이 변경되면 실행)
  useEffect(() => {
    return bmList.length !== 0 //
      ? window.localStorage.setItem('BMSearchResult', JSON.stringify({ bmList }))
      : window.localStorage.removeItem('BMSearchResult');
    // TODO: A cross-origin error was thrown. 방지를 위해 JsonString로 변환하여 저장
  }, [bmList]);

  const onSubmit = async event => {
    event.preventDefault(); // 이벤트 전파 막기
    setSpinnerActive(true);
    service
      .search(event.target[0].value)
      .then(result => {
        /* 조회 성공시 */
        // 1. 결과 배열로 변환
        const bmList = Object.values(result).flat(); // {[],[]..} to []
        // 2. react가 관리하는 bmList에 결과 세팅
        setbmList([...bmList]);
        // 3. 결과 없음 문구 활성화 여부
        return bmList.length === 0 //
          ? setIsEmpty(true) // 활성화
          : setIsEmpty(false); // 비활성화
      })
      .catch(err => {
        /* 조회 실패시 */
        // 1. react가 관리하는 bmList에 빈 배열 전달
        setbmList([]);
        // 2. 문구 비활성화
        setIsEmpty(false);
        // 3. 에러 헨들링
        return onError(err, setError);
      })
      .finally(() => setSpinnerActive(false));
  };

  // 버스 또는 지하철 클릭 => 정류장 리스트 페이지 이동
  const onBmFeedClick = event => {
    const routeId = event.currentTarget.dataset.routeId;
    const type = event.currentTarget.dataset.type;
    navigate(`${pathname}/${routeId}/stations?type=${type}`);
  };

  // 정류소 클릭
  const onSatationClick = event => {
    const stationId = event.currentTarget.dataset.stationId;
    const type = event.currentTarget.dataset.type;
    const arsId = event.currentTarget.dataset.arsId;

    const selected = bmList.find(bm => bm.stationId === Number(stationId));
    const { stationName, districtCd, districtName, regionName, label } = selected;

    const url =
      type === 'gyeonggi' //
        ? `${pathname}/${stationId}/buses?type=${type}`
        : `${pathname}/${arsId}/buses?type=${type}`; // 서울시 API의 경우 정류소 고유번호(arsId)를 사용

    navigate(url, {
      state: { stationId, stationName, arsId, districtCd, districtName, regionName, label, type },
    });
  };

  /* =================== Make Component =================== */

  const makeFeeds = bmList => {
    const result = [];
    let flag = '';

    for (let bm of bmList) {
      const { label, type } = bm;
      if (flag !== type) {
        flag = type;
        result.push(<FeedHeader key={uuid()} label={bm.districtName}></FeedHeader>);
      }
      if (label === 'B') result.push(makeBusFeed(bm));
      if (label === 'M') result.push(makeMetroFeed(bm));
      if (label === 'S') result.push(makeStationFeed(bm));
    }
    return result;

    // 버스 feed 생성
    function makeBusFeed(bus) {
      const { routeId, type } = bus;
      return (
        <BusFeed //
          key={type === 'gyeonggi' ? 'G' + routeId : 'S' + routeId}
          bus={bus}
          onfeedClick={onBmFeedClick}
          info={true}
          edit={false}
        ></BusFeed>
      );
    }

    // 자하철 feed 생성
    function makeMetroFeed(metro) {
      const { routeId, type } = metro;
      return (
        <MetroFeed //
          key={type === 'gyeonggi' ? 'G' + routeId : 'S' + routeId}
          metro={metro}
          onfeedClick={onBmFeedClick}
          info={true}
          edit={false}
        ></MetroFeed>
      );
    }

    // 정류소 feed 생성
    function makeStationFeed(sation) {
      const { stationId, type } = sation;
      return (
        <StationFeed //
          key={type === 'gyeonggi' ? 'G' + stationId : 'S' + stationId}
          sation={sation}
          onfeedClick={onSatationClick}
          info={false}
        ></StationFeed>
      );
    }
  };

  return (
    <>
      <SearchForm //
        service={service}
        button={button}
        onSubmit={onSubmit}
        onError={onError}
        // 한글 +숫자 + 영어 + '-' 가능
        regExp={/[~!@#$%^&*()_+|<>?:{}/\\""''``,.;=]/}
        // 숫자 + 영어 + '-' 가능
        // regExp={/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|~!@#$%^&*()_+|<>?:{}/\\""''``,.;=]/}
      />
      {error && <Banner text={error} isAlert={true} transient={true} />}
      {spinnerActive ? (
        Spinner()
      ) : (
        <>
          {isEmpty && <p className="tweets-empty">일치하는 노선이 없습니다.</p>}
          <ul className="feeds">{makeFeeds(bmList)}</ul>
        </>
      )}
    </>
  );
});

export default BMSearch;
