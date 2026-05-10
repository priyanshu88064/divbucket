import { describe, expect, it } from "vitest";
import {
  interactionModeForCanvas,
  parseCanvasMode,
  shouldEnablePhaseThreeAffordances,
} from "./canvas";

describe("canvas mode parsing and gating", () => {
  it("defaults to iframe when query param is absent or unknown", () => {
    expect(parseCanvasMode("")).toBe("iframe");
    expect(parseCanvasMode("?canvas=unknown")).toBe("iframe");
  });

  it("supports explicit legacy and iframe modes", () => {
    expect(parseCanvasMode("?canvas=legacy")).toBe("legacy");
    expect(parseCanvasMode("?canvas=iframe")).toBe("iframe");
  });

  it("maps iframe mode to isolated passive interaction and disables phase-3 affordances", () => {
    expect(interactionModeForCanvas("iframe")).toBe("isolated-passive");
    expect(shouldEnablePhaseThreeAffordances("iframe")).toBe(false);
  });

  it("maps legacy mode to full editor interaction and enables phase-3 affordances", () => {
    expect(interactionModeForCanvas("legacy")).toBe("full-editor");
    expect(shouldEnablePhaseThreeAffordances("legacy")).toBe(true);
  });
});
