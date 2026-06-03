import { beforeEach, describe, expect, it } from "vitest";
import {
  cancelInlineTextEdit,
  commitInlineTextEdit,
  getInlineTextEditStateSnapshot,
  startInlineTextEdit,
  updateInlineTextDraft,
} from "./inlineTextEditSession";

describe("inlineTextEditSession", () => {
  beforeEach(() => {
    cancelInlineTextEdit();
  });

  it("starts and updates a single inline editing session", () => {
    startInlineTextEdit(7, "legacy", "Hello");
    expect(getInlineTextEditStateSnapshot()).toEqual({
      editingNodeId: 7,
      surfaceId: "legacy",
      originalContent: "Hello",
      draftContent: "Hello",
      isDirty: false,
    });

    updateInlineTextDraft("Hello world");
    expect(getInlineTextEditStateSnapshot()).toEqual({
      editingNodeId: 7,
      surfaceId: "legacy",
      originalContent: "Hello",
      draftContent: "Hello world",
      isDirty: true,
    });
  });

  it("commits or cancels by clearing the active session", () => {
    startInlineTextEdit(9, "iframe", "Copy");
    updateInlineTextDraft("Updated");

    expect(commitInlineTextEdit()).toEqual({
      editingNodeId: 9,
      surfaceId: "iframe",
      originalContent: "Copy",
      draftContent: "Updated",
      isDirty: true,
    });
    expect(getInlineTextEditStateSnapshot().editingNodeId).toBeNull();

    startInlineTextEdit(11, "legacy", "Again");
    expect(cancelInlineTextEdit()?.editingNodeId).toBe(11);
    expect(getInlineTextEditStateSnapshot().editingNodeId).toBeNull();
  });

  it("keeps only one active session at a time", () => {
    startInlineTextEdit(1, "legacy", "One");
    startInlineTextEdit(2, "iframe", "Two");

    expect(getInlineTextEditStateSnapshot()).toEqual({
      editingNodeId: 2,
      surfaceId: "iframe",
      originalContent: "Two",
      draftContent: "Two",
      isDirty: false,
    });
  });
});
