import React from 'react';

const SearchForm = ({ service, onError, button, onSubmit }) => {
  // const [tweet] = useState('');
  // const [tweet, setTweet] = useState('');

  // const onChange = event => {
  //   console.log(event);
  //   //setTweet(event.target.value);
  // };

  return (
    <form className="tweet-form" onSubmit={onSubmit}>
      <input type="text" placeholder="검색 내용을 입력하세요" required autoFocus className="form-input tweet-input" />
      {/* <input type="text" placeholder="검색 내용을 입력하세요" value={tweet} required autoFocus onChange={onChange} className="form-input tweet-input" /> */}
      <button type="submit" className="form-btn-search">
        {button}
      </button>
    </form>
  );
};

export default SearchForm;
