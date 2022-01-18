import { useEffect, useState } from 'react';
import Select from 'react-select';
const SelectBMGroup = ({ firstButton, secondButton, onFirstButtonClick, onSecondButtonClick, onGroupChange, bmGroups, selected, edit }) => {
  const [selectItemList, setSelectItemList] = useState([]);
  const [selectItem, setSelectItem] = useState({});

  useEffect(() => {
    const options = bmGroups.map(bmGroup => {
      const { bmGroupId, bmGroupName } = bmGroup;
      return { ...bmGroup, value: bmGroupId, label: bmGroupName };
    });
    setSelectItemList(options);
    setSelectItem(options.find(bmGroup => bmGroup.bmGroupId === selected));
  }, [bmGroups, selected]);

  return (
    <div className="tweet-form">
      <Select //
        className="group-select"
        options={selectItemList}
        value={selectItem}
        onChange={onGroupChange}
        isDisabled={edit}
        isSearchable={true}
      />
      <button className="form-btn-search" onClick={onFirstButtonClick}>
        {firstButton}
      </button>
      <button className="form-btn-search" onClick={onSecondButtonClick}>
        {secondButton}
      </button>
    </div>
  );
};

export default SelectBMGroup;
