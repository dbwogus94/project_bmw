import { memo, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { onError } from '../../util/on-error';
import MetroFeed from '../metro/MetroFeed';
import Banner from '../shared/Banner';
import FeedHeader from '../shared/FeedHeader';
import SearchForm from '../shared/SearchForm';
import Spinner from '../shared/Spinner';

const MetroSearch = memo(({ metroService, button }) => {
  const [metros, setMetros] = useState([]);
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
      ? setMetros(JSON.parse(window.localStorage.getItem('BMSearchResult')).metros)
      : setIsEmpty(false);
  }, []);
  // 2. localStorage 값 저장 (**bmList의 값이 변경되면 실행)
  useEffect(() => {
    return metros.length !== 0 //
      ? window.localStorage.setItem('BMSearchResult', JSON.stringify({ metros }))
      : window.localStorage.removeItem('BMSearchResult');
    // TODO: A cross-origin error was thrown. 방지를 위해 JsonString로 변환하여 저장
  }, [metros]);

  const onSubmit = async event => {
    event.preventDefault(); // 이벤트 전파 막기
    setSpinnerActive(true);
    metroService
      .search(event.target[0].value)
      .then(metros => {
        setMetros([...metros]);
        // 결과 없음 문구 활성화 여부
        return metros.length === 0 //
          ? setIsEmpty(true) // 활성화
          : setIsEmpty(false); // 비활성화
      })
      .catch(err => {
        /* 조회 실패시 */
        // 1. react가 관리하는 bmList에 빈 배열 전달
        setMetros([]);
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
    navigate(`${pathname}/${routeId}/stations`);
  };

  /* =================== Make Component =================== */

  const makeFeeds = metros => {
    const result = [];
    for (let metro of metros) {
      const { routeId, metroName, metroStations } = metro;
      result.push(<FeedHeader key={routeId} label={metroName}></FeedHeader>);

      for (let station of metroStations) {
        result.push(makeMetroFeed({ ...station, routeId, metroName }));
      }
    }
    return result;

    // 자하철 feed 생성
    function makeMetroFeed(station) {
      const { stationId } = station;
      return (
        <MetroFeed //
          key={stationId}
          metro={station}
          onfeedClick={onBmFeedClick}
          info={false}
          edit={false}
        ></MetroFeed>
      );
    }
  };

  return (
    <>
      <SearchForm //
        metroService={metroService}
        button={button}
        onSubmit={onSubmit}
        onError={onError}
        // 한글 +숫자 + 영어 + '-' 가능
        regExp={/[~!@#$%^&*()_+|<>?:{}/\\""''``,.;= ]/}
        // 숫자 + 영어 + '-' 가능
        // regExp={/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|~!@#$%^&*()_+|<>?:{}/\\""''``,.;=]/}
      />
      {error && <Banner text={error} isAlert={true} transient={true} />}
      {spinnerActive ? (
        Spinner()
      ) : (
        <>
          {isEmpty && <p className="tweets-empty">일치하는 노선이 없습니다.</p>}
          <ul className="feeds">{makeFeeds(metros)}</ul>
        </>
      )}
    </>
  );
});

export default MetroSearch;
