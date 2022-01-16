import { memo, useEffect, useState } from 'react';
import { onError } from '../util/on-error';
import Banner from './Banner';
import BMFeed from './BMFeed';
import BMGroupFeed from './BMGroupFeed';
import FeedHeader from './FeedHeader';
import SelectBMGroup from './SelectBMGroup';
import Spinner from './Spinner';

const BMFeeds = memo(({ bmGroupService, busService }) => {
  const [bookMarks, setBookMarks] = useState([]);
  const [bmGroups, setBmGroups] = useState([]);
  const [bmGroupId, setBmGroupId] = useState(0);
  const [spinnerActive, setSpinnerActive] = useState(false);
  const [bmEditName, setBmEditName] = useState('BM 편집');
  const [bmGroupEditName, setBmGroupEditName] = useState('그룹 편집');
  const [bmEdit, setBmEdit] = useState(false);
  const [groupEdit, setGroupEdit] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setSpinnerActive(true);
    bmGroupService
      .getBmGroups()
      .then(bmGroups => {
        // localStorage에 select된 그룹 있는지 확인
        const getBmGroupId = localStorage.getItem('EditBM_bmGroupId') //
          ? Number(localStorage.getItem('EditBM_bmGroupId'))
          : null;
        const bmGroupId = !!bmGroups.find(bmGroup => bmGroup.bmGroupId === getBmGroupId) //
          ? getBmGroupId
          : bmGroups[0].bmGroupId;
        setBmGroupId(bmGroupId);
        setBmGroups([...bmGroups]);
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
    setSpinnerActive(true);
    // 그룹리스트가 조회되어 값이 있는 경우만 실행
    return bmGroupId === 0
      ? setSpinnerActive(false)
      : bmGroupService
          // 1. 그룹ID에 속한 북마크 리스트 조회
          .getGroupById(bmGroupId, true)
          .then(bmGroup => setBookMarks([...bmGroup.bookMarks]))
          .catch(err => onError(err, setError))
          .finally(() => setSpinnerActive(false));
  }, [bmGroupService, busService, bmGroupId]);

  // SelectBMGroup에 전달되는 onChange 이벤트
  const onGroupChange = async value => {
    const selectedId = value.bmGroupId;
    if (selectedId === bmGroupId) return false;
    localStorage.setItem('EditBM_bmGroupId', selectedId);
    setBmGroupId(selectedId);
  };

  // SelectBMGroup에 전달되는 BM 편집 클릭 이벤트
  const onBmEditClick = event => {
    if (groupEdit) {
      window.alert('그룹 편집 완료 후 실행하세요.');
      return false;
    }

    if (bmEdit) {
      setBmEditName('BM 편집');
    } else {
      window.alert("BM 편집 모드는 'x' 선택시 즉시 삭제되니 주의하세요!");
      setBmEditName('BM 편집 완료');
    }
    setBmEdit(!bmEdit);
  };

  // SelectBMGroup에 전달되는 그룹 편집 클릭 이벤트
  const onBmGroupEditClick = event => {
    if (bmEdit) {
      window.alert('BM 편집 완료 후 실행하세요.');
      return false;
    }

    if (groupEdit) {
      setBmGroupEditName('그룹 편집');
    } else {
      setBmGroupEditName('그룹 편집 완료');
    }
    setGroupEdit(!groupEdit);
  };

  // feed에 전달되는 삭제 이벤트
  const onDeleteClick = event => {
    if (bmEdit) {
      const { bookMarkId } = event.target.dataset;
      deleteBookMark(Number(bookMarkId));
    }

    if (bmGroups.length <= 1) {
      window.alert('그룹은 하나 이상 필요하여 삭제할 수 없습니다.');
      return false;
    }

    if (groupEdit && window.confirm('그룹을 삭제하면 북마크가 함께 삭제됩니다. 삭제할까요?')) {
      const { bmGroupId } = event.target.dataset;
      deleteBmGroup(Number(bmGroupId));
    }
  };

  // 북마크 삭제
  const deleteBookMark = selectBookMarkId => {
    return bmGroupService
      .deleteBookMark(bmGroupId, selectBookMarkId) //
      .then(() => setBookMarks(bookMarks.filter(bookMark => bookMark.bookMarkId !== selectBookMarkId)))
      .catch(err => onError(err, setError));
  };

  // 그룹 삭제
  const deleteBmGroup = selectBmGroupId => {
    return bmGroupService
      .deleteBmGroup(selectBmGroupId)
      .then(() => {
        // 그룹 리스트에서 삭제한 그룹 제거
        setBmGroups(bmGroups.filter(bmGroup => bmGroup.bmGroupId !== selectBmGroupId));
        // 삭제한 그룹이 현재 select된 그룹이면? selected값을 변경(setBmGroupId 사용)
        return selectBmGroupId === bmGroupId //
          ? setBmGroupId(bmGroups[0].bmGroupId)
          : false;
      })
      .catch(err => onError(err, setError));
  };

  /* =================== Make Component =================== */

  // 북마크 피드 생성
  const makeBookMarkFeed = bookMarks => {
    const result = [];
    let flag = '';

    for (let bm of bookMarks) {
      const { bookMarkId, label } = bm;
      if (flag !== label) {
        flag = label;
        result.push(<FeedHeader key={flag} label={label === 'B' ? '버스' : '지하철'}></FeedHeader>);
      }
      result.push(
        <>
          <BMFeed //
            key={bookMarkId}
            bm={bm}
            info={false}
            onDeleteClick={onDeleteClick}
            edit={bmEdit}
          ></BMFeed>
        </>
      );
    }
    return result;
  };

  const makeBmGroupFeed = bmGroups => {
    return bmGroups.map((bmGroup, i) => {
      const { bmGroupId } = bmGroup;
      return (
        <>
          {i === 0 && <FeedHeader label={'그룹 목록'}></FeedHeader>}
          <BMGroupFeed //
            key={bmGroupId}
            bmGroup={bmGroup}
            onDeleteClick={onDeleteClick}
            edit={groupEdit}
          ></BMGroupFeed>
        </>
      );
    });
  };

  return (
    <>
      {bmGroups && bmGroups.length !== 0 && (
        <SelectBMGroup //
          firstButton={bmGroupEditName}
          onFirstButtonClick={onBmGroupEditClick}
          secondButton={bmEditName}
          onSecondButtonClick={onBmEditClick}
          onGroupChange={onGroupChange}
          bmGroups={bmGroups}
          selected={bmGroupId}
          edit={groupEdit}
        />
      )}
      {error && <Banner text={error} isAlert={true} transient={true} />}
      {!groupEdit && Object.keys(bookMarks).length === 0 && <p className="tweets-empty">아직 추가된 BM이 없습니다.</p>}
      {spinnerActive && Spinner()}
      {!spinnerActive && !groupEdit && bookMarks && bookMarks.length !== 0 && <ul className="feeds">{makeBookMarkFeed(bookMarks)}</ul>}
      {!spinnerActive && groupEdit && <ul className="feeds">{makeBmGroupFeed(bmGroups)}</ul>}
    </>
  );
});

export default BMFeeds;
