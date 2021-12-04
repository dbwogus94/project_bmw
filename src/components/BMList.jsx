import React, { memo, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Banner from './Banner';
import SelectBMGroup from './SelectBMGroup';
import BMCard from './BMCard';
import { useAuth } from '../context/AuthContext';

const BMList = memo(({ tweetService, username }) => {
  const [tweets, setTweets] = useState([]);
  const [error, setError] = useState('');
  const history = useHistory();
  const { user } = useAuth();

  useEffect(() => {
    tweetService //
      .getBMGroup(user.username)
      .then(bmGroup => {
        tweetService
          .findBMGroupById(bmGroup[0].bmGroupId)
          .then(tweets => setTweets([...tweets]))
          .catch(onError);
      });
  }, [tweetService, user]);

  // 정류장 클릭, TODO: API 정해지면 API URL 적용
  const onUsernameClick = tweet => {
    return tweet.label === 'B' //
      ? history.push(`/stop/${tweet.username}`) // 버스 정류소
      : history.push(`/stop/${tweet.username}`); // 지하철 노선
  };

  // 노선 번호 클릭, TODO: API 정해지면 API URL 적용
  const onNameClick = tweet => {
    return tweet.label === 'B'
      ? history.push(`/bus/${tweet.id}`) // 버스 id로 버스 정보
      : history.push(`/metro/${tweet.id}`); // 지하철 id로 역정보
  };

  // 그룹 select box 변경 이벤트
  const onBMChange = bmList => {
    setTweets([...bmList]);
  };

  // 새로고침
  const onButtonClick1 = () => {
    //return history.push(`/bus`);
  };

  // 수정하기
  const onButtonClick2 = tweet => {
    return history.push(`/${user.username}`);
  };

  const onError = error => {
    setError(error.toString());
    setTimeout(() => {
      setError('');
    }, 3000);
  };

  return (
    <>
      <SelectBMGroup //
        tweetService={tweetService}
        onBMChange={onBMChange}
        onError={onError}
        username={username}
        button1="새로고침"
        onButtonClick1={onButtonClick1}
        button2="수정하기"
        onButtonClick2={onButtonClick2}
      />
      {error && <Banner text={error} isAlert={true} transient={true} />}
      {tweets.length === 0 && <p className="tweets-empty">아직 추가된 BM이 없습니다.</p>}
      <ul className="tweets">
        {tweets.map(tweet => (
          <BMCard key={tweet.id} tweet={tweet} onUsernameClick={onUsernameClick} onNameClick={onNameClick} />
        ))}
      </ul>
    </>
  );
});
export default BMList;
