import { memo, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Banner from './Banner';
import BMFeed from './BMFeed';
import FeedHeader from './FeedHeader';
import SearchForm from './SearchForm';
import Spinner from './Spinner';

const BMSearch = memo(({ service, button }) => {
  const [bmList, setbmList] = useState([]);
  // Spinner 활성화 여부
  const [spinnerActive, setSpinnerActive] = useState(false);
  // true = localStorage 없음
  const [isEmpty, setIsEmpty] = useState(false);
  // http 에러 헨들러
  const [error, setError] = useState('');
  const history = useHistory();

  /* 조회 상태 유지: useEffect + localStorage */
  // 1. localStorage 값 가져오기 (**빈 배열을 전달하면 의존하는 값이 없어, 최초 화면에 렌더링 때만 실행)
  useEffect(() => {
    return window.localStorage.getItem('BMSearchResult') //
      ? setbmList(JSON.parse(window.localStorage.getItem('BMSearchResult')).bmList)
      : setIsEmpty(true);
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
        setSpinnerActive(false);
        // {[],[]..} to []
        return setbmList([...Object.values(result).flat()]);
      })
      .catch(onError);
  };

  // 정류장 리스트 페이지 이동
  const onfeedClick = event => {
    const routeId = event.currentTarget.dataset.routeId;
    const type = event.currentTarget.dataset.type;
    history.push(`/bus/${type}/${routeId}/stations`);
  };

  // TODO: 공통으로 빼서 외부에서 넣자
  const onError = error => {
    setError(error.toString());
    setSpinnerActive(false);
    setTimeout(() => {
      setError('');
    }, 3000);
  };

  const makeFeeds = bmList => {
    const result = [];
    let flag = '';

    for (let bm of bmList) {
      const { routeId, type } = bm;
      if (flag !== type) {
        flag = type;
        result.push(<FeedHeader label={bm.districtName}></FeedHeader>);
      }

      result.push(
        <>
          <BMFeed //
            key={type === 'gyeonggi' ? 'G' + routeId : 'S' + routeId}
            bm={bm}
            onfeedClick={onfeedClick}
            edit={false}
          ></BMFeed>
        </>
      );
    }

    return result;
  };

  return (
    <>
      <SearchForm //
        service={service}
        button={button}
        onSubmit={onSubmit}
        onError={onError}
      />
      {error && <Banner text={error} isAlert={true} transient={true} />}
      {spinnerActive ? (
        Spinner()
      ) : (
        <>
          {!isEmpty && bmList.length === 0 && <p className="tweets-empty">일치하는 노선이 없습니다.</p>}
          <ul className="feeds">{makeFeeds(bmList)}</ul>
        </>
      )}
    </>
  );
});

export default BMSearch;
