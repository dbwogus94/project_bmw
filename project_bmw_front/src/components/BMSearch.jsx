import { memo, useState } from 'react';
import Banner from './Banner';
import BMFeed from './BMFeed';
import FeedHeader from './FeedHeader';
import SearchForm from './SearchForm';

const BMSearch = memo(({ service, button, edit }) => {
  const [resultList, setResultBody] = useState({});
  const [error, setError] = useState('');

  // useEffect(() => {
  //   //
  // }, []);

  const onSubmit = async event => {
    // 이벤트 전파 막기
    event.preventDefault();
    service
      .search(event.target[0].value)
      .then(resultList => setResultBody({ ...resultList }))
      .catch(onError);
  };

  // 즐겨찾기
  const onLickClick = event => {
    // console.log(event);
  };
  // BM정보 페이지 이동
  const onInfoClick = event => {
    // console.log(event);
  };

  // TODO: 공통으로 빼서 외부에서 넣자
  const onError = error => {
    setError(error.toString());
    setTimeout(() => {
      setError('');
    }, 3000);
  };

  const makeFeeds = resultList => {
    let result = [];
    Object.keys(resultList).forEach(key => {
      const feed = resultList[key].map((bm, index) => {
        return index !== 0 ? ( //
          <BMFeed tweet={bm} edit={edit} onInfoClick={onInfoClick} onLickClick={onLickClick}></BMFeed>
        ) : (
          <>
            <FeedHeader label={bm.zone}></FeedHeader>
            <BMFeed key={bm.id} tweet={bm} edit={edit} onInfoClick={onInfoClick} onLickClick={onLickClick}>
              {' '}
            </BMFeed>
          </>
        );
      });
      result.push(feed);
    });
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
      {Object.keys(resultList).length === 0 && <p className="tweets-empty">검색 내용이 없습니다.</p>}
      <ul className="feeds">{makeFeeds(resultList)}</ul>
    </>
  );
});

export default BMSearch;