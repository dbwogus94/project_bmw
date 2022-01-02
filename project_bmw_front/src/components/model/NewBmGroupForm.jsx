import { useState } from 'react';

const NewBmGroupForm = ({ onCreateBmGroup }) => {
  const [bmGroupName, setBmGroupName] = useState('');

  const onChange = e => {
    const nowValue = e.nativeEvent.data; // 현재 입력된 단어 하나
    const allValue = e.target.value; // 입력된 전체 값
    const regExp = /[$<>{}/\\:;=]/;
    // 정규식과 일치하는 데이터 방지
    if (nowValue && regExp.test(nowValue)) {
      e.preventDefault();
      e.target.value = allValue.slice(0, allValue.length - 1);
    }

    // 붙여넣기 값에서 정규식과 일치하는 데이터 제거
    if (allValue && regExp.test(allValue)) {
      e.preventDefault();
      const pattern = new RegExp(regExp, 'gi');
      e.target.value = allValue.replace(pattern, '');
    }

    setBmGroupName(e.target.value);
    return true;
  };

  return (
    <>
      <form className="bmgroup-create-form" onSubmit={onCreateBmGroup.bind(null, bmGroupName)}>
        <p>이름</p>
        <p>
          <input
            type="text" //
            placeholder="BM그룹 명 입력"
            maxLength="30"
            onChange={onChange}
            required
            autoFocus
          />
        </p>
        <div className="create-form-btn">
          <button type="submit">추가하기</button>
        </div>
      </form>
    </>
  );
};

export default NewBmGroupForm;
