import React from "react";
import { Provider } from "mobx-react";
import ToolStore from "./stores/toolStore";
import DrawTool from "./components/draw";

function App() {
  const stores = new ToolStore();

  return (
    <>
      <Provider tool={stores}>
        <DrawTool />
      </Provider>
    </>
  );
}

export default App;
