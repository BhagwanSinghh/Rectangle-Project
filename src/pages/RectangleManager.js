import React, { useState } from 'react';
import ImageDisplay from './ImageDisplay.js';

function RectangleManager({ imageSrc }) {
    const [startPoint, setStartPoint] = useState(null);
    const [rectangles, setRectangles] = useState([]);

    const handleMouseDown = (e) => {
        setStartPoint({ x: e.clientX, y: e.clientY });
    }

    const handleMouseUp = (e) => {
        if (startPoint) {
            const newRectangle = {
                x: startPoint.x,
                y: startPoint.y,
                w: e.clientX - startPoint.x,
                h: e.clientY - startPoint.y
            };
            setRectangles([...rectangles, newRectangle]);
            setStartPoint(null);
        }
    }

    return (
        <div onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>
            <img src={imageSrc} alt="Drawing area" style={{ position: 'relative' }} />
            {rectangles.map((rect, index) => (
                <div key={index} style={{
                    position: 'absolute',
                    border: '2px solid red',
                    left: rect.x,
                    top: rect.y,
                    width: rect.w,
                    height: rect.h
                }}></div>
            ))}
        </div>
    );
}

export default RectangleManager;




