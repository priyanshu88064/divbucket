import { describe, expect, it } from "vitest";
import previewReducer, { closePreview, preview } from "./previewReducer";

describe("previewReducer", () => {
  it("opens preview with page session inputs instead of persisted src html", () => {
    const next = previewReducer(
      undefined,
      preview({ pageId: 7, viewportPreset: "tablet" }),
    );

    expect(next).toEqual({
      isOpen: true,
      pageId: 7,
      viewportPreset: "tablet",
    });
  });

  it("closes preview and clears session inputs", () => {
    const openState = previewReducer(
      undefined,
      preview({ pageId: 3, viewportPreset: "mobile" }),
    );
    const next = previewReducer(openState, closePreview());

    expect(next).toEqual({
      isOpen: false,
      pageId: null,
      viewportPreset: null,
    });
  });
});

