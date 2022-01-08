import { useEffect, useState } from 'react';

/*
  bmGroup = { 
    "bmGroupId": 1,
    "bmGroupName": "jay_group_1",
    "bmGroupBookMarks": [
      {
        "bmGroupBookMarkId": 180,
        "bookMark": {
          "bookMarkId": 29,
          "checkColumn": "2290001114229000968",
          "routeId": 229000111,
          "stationSeq": 4,
          "stationId": 229000968,
          "label": "B",
          "routeName": "G7426",
          "stationName": "야당역.한빛마을5.9단지",
          "direction": "양재역.양재1동민원분소",
          "type": "gyeonggi"
        }
      }
    ]
  },
*/

const BmGroup = ({ bmGroup, onBookMarkChange }) => {
  const [bChecked, setChecked] = useState(false);
  const [bBmGroup, setBmGroup] = useState({});

  // 두번째 인자에 []을 전달해 로드시만 실행
  useEffect(() => {
    const isCheck = bmGroup.bmGroupBookMarks.length === 0 ? false : true;
    setChecked(isCheck);
    setBmGroup(bmGroup);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChangeHandler = ({ target }) => {
    const { checked, value } = target;
    setChecked(!bChecked); // 체크 상태 변경

    const { bmGroupBookMarks } = bBmGroup;
    const bookMarkId =
      bmGroupBookMarks.length !== 0 //
        ? bmGroupBookMarks[0].bookMark.bookMarkId
        : undefined;

    return onBookMarkChange(checked, value, bookMarkId)
      .then(bmGroupBookMark => {
        const bmGroupBookMarks = bmGroupBookMark ? [bmGroupBookMark] : [];
        return setBmGroup({ ...bmGroup, bmGroupBookMarks });
      })
      .catch(console.error);
  };

  return (
    <>
      <li className="bmgroup" key={bBmGroup.bmGroupId}>
        <article className="bmgroup-container">
          <span className="bmgroup-checkbox">
            <input //
              type="checkbox"
              id={`checkbox_${bBmGroup.bmGroupId}`}
              value={bBmGroup.bmGroupId}
              checked={bChecked}
              onChange={onChangeHandler}
            />
            <label htmlFor={`checkbox_${bBmGroup.bmGroupId}`}></label>
          </span>
          <span className="bmgroup-text">{bBmGroup.bmGroupName}</span>
        </article>
      </li>
    </>
  );
};

export default BmGroup;
