import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { ToolStoreType } from "../stores/toolStore";
import { SketchPicker } from "react-color";
import { Box } from "@material-ui/core";
import { Stage, Layer, Line } from "react-konva";
import Draggable from "react-draggable";

type Props = {
  tool?: ToolStoreType;
};

type LineType = {
  tool: any;
  points: any;
  color: any;
  size: any;
};

@inject("tool")
@observer
class DrawTool extends Component<Props> {
  render() {
    const { tool } = this.props;

    return (
      <>
        <Box position="relative">
          <Box position="absolute" zIndex="10" width="0" height="0">
            <Draggable>
              <Box>
                <Box>
                  <Box display="flex">
                    <select
                      value={tool!.tool}
                      onChange={(e) => {
                        tool!.changeTool(e.target.value);
                      }}
                    >
                      <option value="pen">ペン</option>
                      <option value="eraser">消しゴム</option>
                    </select>
                    <select
                      value={tool!.size}
                      onChange={(e: any) => {
                        tool!.changeSize(e.target.value);
                      }}
                    >
                      <option value="3">3</option>
                      <option value="5">5</option>
                      <option value="10">10</option>
                      <option value="15">15</option>
                      <option value="20">20</option>
                    </select>
                  </Box>
                  <SketchPicker
                    color={tool!.color}
                    onChangeComplete={(color: any) =>
                      tool!.changeColor(color.hex)
                    }
                  />
                </Box>
              </Box>
            </Draggable>
          </Box>
          <Box bgcolor="#ffffff" width="614px" height="819px" margin="auto">
            <Stage
              width={614}
              height={819}
              onTouchstart={(e: any) => {
                tool!.addLine(e);
              }}
              onTouchmove={(e: any) => tool!.moveMouse(e)}
              onTouchend={() => {
                tool!.changeIsDrawing();
              }}
              onMouseDown={(e: any) => {
                tool!.addLine(e);
              }}
              onMousemove={(e: any) => tool!.moveMouse(e)}
              onMouseup={() => {
                tool!.changeIsDrawing();
              }}
              style={{
                border: "solid",
                touchAction: "none",
              }}
            >
              <Layer>
                {tool!.allLine.map((line, i) => (
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
        </Box>
      </>
    );
  }
}

export default DrawTool;
