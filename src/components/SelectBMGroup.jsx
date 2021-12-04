import React, { useState, useEffect } from 'react';

const SelectBMGroup = ({ tweetService, onBMChange, onError, username, button1, button2, onButtonClick1, onButtonClick2 }) => {
  const [bmGroup, setBMGroup] = useState([]);

  useEffect(() => {
    tweetService
      .getBMGroup(username)
      .then(bmGroup => setBMGroup([...bmGroup]))
      .catch(onError);
  }, [tweetService, onError, setBMGroup, username]);
  // 그룹 변경에 사용
  // const onSubmit = async event => {
  //   event.preventDefault();
  //   tweetService
  //     .postTweet(tweet)
  //     .then(created => {
  //       setTweet('');
  //       onCreated(created);
  //     })
  //     .catch(onError);
  // };

  const onChange = async event => {
    const bmList = await tweetService.findBMGroupById(event.target.value);
    onBMChange(bmList);
    // console.log(bmList);
  };

  return (
    <div className="tweet-form">
      {/* <input type="text" placeholder="Edit your tweet" value={tweet} required autoFocus onChange={onChange} className="form-input tweet-input" /> */}
      <select className="form-input tweet-input" onChange={onChange}>
        {bmGroup.map(group => (
          <option value={group.bmGroupId}>{group.bmGroupName}</option>
        ))}
      </select>
      <button className="form-btn-search" onClick={onButtonClick1}>
        {button1}
      </button>
      <button className="form-btn-search" onClick={onButtonClick2}>
        {button2}
      </button>
    </div>
  );
};

export default SelectBMGroup;
