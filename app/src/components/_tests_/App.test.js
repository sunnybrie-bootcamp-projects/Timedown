import React from "react";

import TestRenderer from "react-test-renderer";

import App from "../App";

it("Renders Loading message", () => {
  const testRenderer = TestRenderer.create(<App />);
  const testInstance = testRenderer.root;
  expect(testInstance.findAllByType("p").length).toBe(2);
});
