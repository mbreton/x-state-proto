import React from "react";
import "./App.css";
import { createBrowserInspector } from "@statelyai/inspect";
import { createActor, InspectionEvent, Observer } from "xstate";
import { accountStateMachine } from "x-state-proto-domain";

fetch("http://localhost:4000/account/3/inspect")
  .then((res) => res.json())
  .then(({ snapshot }) => {
    const inspector = createBrowserInspector();
    const actor = createActor(accountStateMachine, {
      inspect: inspector.inspect as Observer<InspectionEvent>,
      snapshot,
    });

    actor.start();
  });

function App() {
  return <div className="App"></div>;
}

export default App;
