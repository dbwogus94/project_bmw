import { useEffect, useState } from 'react';

const BmGroup = ({ bmGroup, onBookMarkChange }) => {
  const [bChecked, setChecked] = useState(false);

  // 두번째 인자에 []을 전달해 로드시만 실행
  useEffect(() => {
    const isCheck = bmGroup.bmGroupBookMarks.length === 0 ? false : true;
    setChecked(isCheck);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChangeHandler = ({ target }) => {
    const { checked, value } = target;
    setChecked(!bChecked);

    if (bmGroup.bmGroupBookMarks.length !== 0) {
      const { bookMarkId } = bmGroup.bmGroupBookMarks[0].bookMark;
      return onBookMarkChange(checked, value, bookMarkId); // 삭제
    }
    return onBookMarkChange(checked, value); // 추가
  };

  return (
    <>
      <li className="bmgroup" key={bmGroup.bmGroupId}>
        <article className="bmgroup-container">
          <span className="bmgroup-checkbox">
            <input //
              type="checkbox"
              id={`checkbox_${bmGroup.bmGroupId}`}
              value={bmGroup.bmGroupId}
              checked={bChecked}
              onChange={onChangeHandler}
            />
            <label htmlFor={`checkbox_${bmGroup.bmGroupId}`}></label>
          </span>
          <span className="bmgroup-text">{bmGroup.bmGroupName}</span>
        </article>
      </li>
    </>
  );
};

export default BmGroup;
