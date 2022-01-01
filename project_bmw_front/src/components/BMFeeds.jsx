import { memo, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { onError } from '../util/on-error';
import Banner from './Banner';
import BMFeed from './BMFeed';
import FeedHeader from './FeedHeader';
import SelectBMGroup from './SelectBMGroup';

const BMFeeds = memo(({ tweetService, edit }) => {
  const { username } = useParams();
  const [bmGroup, setTweets] = useState({});
  const [error, setError] = useState('');
  // const history = useHistory();
  // const { user } = useAuth();

  useEffect(() => {
    tweetService //
      .getBMGroupList(username)
      .then(bmGroup => {
        tweetService
          .getBMGroup(bmGroup[0].bmGroupId)
          .then(bmGroup => {
            return setTweets({ ...bmGroup });
          })
          .catch(err => onError(err, setError));
      });
  }, [tweetService, username]);

  // SelectBMGroup에서 사용
  const onGroupChange = async event => {
    const bmGroupId = event.target.value;
    tweetService
      .getBMGroup(bmGroupId)
      .then(bmGroup => setTweets({ ...bmGroup }))
      .catch(err => onError(err, setError));
  };

  // onError Wraaper
  const onErrorWraaper = err => {
    return () => onError(err, setError);
  };

  // 즐겨찾기
  const onLickClick = event => {
    // console.log(event);
  };
  // BM정보 페이지 이동
  const onInfoClick = event => {
    // console.log(event);
  };

  const makeFeeds = bmGroup => {
    let result = [];
    Object.keys(bmGroup).forEach(key => {
      const feed = bmGroup[key].map((bm, index) => {
        return index !== 0 ? ( //
          <BMFeed tweet={bm} edit={edit} onInfoClick={onInfoClick} onLickClick={onLickClick}></BMFeed>
        ) : (
          <>
            <FeedHeader label={bm.label === 'B' ? '버스' : '지하철'}></FeedHeader>
            <BMFeed key={bm.id} tweet={bm} edit={edit} onInfoClick={onInfoClick} onLickClick={onLickClick}></BMFeed>
          </>
        );
      });
      result.push(feed);
    });
    return result;
  };

  return (
    <>
      <SelectBMGroup //
        tweetService={tweetService}
        onGroupChange={onGroupChange}
        onError={onErrorWraaper}
        username={username}
        button1="그룹 편집"
        button2="BM 편집"
      />
      {error && <Banner text={error} isAlert={true} transient={true} />}
      {Object.keys(bmGroup).length === 0 && <p className="tweets-empty">아직 추가된 BM이 없습니다.</p>}
      {/* <ul className="feeds">{makeFeeds(bmGroup)}</ul> */}
    </>
  );
});

export default BMFeeds;
