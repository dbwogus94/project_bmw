import React from 'react';

const SearchForm = ({ service, onError, button, onSubmit, regExp = null }) => {
  // const [tweet] = useState('');
  // const [tweet, setTweet] = useState('');

  // const onChange = event => {
  //   console.log(event);
  //   //setTweet(event.target.value);
  // };

  /* 정규식과 일치하는 단어 제거 */
  const onChange = e => {
    const nowData = e.nativeEvent.data; // 현재 입력된 단어 하나
    const value = e.target.value;
    if (nowData && regExp.test(nowData)) {
      e.preventDefault();
      e.target.value = value.slice(0, value.length - 1);
      return false;
    }
    return true;
  };

  return (
    <form className="tweet-form" onSubmit={onSubmit}>
      <input type="text" placeholder="검색 내용을 입력하세요" required autoFocus className="form-input tweet-input" onChange={regExp ? onChange : false} />
      {/* <input type="text" placeholder="검색 내용을 입력하세요" value={tweet} required autoFocus onChange={onChange} className="form-input tweet-input" /> */}
      <button type="submit" className="form-btn-search">
        {button}
      </button>
    </form>
  );
};

export default SearchForm;
