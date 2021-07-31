import { observable, action } from "mobx";

type Line = {
  tool: string;
  points: any;
  color: string;
  size: number;
};

export type ToolStoreType = {
  tool: string;
  size: number;
  color: string;
  allLine: Array<Line>;
  isDrawing: boolean;
  changeTool: (tool: string) => void;
  changeColor: (color: string) => void;
  changeSize: (size: number) => void;
  addLine: (e: any) => void;
  onLine: (msg: any) => void;
  moveMouse: (e: any) => void;
  changeIsDrawing: () => void;
};

export default class ToolSrore {
  @observable tool = "pen";
  @observable size = 5;
  @observable color = "#000000";
  @observable allLine = Array();
  @observable isDrawing = false;

  @action.bound changeTool(tool: string) {
    this.tool = tool;
  }
  @action.bound changeSize(size: number) {
    this.size = size;
  }
  @action.bound changeColor(color: string) {
    this.color = color;
  }

  @action.bound onLine(msg: any) {
    this.allLine.push(msg);
  }

  @action.bound addLine(e: any) {
    this.isDrawing = true;
    const tool = this.tool;
    const size = this.size;
    const pos = e.target.getStage().getPointerPosition();
    const color = this.color;
    this.allLine.push({
      tool,
      points: [pos.x, pos.y],
      color,
      size,
    });
  }

  @action.bound moveMouse(e: any) {
    if (!this.isDrawing) {
      return;
    }
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    let lastLine = this.allLine[this.allLine.length - 1];
    lastLine.points = lastLine.points.concat([point.x, point.y]);
    this.allLine.splice(this.allLine.length - 1, 1, lastLine);
    // this.allLine(this.allLine.concat());
  }

  @action.bound changeIsDrawing() {
    this.isDrawing = false;
  }
}
