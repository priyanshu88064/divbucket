import { describe, expect, it } from "vitest";
import { extractPlainTextFromEditable } from "./inlineText";

type FakeNode = {
  nodeType: number;
  textContent: string | null;
  tagName?: string;
  childNodes: FakeNode[];
};

const text = (value: string): FakeNode => ({
  nodeType: 3,
  textContent: value,
  childNodes: [],
});

const element = (tagName: string, childNodes: FakeNode[] = []): FakeNode => ({
  nodeType: 1,
  tagName,
  textContent: childNodes.map((child) => child.textContent || "").join(""),
  childNodes,
});

describe("inlineText helpers", () => {
  it("converts br tags and block boundaries into plain-text newlines", () => {
    const editable = element("DIV", [
      text("Hello"),
      element("BR"),
      text("world"),
      element("DIV", [text("next line")]),
    ]);

    expect(
      extractPlainTextFromEditable(editable as unknown as HTMLElement),
    ).toBe("Hello\nworld\nnext line");
  });

  it("strips rich pasted markup down to plain text", () => {
    const editable = element("DIV", [
      element("DIV", [text("Title")]),
      element("P", [text("Bold"), text(" copy")]),
      element("UL", [
        element("LI", [text("One")]),
        element("LI", [text("Two")]),
      ]),
    ]);

    expect(
      extractPlainTextFromEditable(editable as unknown as HTMLElement),
    ).toBe("Title\nBold copy\nOne\nTwo");
  });
});
