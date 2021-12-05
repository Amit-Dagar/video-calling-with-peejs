import React, { PureComponent } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Assistant from "./source/Assistant";
import User from "./source/User";

export default class App extends PureComponent {
  state = {};

  render() {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/assistant" element={<Assistant />} />
          <Route path="/" element={<User />} />
        </Routes>
      </BrowserRouter>
    );
  }
}
