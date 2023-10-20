import React, { useRef, useState } from 'react';

function ImageDisplay({ imageSrc, onRectangleDrawn }) {
  const [startX, setStartX] = useState(null);
  const [startY, setStartY] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const imageRef = useRef(null);

  const handleMouseDown = (e) => {
    setIsDrawing(true);
    setStartX(e.clientX - imageRef.current.getBoundingClientRect().left);
    setStartY(e.clientY - imageRef.current.getBoundingClientRect().top);
  };

  const handleMouseUp = (e) => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const endX = e.clientX - imageRef.current.getBoundingClientRect().left;
    const endY = e.clientY - imageRef.current.getBoundingClientRect().top;
    const rectangle = {
      x: startX,
      y: startY,
      w: endX - startX,
      h: endY - startY
    };
    onRectangleDrawn(rectangle);
  };

  return (
    <img
      ref={imageRef}
      src={imageSrc}
      alt="Interactive"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      style={{ cursor: 'crosshair' }}
    />
  );
}

export default ImageDisplay;