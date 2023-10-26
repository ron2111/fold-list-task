// TEST / ALTERNATE DRAGGABLE MULTI-COLUMN LIST

import React, { useEffect, useState } from "react";
import Select from "react-select";

type ListItem = string;

function App() {
  const initialItem = "Add a skill";

  const [leftList, setLeftList] = useState<Array<ListItem>>(
    Array(5).fill(initialItem)
  );
  const [rightList, setRightList] = useState<Array<ListItem>>(
    Array(5).fill(initialItem)
  );

  const handleItemClick = (
    list: Array<ListItem>,
    setList: (list: Array<ListItem>) => void,
    index: number
  ) => {
    const updatedList = [...list];
    updatedList[index] = initialItem; // Make the item editable
    setList(updatedList);
  };
  //   --------------- focus lost--------------
  const handleBlur = (
    list: Array<ListItem>,
    setList: (list: Array<ListItem>) => void,
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const updatedList = [...list];
    if (list === rightList) {
      if (e.target.value === "") updatedList[index] = initialItem;
      else updatedList[index] = e.target.value;
      setList(updatedList);
    } else {
      if (e.target.value === "") updatedList[index] = initialItem;
      else updatedList[index] = e.target.value;
      setList(updatedList);
    }
  };

  //   --------------- clear btn func--------------
  const handleClearClick = (
    list: Array<ListItem>,
    setList: (list: Array<ListItem>) => void,
    index: number
  ) => {
    const updatedList = [...list];
    updatedList[index] = initialItem;
    setList(updatedList);
  };

  const dragItem = React.useRef<any>(null);
  const dragOverItem = React.useRef<any>(null);

  //   --------------- drag func--------------
  const handleSort = (
    list: Array<ListItem>,
    setList: (list: Array<ListItem>) => void,
    index: number
  ) => {
    //duplicate items
    let _skillItems = [...list];

    //remove and save the dragged item content
    let draggedItemContent = _skillItems.splice(dragItem.current, 1)[0];

    _skillItems.splice(dragOverItem.current, 0, draggedItemContent);
    //reset the position ref
    dragItem.current = null;
    dragOverItem.current = null;
    //update the actual array
    setList(_skillItems);
  };

  // fetched data
  const [data, setData] = useState<any[]>([]);
  const [filterData, setFilterData] = useState<any[]>([]);

  // Fetch through stack exchange API
  useEffect(() => {
    fetch(
      "https://api.stackexchange.com/2.3/tags?order=desc&sort=popular&site=stackoverflow"
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setData(data.items);
        setFilterData(data.items);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleFilter = (value: String) => {
    // language suggestions
    const res = filterData.filter((f) => f.name.toLowerCase().includes(value));
    setData(res);
    console.log(res);
  };
  return (
    <div className="main-Container">
      <h4>
        <li>Things you are good at</li>
      </h4>
      <div className="App">
        {/* main container */}

        <h4 className="subHead">
          The skills you mention here will help organizers in assesing you as a
          potential participant.
        </h4>
        <div className="columns">
          <div className="left-column">
            <ul>
              {leftList.map((item, index) => (
                <li
                  draggable
                  onDragStart={(e) => (dragItem.current = index)}
                  onDragEnter={(e) => (dragOverItem.current = index)}
                  onDragEnd={(e) => handleSort(leftList, setLeftList, index)}
                  onDragOver={(e) => e.preventDefault()}
                  key={index}
                >
                  {item === initialItem ? (
                    <input
                      // options={options}
                      type="text"
                      placeholder={index + 1 + ". " + item}
                      onClick={() =>
                        handleItemClick(leftList, setLeftList, index)
                      }
                      onBlur={(e) =>
                        handleBlur(leftList, setLeftList, index, e)
                      } // when html event loses focus
                      onChange={(e) => {
                        handleFilter(e.target.value);
                      }}
                    />
                  ) : (
                    // <Select options={options} value={options} isSearchable />
                    index + 1 + ". " + item
                  )}
                  <i
                    className="fa-regular fa-circle-xmark"
                    onClick={() =>
                      handleClearClick(leftList, setLeftList, index)
                    }
                  ></i>
                  {/* <div className="search-opt">
                    {data.map((d, i) => (
                      <div key={i}>{d.name}</div>
                    ))}
                  </div> */}
                </li>
              ))}
            </ul>
          </div>
          <div className="right-column">
            <ul>
              {rightList.map((item, index) => (
                <li
                  draggable
                  onDragStart={(e) => (dragItem.current = index)}
                  onDragEnter={(e) => (dragOverItem.current = index)}
                  onDragEnd={(e) =>
                    handleSort(rightList, setRightList, index + 5)
                  }
                  onDragOver={(e) => e.preventDefault()}
                  key={index}
                >
                  {item === initialItem ? (
                    <input
                      type="text"
                      placeholder={index + 6 + ". " + item}
                      onClick={() =>
                        handleItemClick(rightList, setRightList, index)
                      }
                      onBlur={(e) =>
                        handleBlur(rightList, setRightList, index, e)
                      }
                    />
                  ) : (
                    index + 6 + ". " + item
                  )}
                  <i
                    className="fa-regular fa-circle-xmark"
                    onClick={() =>
                      handleClearClick(rightList, setRightList, index)
                    }
                  ></i>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
