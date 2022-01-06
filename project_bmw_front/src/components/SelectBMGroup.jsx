import React, { useState, useEffect } from 'react';

const SelectBMGroup = ({ bmGroupService, onGroupChange, onError, username, button1, button2, onButtonClick1, onButtonClick2 }) => {
  const [bmGroup, setBMGroup] = useState([]);

  useEffect(() => {
    bmGroupService
      .getBMGroupList(username)
      .then(bmGroup => setBMGroup([...bmGroup]))
      .catch(onError);
  }, [bmGroupService, onError, setBMGroup, username]);
  // 그룹 변경에 사용
  // const onSubmit = async event => {
  //   event.preventDefault();
  //   bmGroupService
  //     .postTweet(tweet)
  //     .then(created => {
  //       setTweet('');
  //       onCreated(created);
  //     })
  //     .catch(onError);
  // };

  return (
    <div className="tweet-form">
      {/* <input type="text" placeholder="Edit your tweet" value={tweet} required autoFocus onChange={onChange} className="form-input tweet-input" /> */}
      <select className="form-input tweet-input" onChange={onGroupChange}>
        {bmGroup.map(group => (
          <option key={group.bmGroupId} value={group.bmGroupId}>
            {group.bmGroupName}
          </option>
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
