import React, { useState } from 'react';

type ListItem = string;

function App() {
  const initialItem = 'Add a skill';

  const [leftList, setLeftList] = useState<Array<ListItem>>(Array(5).fill(initialItem));
  const [rightList, setRightList] = useState<Array<ListItem>>(Array(5).fill(initialItem));

  const handleItemClick = (list: Array<ListItem>, setList: (list: Array<ListItem>) => void, index: number) => {
    const updatedList = [...list];
    updatedList[index] = initialItem; // Make the item editable
    setList(updatedList);
  };

  const handleBlur = (list: Array<ListItem>, setList: (list: Array<ListItem>) => void, index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedList = [...list];
    if(e.target.value==="") updatedList[index] = initialItem;
     else updatedList[index] = e.target.value;
    setList(updatedList);
  };

  const handleClearClick = (list: Array<ListItem>, setList: (list: Array<ListItem>) => void, index: number) => {
    const updatedList = [...list];
    updatedList[index] = initialItem;
    setList(updatedList);
  };

  return (
    <div className="App">
        <h4 className='subHead'>The skills you mention here will help organizers in assesing you as a potential participant.</h4>
        <div className='columns'>
      <div className="right-column">
        
        <ul>
          {leftList.map((item, index) => (
            <li key={index}>
              {item === initialItem ? (
                <input
                  type="text"
                  placeholder={item}
                  onClick={() => handleItemClick(leftList, setLeftList, index)}
                  onBlur={(e) => handleBlur(leftList, setLeftList, index, e)} // when html event loses focus
                />
              ) : (
                item
              )}
              <i className="fa-regular fa-circle-xmark"onClick={() => handleClearClick(leftList, setLeftList, index)}></i>
            </li>
          ))}
        </ul>
      </div>
      <div className="left-column">
        
        <ul>
          {rightList.map((item, index) => (
            <li key={index}>
              {item === initialItem ? (
                <input
                  type="text"
                  placeholder={item}
                  onClick={() => handleItemClick(rightList, setRightList, index)}
                  onBlur={(e) => handleBlur(rightList, setRightList, index, e)}
                />
              ) : (
                item
              )}
              <i className="fa-regular fa-circle-xmark"onClick={() => handleClearClick(rightList, setRightList, index)}></i>
            </li>
          ))}
        </ul>
      </div>
        </div>
    </div>
    
  );
}

export default App;
