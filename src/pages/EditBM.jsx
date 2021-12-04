import React, { memo, useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import Banner from '../components/Banner';
import BMfeed from '../components/BMfeed';
import FeedHeader from '../components/FeedHeader';
import SelectBMGroup from '../components/SelectBMGroup';
import { useAuth } from '../context/AuthContext';

const EditBM = ({ tweetService }) => {
  const { username } = useParams();
  const [tweets, setTweets] = useState([]);
  const [error, setError] = useState('');
  const history = useHistory();
  const { user } = useAuth();

  useEffect(() => {
    tweetService //
      .getBMGroup(username)
      .then(bmGroup => {
        tweetService
          .findBMGroupById(bmGroup[0].bmGroupId)
          .then(tweets => {
            tweets.sort(a => (a.label === 'B' ? -1 : 1));
            return setTweets([...tweets]);
          })
          .catch(onError);
      });
  }, [tweetService, username]);

  const onBMChange = bmList => {
    // 기존 트윗 목록의 가장 앞에 새로운 트윗을 추가한다.
    setTweets([...bmList]);
  };

  const onError = error => {
    setError(error.toString());
    setTimeout(() => {
      setError('');
    }, 3000);
  };

  // BM정보 페이지 이동
  const onInfoClick = () => {};

  return (
    <>
      <SelectBMGroup //
        tweetService={tweetService}
        onBMChange={onBMChange}
        onError={onError}
        username={username}
        button1="그룹 편집"
        button2="BM 편집"
      />
      {error && <Banner text={error} isAlert={true} transient={true} />}
      {tweets.length === 0 && <p className="tweets-empty">아직 추가된 BM이 없습니다.</p>}
      <ul className="feeds">
        {tweets.map((tweet, index) => {
          return (
            <>
              {(index === 0 || index === tweets.findIndex(t => t.label === 'M')) && ( //
                <FeedHeader label={tweet.label}></FeedHeader>
              )}
              <BMfeed key={tweet.id} tweet={tweet} edit={false} onInfoClick={onInfoClick}></BMfeed>
            </>
          );
        })}
      </ul>
    </>
  );
};

/*
    1. SelectBMGroup
    <ul>
      2. 반복으로 BMfeed를 그린다.
    </ul
  */
export default EditBM;
