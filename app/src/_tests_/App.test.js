import React from "react";

import TestRenderer from "react-test-renderer";

import App from "../App";

jest.mock("../ApiClient");

it("Renders greeting messages", () => {
  const testRenderer = TestRenderer.create(<App />);
  const testInstance = testRenderer.root;
  expect(testInstance.findAllByType("p").length).toBe(2);
});

it("Renders login buttons", () => {
  const testRenderer = TestRenderer.create(<App />);
  const testInstance = testRenderer.root;
  expect(testInstance.findAllByType("button").length).toBe(2);
});

it("Renders consistently", () => {
  const testRenderer = TestRenderer.create(<App />).toJSON();
  expect(testRenderer).toMatchSnapshot();
});

it("Changes message on login/register click", () => {
  const app = TestRenderer.create(<App />);
  const $ = require("jquery");
});