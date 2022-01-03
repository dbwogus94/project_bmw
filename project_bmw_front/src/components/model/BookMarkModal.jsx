import React, { memo, useEffect, useState } from 'react';
import NewBmGroupForm from './NewBmGroupForm';

const BookMarkModal = memo(({ tweetService, onUpdateBookMark, isOpen, onClose, routeId, stationSeq }) => {
  const [bmGroups, setBmGroups] = useState([]);
  const [isCreate, setIsCreate] = useState(false);

  // 로드시만 실행
  useEffect(() => {
    // 유저의 그룹 리스트 조회
    // TODO: 유저 그룹 리스트 조회시 그룹의 즐겨찾기 여부도 같이 조회
    // 조회에 필요한 데이터: 유저id, 루트Id(routeId), 경유정류소순번(stationSeq)
    tweetService
      .getBMGroupList()
      .then(bmGroups => setBmGroups(bmGroups))
      .catch(console.error);
  }, [tweetService, routeId, stationSeq]);

  // 그룹 추가 form 활성화
  const onActiveCreateForm = event => {
    setIsCreate(true);
  };

  // 신규 그룹 추가
  const onCreateBmGroup = (bmGroupName, event) => {
    event.preventDefault();
    tweetService
      .createBMGroup(bmGroupName)
      .then(bmGroups => setBmGroups([...bmGroups]))
      .catch(console.error);
    setIsCreate(false);
  };

  const makeBmgroup = bmGroup => {
    const { bmGroupId, bmGroupName, checked } = bmGroup;
    return (
      <>
        <li className="bmgroup" key={bmGroupId}>
          <article className="bmgroup-container">
            <span className="bmgroup-checkbox">
              <input type="checkbox" id="check1" value={bmGroupId} checked={checked ? true : false} onChange={onUpdateBookMark} />
              {/* <input type="checkbox" id="check1" value={bmGroupId} data-bm-group-name={bmGroupName} onChange={onUpdateBookMark} checked={checked ? true : false} /> */}
              <label htmlFor="check1"></label>
            </span>
            <span className="bmgroup-text">{bmGroupName}</span>
          </article>
        </li>
      </>
    );
  };

  return (
    // 모달이 열릴때 openModal 부여
    <div className={isOpen ? 'openModal book-mark-modal' : 'book-mark-modal'}>
      {isOpen ? (
        <section>
          <header>
            {'BM 즐겨찾기 등록'}
            <button className="close" onClick={onClose}>
              {' '}
              &times;{' '}
            </button>
          </header>
          <main>
            <ul className="bmgroups">{bmGroups.map(bmGroup => makeBmgroup(bmGroup))}</ul>
          </main>
          <footer>
            {!isCreate ? (
              <>
                <button onClick={onActiveCreateForm}>
                  <div className="create-bmgroup">
                    <span className="create-bmgroup-icon">
                      <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" className="style-scope yt-icon">
                        <g className="style-scope yt-icon">
                          <path d="M20,12h-8v8h-1v-8H3v-1h8V3h1v8h8V12z" className="style-scope yt-icon"></path>
                        </g>
                      </svg>
                    </span>
                    <span className="create-bmgroup-text">새 BM 그룹 만들기</span>
                  </div>
                </button>
              </>
            ) : (
              <NewBmGroupForm onCreateBmGroup={onCreateBmGroup}></NewBmGroupForm>
            )}
          </footer>
        </section>
      ) : null}
    </div>
  );
});

export default BookMarkModal;
