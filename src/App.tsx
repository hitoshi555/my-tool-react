import React, { useEffect, useRef } from "react";
import { Stage, Layer, Line, Image } from "react-konva";
import { SketchPicker } from "react-color";
import { Box, Button } from "@material-ui/core";
import io from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:9999", {
  transports: ["websocket"],
});

type Line = {
  tool: any;
  points: any;
  color: any;
  size: any;
};

function App() {
  const [tool, setTool] = React.useState("pen");
  const [size, setSize] = React.useState(5);
  const [color, setColor] = React.useState("#000000");
  const [lines, setLines] = React.useState<Line[]>([]);
  const [allLines, setallLines] = React.useState<Line[]>([]);
  const [text, setText] = React.useState("text");

  const ButtonClick = () => {
    axios.get(`http://localhost:9999`).then((res) => {
      console.log(res.data);
    });
  };

  const isDrawing = React.useRef(false);
  const stageRef = React.useRef<any>();

  const emitData = (last: Line) => {
    socket.emit("input_event", last);
  };

  socket.off("broadcast_event");
  socket.on("broadcast_event", function (msg) {
    console.log(msg);
    setallLines([...allLines, msg]);
  });

  const handleMouseDown = (e: any) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    setallLines([
      ...allLines,
      {
        tool,
        points: [pos.x, pos.y],
        color,
        size,
      },
    ]);
    const last: Line = allLines.slice(-1)[0];
    if (last !== null) {
      emitData(last);
    }
    console.log(allLines);
  };

  const handleMouseMove = (e: any) => {
    if (!isDrawing.current) {
      return;
    }
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    let lastLine = allLines[allLines.length - 1];
    lastLine.points = lastLine.points.concat([point.x, point.y]);
    allLines.splice(allLines.length - 1, 1, lastLine);
    setallLines(allLines.concat());
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  const handleChangeComplete = (color: any) => {
    setColor(color.hex);
  };

  return (
    <>
      <Box display="flex">
        <select
          value={tool}
          onChange={(e) => {
            setTool(e.target.value);
          }}
        >
          <option value="pen">ペン</option>
          <option value="eraser">消しゴム</option>
        </select>
        <select
          value={size}
          onChange={(e: any) => {
            setSize(e.target.value);
          }}
        >
          <option value="3">3</option>
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="15">15</option>
          <option value="20">20</option>
        </select>
      </Box>
      <Box display="flex">
        <Box bgcolor="#ffffff" width="303px" height="303px">
          <Stage
            width={300}
            height={300}
            onTouchstart={handleMouseDown}
            onTouchmove={handleMouseMove}
            onTouchend={handleMouseUp}
            onMouseDown={handleMouseDown}
            onMousemove={handleMouseMove}
            onMouseup={handleMouseUp}
            style={{
              border: "solid",
              marginTop: "10px",
              touchAction: "none",
            }}
            ref={stageRef}
          >
            <Layer>
              {allLines.map((line, i) => (
                <Line
                  key={i}
                  points={line.points}
                  stroke={line.color}
                  strokeWidth={line.size}
                  tension={0.5}
                  lineCap="round"
                  globalCompositeOperation={
                    line.tool === "eraser" ? "destination-out" : "source-over"
                  }
                />
              ))}
            </Layer>
          </Stage>
        </Box>
        <SketchPicker color={color} onChangeComplete={handleChangeComplete} />
      </Box>
      <Box mt={8}>
        <Button onClick={()=>ButtonClick()}>aaaa</Button>
      </Box>
      <Box>
        <p>{text}</p>
      </Box>
    </>
  );
}

export default App;
