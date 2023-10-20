import React, { useState, useRef } from "react";
import "./App.css";
import imageSrc from "./pages/image.png";

function App() {
  const [rectangles, setRectangles] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedRect, setSelectedRect] = useState(null);
  const [resizing, setResizing] = useState(null);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const textareaRef = useRef(null);
  const [displayedJSON, setDisplayedJSON] = useState("");

  const handleMouseDown = (e) => {
    if (resizing === null) {
      setIsDrawing(true);
      setStartX(e.nativeEvent.offsetX);
      setStartY(e.nativeEvent.offsetY);
    }
  };

  const handleMouseUp = (e) => {
    if (isDrawing) {
      const endX = e.nativeEvent.offsetX;
      const endY = e.nativeEvent.offsetY;
      setRectangles([
        ...rectangles,
        {
          x: Math.min(startX, endX),
          y: Math.min(startY, endY),
          w: Math.abs(endX - startX),
          h: Math.abs(endY - startY),
        },
      ]);
      setIsDrawing(false);
    }
    setResizing(null);
  };

  const handleMouseMove = (e) => {
    if (resizing && selectedRect !== null) {
      const newRectangles = [...rectangles];
      const rect = newRectangles[selectedRect];
      switch (resizing) {
        case "topLeft":
          rect.w += rect.x - e.nativeEvent.offsetX;
          rect.h += rect.y - e.nativeEvent.offsetY;
          rect.x = e.nativeEvent.offsetX;
          rect.y = e.nativeEvent.offsetY;
          break;
        case "topRight":
          rect.w = e.nativeEvent.offsetX - rect.x;
          rect.h += rect.y - e.nativeEvent.offsetY;
          rect.y = e.nativeEvent.offsetY;
          break;
        case "bottomLeft":
          rect.w += rect.x - e.nativeEvent.offsetX;
          rect.h = e.nativeEvent.offsetY - rect.y;
          rect.x = e.nativeEvent.offsetX;
          break;
        case "bottomRight":
          rect.w = e.nativeEvent.offsetX - rect.x;
          rect.h = e.nativeEvent.offsetY - rect.y;
          break;
        default:
          break;
      }
      setRectangles(newRectangles);
    }
  };

  const handleRectangleClick = (index) => {
    setSelectedRect(index);
  };

  const generateJSON = () => {
    const json = { coordinates: {} };
    rectangles.forEach((rect, index) => {
      json.coordinates[index] = rect;
    });
    return JSON.stringify(json, null, 2);
  };

  const handleJSONSubmit = () => {
    const json = JSON.parse(textareaRef.current.value);
    setRectangles(Object.values(json.coordinates));
  };

  const handleKeyDown = (e) => {
    if (["Delete", "Backspace", "r"].includes(e.key) && selectedRect !== null) {
      const newRectangles = [...rectangles];
      newRectangles.splice(selectedRect, 1);
      setRectangles(newRectangles);
      setSelectedRect(null);
    }
  };
  console.log(generateJSON(), "generateJSON()");

  return (
    <div
      className="App"
      onKeyDown={handleKeyDown}
      tabIndex="0"
      onMouseMove={handleMouseMove}
      style={{ display: "flex", flexDirection: "column", alignItems: "center", height: "100vh", backgroundColor: "black" }}
    >
      <img
        src={imageSrc}
        alt="background"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        draggable={false}
        style={{ width: "100%", maxHeight: "80vh" }}
      />
      {rectangles.map((rect, idx) => (
        <div
          key={idx}
          style={{
            position: "absolute",
            border: "2px solid red",
            left: rect.x,
            top: rect.y,
            width: rect.w,
            height: rect.h,
            backgroundColor:
              idx === selectedRect ? "rgba(255,0,0,0.2)" : "transparent",
          }}
          onClick={() => handleRectangleClick(idx)}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "10px",
              height: "10px",
              backgroundColor: "white",
              border: "1px solid black",
              cursor: "nw-resize",
            }}
            onMouseDown={() => {
              setSelectedRect(idx);
              setResizing("topLeft");
            }}
          ></div>
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "10px",
              height: "10px",
              backgroundColor: "white",
              border: "1px solid black",
              cursor: "ne-resize",
            }}
            onMouseDown={() => {
              setSelectedRect(idx);
              setResizing("topRight");
            }}
          ></div>
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: "10px",
              height: "10px",
              backgroundColor: "white",
              border: "1px solid black",
              cursor: "sw-resize",
            }}
            onMouseDown={() => {
              setSelectedRect(idx);
              setResizing("bottomLeft");
            }}
          ></div>
          <div
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              width: "10px",
              height: "10px",
              backgroundColor: "white",
              border: "1px solid black",
              cursor: "se-resize",
            }}
            onMouseDown={() => {
              setSelectedRect(idx);
              setResizing("bottomRight");
            }}
          ></div>
        </div>
      ))}
      <div style={{ display: "flex", justifyContent: "space-between", width: "100%", padding: "10px 50px", marginTop: "20px", backgroundColor: "#282c34" }}>
        <div>
          <button
            onClick={() => {
              setDisplayedJSON(generateJSON());
            }}
            style={{ padding: "10px 15px", backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}
          >
            Generate JSON
          </button>
          <div
            style={{
              marginTop: '10px',
              marginBottom: '10PX',
              backgroundColor: 'rgba(0,123,255,0.1)',
              borderRadius: '5px',
              padding: '40px',
              wordBreak: 'break-word',
              width: '300px',
              overflowY: 'auto',
              maxHeight: '200px',
              fontFamily: 'monospace',
              border: '1px solid rgba(0,123,255,0.5)'
            }}
          >
            <pre style={{ color: 'white', margin: 0 }}>{displayedJSON}</pre>
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(displayedJSON);
              alert('JSON copied to clipboard!');
            }}
            style={{ marginTop: '10px', padding: "10px 15px", backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}
          >
            Copy to Clipboard
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <textarea ref={textareaRef} style={{ width: '300px', marginBottom: '10px', borderRadius: '5px', padding: '10px' }}></textarea>
          <button onClick={handleJSONSubmit} style={{ padding: "10px 15px", backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}>
            Load JSON
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;