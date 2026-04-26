import { expect, test, mock } from "bun:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { render, find } from "../test-utils";
import Toasts from "./Toasts";

test("Toasts: returns null when empty", () => {
  const { vdom } = render(<Toasts toasts={[]} onRemove={() => {}} />);
  expect(vdom).toBe(null);
});

test("Toasts: renders multiple toasts", () => {
  const toasts = [
    { id: 1, title: "Success", message: "Everything ok", type: "ok" },
    { id: 2, title: "Error", message: "Something failed", type: "error" },
  ];
  const { vdom } = render(<Toasts toasts={toasts} onRemove={() => {}} />);

  const toastItems = find(vdom, (n) => n.props?.className?.includes("toast "));
  expect(toastItems.length).toBe(2);

  const html = renderToStaticMarkup(vdom);
  expect(html).toContain("Success");
  expect(html).toContain("Everything ok");
  expect(html).toContain("✓");
  expect(html).toContain("toast--ok");

  expect(html).toContain("Error");
  expect(html).toContain("Something failed");
  expect(html).toContain("✕");
  expect(html).toContain("toast--error");
});

test("Toasts: renders different types correctly", () => {
  const toasts = [
    { id: 3, title: "Warning", type: "warning" },
    { id: 4, title: "Info", type: "info" },
    { id: 5, title: "Default" }, // no type
  ];
  const { vdom } = render(<Toasts toasts={toasts} onRemove={() => {}} />);
  const html = renderToStaticMarkup(vdom);

  expect(html).toContain("⚠");
  expect(html).toContain("toast--warning");

  expect(html).toContain("ℹ");
  expect(html).toContain("toast--info");

  expect(html).toContain("✓");
  expect(html).toContain("toast--ok");
});

test("Toasts: calls onRemove when close button is clicked", () => {
  const onRemove = mock(() => {});
  const toasts = [{ id: 123, title: "Click me", type: "ok" }];
  const { vdom } = render(<Toasts toasts={toasts} onRemove={onRemove} />);

  const closeButtons = find(vdom, (n) => n.type === "button" && n.props?.className === "toast-close");
  expect(closeButtons.length).toBe(1);

  closeButtons[0].props.onClick();
  expect(onRemove).toHaveBeenCalledWith(123);
});
