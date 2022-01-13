import React, { useState, useEffect } from 'react';

const SelectBMGroup = ({ button1, button2, onButtonClick1, onButtonClick2, onGroupChange, itemList, selectedItem }) => {
  const [selectItemList, setSelectItemList] = useState([]);
  const [selectItem, setSelectItem] = useState(0);

  useEffect(() => {
    setSelectItemList(itemList);
    setSelectItem(selectedItem);
  }, [itemList, selectedItem]);

  return (
    <div className="tweet-form">
      <select className="form-input tweet-input" onChange={onGroupChange} defaultValue={selectItem}>
        {selectItemList.map(bmGroup => {
          const { bmGroupId, bmGroupName } = bmGroup;
          return (
            <>
              <option key={bmGroupId} value={bmGroupId}>
                {bmGroupName}
              </option>
            </>
          );
        })}
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
