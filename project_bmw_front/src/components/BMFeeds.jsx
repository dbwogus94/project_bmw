import { memo, useEffect, useState } from 'react';
import { onError } from '../util/on-error';
import Banner from './Banner';
import BMFeed from './BMFeed';
import FeedHeader from './FeedHeader';
import SelectBMGroup from './SelectBMGroup';
import Spinner from './Spinner';

const BMFeeds = memo(({ bmGroupService, edit }) => {
  const [bookMarks, setBookMarks] = useState([]);
  const [bmGroups, setBmGroups] = useState([]);
  const [spinnerActive, setSpinnerActive] = useState(false);
  const [error, setError] = useState('');
  // const history = useHistory();
  // const { user } = useAuth();

  useEffect(() => {
    setSpinnerActive(true);
    bmGroupService
      .getBmGroups()
      .then(bmGroups => {
        setBmGroups([...bmGroups]);
        return bmGroups[0].bmGroupId;
      })
      .then(bmGroupId => bmGroupService.getGroupById(bmGroupId, true))
      .then(bmGroup => {
        setSpinnerActive(false);
        setBookMarks(bmGroup.bookMarks);
      })
      .catch(onError);
  }, [bmGroupService]);

  // SelectBMGroup에서 사용
  const onGroupChange = async event => {
    const bmGroupId = event.target.value;
    bmGroupService
      .getGroupById(bmGroupId, true)
      .then(bmGroup => {
        setBookMarks([...bmGroup.bookMarks]);
      })
      .catch(err => onError(err, setError));
  };

  // // 즐겨찾기
  // const onLickClick = event => {
  //   // console.log(event);
  // };
  // // BM정보 페이지 이동
  // const onInfoClick = event => {
  //   // console.log(event);
  // };

  const makeFeeds = bookMarks => {
    const result = [];
    let flag = '';

    for (let bm of bookMarks) {
      const { routeId, type } = bm;
      if (flag !== type) {
        flag = type;
        result.push(<FeedHeader label={bm.label === 'B' ? '버스' : '지하철'}></FeedHeader>);
      }

      result.push(
        <>
          <BMFeed //
            key={type === 'gyeonggi' ? 'G' + routeId : 'S' + routeId}
            bm={bm}
            // onfeedClick={onfeedClick}
            edit={false}
          ></BMFeed>
        </>
      );
    }

    return result;
  };

  return (
    <>
      <SelectBMGroup //
        button1="그룹 편집"
        button2="BM 편집"
        onGroupChange={onGroupChange}
        bmGroups={bmGroups}
      />
      {error && <Banner text={error} isAlert={true} transient={true} />}
      {Object.keys(bookMarks).length === 0 && <p className="tweets-empty">아직 추가된 BM이 없습니다.</p>}
      {spinnerActive && Spinner()}
      {!spinnerActive && bookMarks && bookMarks.length !== 0 && <ul className="feeds">{makeFeeds(bookMarks)}</ul>}
    </>
  );
});

export default BMFeeds;
