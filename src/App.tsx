import React, { useState, useRef, useEffect } from "react";

function App() {
  interface Line {
    x: number;
    y: number;
    color: string;
  }

  const [drawing, setDrawing] = useState(false);
  const [lines, setLines] = useState<Line[]>([]); 
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [redoArray, setRedoArray] = useState<Line[]>([]);
  const [penColor, setPenColor] = useState("#000000");

  function ColorPicker() {
    return (
      <input
        className="mt-4 cursor-pointer"
        type="color"
        value={penColor}
        onChange={(e) => setPenColor(e.target.value)}
      />
    );
  }

  function startNewStroke(clientX: number, clientY: number) {
    setLines([...lines, { x: clientX, y: clientY, color: penColor }]);
  }

  function handleMouseDown(event: React.MouseEvent<HTMLDivElement>) {
    const { clientX, clientY } = event;
    setDrawing(true);
    startNewStroke(clientX, clientY);
    setRedoArray([]);
  }

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    if (!drawing) return;
    const { clientX, clientY } = event;
    setLines((prevLines) => [
      ...prevLines,
      { x: clientX, y: clientY, color: penColor },
    ]);
  }

  function handleMouseUp() {
    setDrawing(false);
  }

  function Undo() {
    setRedoArray([...redoArray, lines[lines.length - 1]]);
    setLines(lines.slice(0, lines.length - 1));
  }

  function Redo() {
    setLines([...lines, redoArray[redoArray.length - 1]]);
    setRedoArray(redoArray.slice(0, redoArray.length - 1));
  }

  function Clear() {
    setLines([]);
    setRedoArray([]);
  }

  useEffect(() => {
    if (!canvasRef.current) return;

    const context = canvasRef.current.getContext("2d");
    if (!context) return;

    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    lines.forEach((point, index) => {
      if (index === 0 || point.color !== lines[index - 1]?.color) {

        context.beginPath();
        context.moveTo(point.x, point.y);
      } else {
        context.lineTo(point.x, point.y);
        context.strokeStyle = point.color;
        context.stroke();
      }
    });
  }, [lines]);

  return (
    <>
      <div className="flex gap-4 mt-2 mx-4">
        <button onClick={Undo} disabled={lines.length === 0} className="text-white disabled:bg-gray-300 disabled:cursor-not-allowed hover:text-gray-200 bg-sky-400 rounded-xl p-3 text-2xl">
          Undo
        </button>
        <button
          disabled={redoArray.length === 0}
          onClick={Redo}
          className={`text-white ${
            redoArray.length === 0 ? 'cursor-not-allowed bg-gray-300' : 'hover:text-gray-200 bg-sky-400'
          } rounded-xl p-3 text-2xl`}
        >
          Redo
        </button>
        <button
          onClick={Clear}
          disabled={lines.length === 0}
          className={`text-white ${
            lines.length === 0 ? 'cursor-not-allowed bg-gray-300' : 'hover:text-gray-200 bg-sky-400'
          } rounded-xl p-3 text-2xl`}
        >
          Clear
        </button>
        <ColorPicker />
      </div>

      <div
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="Container rounded-lg h-[90vh] w-[98vw]  border-2 border-black flex mx-auto mt-4"
      >
        <canvas className="bg-orange-200" ref={canvasRef} width={window.innerWidth - 20} height={window.innerHeight * 0.9} />
      </div>
    </>
  );
}

export default App;
