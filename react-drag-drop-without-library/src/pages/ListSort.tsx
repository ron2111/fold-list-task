import React from "react";

function ListSort() {
  const [skillItems, setSkillItems] = React.useState([
    "Add a Skill"
  ]);
  const [newSkillItem, setNewSkillItem] = React.useState("");
  const [showInput, setShowInput] = React.useState(true);

  //save reference for dragItem and dragOverItem
  const dragItem = React.useRef<any>(null);
  const dragOverItem = React.useRef<any>(null);

  //const handle drag sorting
  const handleSort = () => {
    //duplicate items
    let _skillItems = [...skillItems];

    //remove and save the dragged item content
    const draggedItemContent = _skillItems.splice(dragItem.current, 1)[0];

    //switch the position
    _skillItems.splice(dragOverItem.current, 0, draggedItemContent);

    //reset the position ref
    dragItem.current = null;
    dragOverItem.current = null;

    //update the actual array
    setSkillItems(_skillItems);
  };

  //handle name change
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewSkillItem(e.target.value);
  };

  //handle new item addition
  const handleAddItem = () => {
    const _skillItems = [...skillItems];
    _skillItems.push(newSkillItem);
    setSkillItems(_skillItems);
    setShowInput(false);
  };

  return (
    <div className="app">
      <h2>Skill List</h2>

      <div className="input-group">
        {/* <input
          type="text"
          name="fruitName"
          placeholder="e.g Banana"
          onChange={handleNameChange}
        /> */}
        <button className="btn" onClick={handleAddItem}>
          Add item
        </button>
      </div>

      <div className="list-sort">
        {skillItems.map((item, index) => (
          <div
            key={index}
            className="list-item"
            draggable
            onDragStart={(e) => (dragItem.current = index)}
            onDragEnter={(e) => (dragOverItem.current = index)}
            onDragEnd={handleSort}
            onDragOver={(e) => e.preventDefault()}
          >
            {/* <input
          type="text"
          name="fruitName"
          placeholder="Add Skill"
          onChange={handleNameChange}
          // style={{visibility: showInput ? 'visible' : 'hidden' }} 
        /> */}
            
            <h4>{index}{item}</h4>
            <i className="fa-regular fa-circle-xmark"></i>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ListSort;

