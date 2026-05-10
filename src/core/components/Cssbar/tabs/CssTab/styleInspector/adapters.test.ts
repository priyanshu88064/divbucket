import { describe, expect, it } from "vitest";
import {
  backgroundAdapter,
  shadowAdapter,
  spacingAdapter,
  transformAdapter,
} from "./adapters";

describe("style inspector adapters", () => {
  it("background mode switching preserves expected css keys", () => {
    const base = {
      backgroundImage: "url(example.com/bg.png)",
      backgroundColor: "#ff0000",
      backgroundRepeat: "repeat",
      backgroundPosition: "center",
      backgroundSize: "cover",
    };

    const solid = backgroundAdapter.format("Solid", base);
    expect(solid.backgroundColor).toBeTruthy();
    expect(solid.backgroundImage).toBeUndefined();

    const url = backgroundAdapter.format("URL", { backgroundColor: "#ffffff" });
    expect(url.backgroundImage).toContain("url(");
    expect(url.backgroundRepeat).toBe("no-repeat");

    const custom = backgroundAdapter.format("Custom", {
      backgroundColor: "#ffffff",
    });
    expect(custom.background).toBe("transparent");
    expect(custom.backgroundColor).toBeUndefined();
  });

  it("spacing adapter applies linked axis updates", () => {
    const xLinked = spacingAdapter.updateDirectionalValue({
      style: {},
      prefix: "margin",
      dir: "Left",
      value: "12px",
      linkMode: "x",
    });
    expect(xLinked.marginLeft).toBe("12px");
    expect(xLinked.marginRight).toBe("12px");

    const allLinked = spacingAdapter.updateDirectionalValue({
      style: {},
      prefix: "padding",
      dir: "Top",
      value: "4px",
      linkMode: "all",
    });
    expect(allLinked.paddingTop).toBe("4px");
    expect(allLinked.paddingRight).toBe("4px");
    expect(allLinked.paddingBottom).toBe("4px");
    expect(allLinked.paddingLeft).toBe("4px");
  });

  it("shadow adapter keeps color while changing level", () => {
    const parsed = shadowAdapter.parseBoxShadow({
      boxShadow: "0 1px 3px #123456",
    });
    expect(parsed.level).toBe("Extra-small");
    expect(parsed.color).toBe("#123456");
    expect(
      shadowAdapter.formatBoxShadow({ level: "Large", color: parsed.color }),
    ).toContain("#123456");
  });

  it("transform adapter round-trips split values", () => {
    const parsed = transformAdapter.parse({
      translate: "10px 20px",
      scale: "1.2 0.8",
      rotate: "45deg",
    });

    expect(parsed.translateX).toBe("10px");
    expect(parsed.translateY).toBe("20px");
    expect(parsed.scaleX).toBe("1.2");
    expect(parsed.scaleY).toBe("0.8");
    expect(parsed.rotate).toBe("45deg");

    const formatted = transformAdapter.format(parsed);
    expect(formatted.translate).toBe("10px 20px");
    expect(formatted.scale).toBe("1.2 0.8");
    expect(formatted.rotate).toBe("45deg");
  });
});
