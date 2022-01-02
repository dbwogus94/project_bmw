import React from 'react';

const SearchForm = ({ service, onError, button, onSubmit, regExp = null, pasteRegExp = null }) => {
  // const [tweet] = useState('');
  // const [tweet, setTweet] = useState('');

  /* 정규식과 일치하는 단어 제거 */
  const onChange = e => {
    const nowValue = e.nativeEvent.data; // 현재 입력된 단어 하나
    const allValue = e.target.value; // 입력된 전체 값

    // 정규식과 일치하는 데이터 방지
    if (nowValue && regExp.test(nowValue)) {
      e.preventDefault();
      e.target.value = allValue.slice(0, allValue.length - 1);
      return false;
    }

    // 붙여넣기 값에서 정규식과 일치하는 데이터 제거
    if (allValue && regExp.test(allValue)) {
      e.preventDefault();
      const pattern = new RegExp(regExp, 'gi');
      e.target.value = allValue.replace(pattern, '');
      return false;
    }

    return true;
  };

  return (
    <form className="tweet-form" onSubmit={onSubmit}>
      <input
        type="text" //
        placeholder="검색 내용을 입력하세요"
        className="form-input tweet-input"
        onChange={regExp ? onChange : false}
        maxLength="10"
        required
        autoFocus
      />
      {/* <input type="text" placeholder="검색 내용을 입력하세요" value={tweet} required autoFocus onChange={onChange} className="form-input tweet-input" /> */}
      <button type="submit" className="form-btn-search">
        {button}
      </button>
    </form>
  );
};

export default SearchForm;
