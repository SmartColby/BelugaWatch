import React, { useState } from "react";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "../styles/DragAndDrop.css";

const DragAndDrop = () => {
  const items = [
    { id: 1, term: "Melon", match: "Echolocation" },
    { id: 2, term: "Cook Inlet", match: "Endangered Population" },
  ];

  const targets = ["Echolocation", "Endangered Population"];
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [feedback, setFeedback] = useState("");

  const handleDrop = (item, target) => {
    if (item.match === target) {
      setMatchedPairs((prev) => [...prev, { term: item.term, match: target }]);
      setFeedback(`✅ Correct! ${item.term} matches ${target}`);
    } else {
      setFeedback(`❌ Incorrect! ${item.term} does not match ${target}`);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="drag-and-drop-container">
        <h2>Match the Terms</h2>
        <div className="drag-and-drop-terms">
          {items.map((item) => (
            <DraggableTerm key={item.id} item={item} />
          ))}
        </div>
        <div className="drag-and-drop-targets">
          {targets.map((target, index) => (
            <DroppableTarget key={index} target={target} onDrop={(item) => handleDrop(item, target)} />
          ))}
        </div>
        <div className="drag-and-drop-feedback">{feedback}</div>
        <div className="drag-and-drop-results">
          <h3>Matched Pairs</h3>
          <ul>
            {matchedPairs.map((pair, index) => (
              <li key={index}>
                {pair.term} → {pair.match}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </DndProvider>
  );
};

const DraggableTerm = ({ item }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "term",
    item,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className="draggable-term"
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: "grab",
      }}
    >
      {item.term}
    </div>
  );
};

const DroppableTarget = ({ target, onDrop }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "term",
    drop: (item) => onDrop(item),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      className="droppable-target"
      style={{
        backgroundColor: isOver ? "#e0f7fa" : "#ffffff",
        border: isOver ? "2px dashed #004d40" : "2px solid #ccc",
      }}
    >
      {target}
    </div>
  );
};

export default DragAndDrop;