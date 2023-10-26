import React, { useEffect, useState } from "react";
import Select from "react-select";
import axios from "axios";

type ListItem = string;

function App() {
  const initialItem = "Add a skill";

  const [leftList, setLeftList] = useState<Array<ListItem>>(() => {
    const storedLeftList = localStorage.getItem("leftList");
    return storedLeftList
      ? JSON.parse(storedLeftList)
      : Array(5).fill(initialItem);
  });

  const [rightList, setRightList] = useState<Array<ListItem>>(() => {
    const storedRightList = localStorage.getItem("rightList");
    return storedRightList
      ? JSON.parse(storedRightList)
      : Array(5).fill(initialItem);
  });

  const [options, setOptions] = useState<any[]>([]);

  const [leftSelectedOptions, setLeftSelectedOptions] = useState<any[]>(() => {
    const storedLeftSelectedOptions = localStorage.getItem(
      "leftSelectedOptions"
    );
    return storedLeftSelectedOptions
      ? JSON.parse(storedLeftSelectedOptions)
      : Array(5).fill(null);
  });

  const [rightSelectedOptions, setRightSelectedOptions] = useState<any[]>(
    () => {
      const storedRightSelectedOptions = localStorage.getItem(
        "rightSelectedOptions"
      );
      return storedRightSelectedOptions
        ? JSON.parse(storedRightSelectedOptions)
        : Array(5).fill(null);
    }
  );

  const [selectedValue, setSelectedValue] = useState<any | null>(null); // Track selected value
  const [menuIsOpen, setMenuIsOpen] = useState<boolean>(true); // Control dropdown menu visibility

  useEffect(() => {
    axios
      .get(
        "https://api.stackexchange.com/2.3/tags?order=desc&sort=popular&site=stackoverflow"
      )
      .then((response: any) => {
        const options = response.data.items.map((item: any) => ({
          value: item.name,
          label: item.name,
        }));
        setOptions(options);
      })
      .catch((error: any) => {
        console.error("Error fetching options:", error);
      });
  }, []);

  useEffect(() => {
    localStorage.setItem("leftList", JSON.stringify(leftList));
    localStorage.setItem("rightList", JSON.stringify(rightList));
    localStorage.setItem(
      "leftSelectedOptions",
      JSON.stringify(leftSelectedOptions)
    );
    localStorage.setItem(
      "rightSelectedOptions",
      JSON.stringify(rightSelectedOptions)
    );
  }, [leftList, rightList, leftSelectedOptions, rightSelectedOptions]);

  const handleItemClick = (
    list: Array<ListItem>,
    setList: (list: Array<ListItem>) => void,
    index: number
  ) => {
    const updatedList = [...list];
    updatedList[index] = initialItem; // Make the item editable
    setList(updatedList);
  };

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

  const handleSort = (
    list: Array<ListItem>,
    setList: (list: Array<ListItem>) => void,
    index: number
  ) => {
    let _skillItems = [...list];
    let draggedItemContent = _skillItems.splice(dragItem.current, 1)[0];

    _skillItems.splice(dragOverItem.current, 0, draggedItemContent);
    dragItem.current = null;
    dragOverItem.current = null;
    setList(_skillItems);
  };

  const [data, setData] = useState<any[]>([]);
  const [filterData, setFilterData] = useState<any[]>([]);

  useEffect(() => {
    fetch(
      "https://api.stackexchange.com/2.3/tags?order=desc&sort=popular&site=stackoverflow"
    )
      .then((res) => res.json())
      .then((fetchedData) => {
        setData(fetchedData.items);
        setFilterData(fetchedData.items);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleFilter = (value: string) => {
    const res = filterData.filter((f) => f.name.toLowerCase().includes(value));
    setData(res);
  };

  const handleLeftOptionChange = (
    index: number,
    selectedOption: any | null
  ) => {
    const updatedOptions = [...leftSelectedOptions];
    updatedOptions[index] = selectedOption;
    setLeftSelectedOptions(updatedOptions);

    // Hide the dropdown box after selection
    setMenuIsOpen(false);

    // Pass the selected value to the previous input
    if (selectedOption) {
      const updatedList = [...leftList];
      updatedList[index] = selectedOption.label;
      setLeftList(updatedList);

      // Track the selected value
      setSelectedValue(selectedOption);
    }
  };

  const handleRightOptionChange = (
    index: number,
    selectedOption: any | null
  ) => {
    const updatedOptions = [...rightSelectedOptions];
    updatedOptions[index] = selectedOption;
    setRightSelectedOptions(updatedOptions);

    // Hide the dropdown box after selection
    // Hide the dropdown box after selection
    setMenuIsOpen(false);

    // Pass the selected value to the previous input
    if (selectedOption) {
      const updatedList = [...rightList];
      updatedList[index] = selectedOption.label;
      setRightList(updatedList);

      // Track the selected value
      setSelectedValue(selectedOption);
    }
  };

  return (
    <div className="main-Container">
      <h4>
        <li>Things you are good at</li>
      </h4>
      <div className="App">
        <h4 className="subHead">
          The skills you mention here will help organizers in assessing you as a
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
                    <Select
                      className="select"
                      options={options}
                      value={leftSelectedOptions[index]}
                      onChange={(selectedOption: any) =>
                        handleLeftOptionChange(index, selectedOption)
                      }
                      isSearchable
                      isClearable
                      placeholder={index + 1 + ". " + item}
                    />
                  ) : (
                    index + 1 + ". " + item
                  )}
                  <i
                    className="fa-regular fa-circle-xmark"
                    onClick={() =>
                      handleClearClick(leftList, setLeftList, index)
                    }
                  ></i>
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
                  onDragEnd={(e) => handleSort(rightList, setRightList, index)}
                  onDragOver={(e) => e.preventDefault()}
                  key={index}
                >
                  {item === initialItem ? (
                    <Select
                      className="select"
                      options={options}
                      value={rightSelectedOptions[index]}
                      onChange={(selectedOption: any) =>
                        handleRightOptionChange(index, selectedOption)
                      }
                      isSearchable
                      isClearable
                      placeholder={index + 6 + ". " + item}
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
