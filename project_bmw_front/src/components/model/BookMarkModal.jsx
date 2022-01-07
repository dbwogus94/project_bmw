import React, { memo, useEffect, useState } from 'react';
import BmGroup from './BmGroup';
import NewBmGroupForm from './NewBmGroupForm';

const BookMarkModal = memo(({ bmGroupService, onBookMarkChange, isOpen, onClose, station }) => {
  const [bmGroups, setBmGroups] = useState([]);
  const [isCreate, setIsCreate] = useState(false);

  // 두번째 인자에 []을 전달해 로드시만 실행
  useEffect(() => {
    const { routeId, stationSeq, stationId } = station;
    bmGroupService
      .searchBmGroups(routeId, stationSeq, stationId)
      .then(bmGroups => setBmGroups([...bmGroups]))
      .catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 그룹 추가 NewBmGroupForm 활성화
  const onActiveCreateForm = event => {
    setIsCreate(true);
  };

  // 신규 그룹 추가 이벤트
  const onCreateBmGroup = (bmGroupName, event) => {
    event.preventDefault();
    bmGroupService
      .createBmGroup(bmGroupName)
      .then(bmGroup => setBmGroups([...bmGroups, { ...bmGroup, bmGroupBookMarks: [] }]))
      .catch(console.error);
    setIsCreate(false);
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
            <ul className="bmgroups">
              {bmGroups.map(bmGroup => (
                <BmGroup //
                  key={bmGroup.bmGroupId}
                  bmGroup={bmGroup}
                  onBookMarkChange={onBookMarkChange}
                ></BmGroup>
              ))}
            </ul>
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
