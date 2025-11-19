import { useDispatch, useSelector } from "react-redux";
import type {
  BackgroundType,
  CssState,
  NodeData,
} from "../../../../types/Tree";
import TextInput from "../../../../utils/inputs/TextInput/TextInput";
import Wrap from "../../Wrap";
import styles from "../../cssbar.module.css";
import type { RootState } from "../../../../store/store";
import {
  updateDataMap,
  updateStyleMap,
} from "../../../../store/reducers/treeReducer";
import FlexProperties from "../../components/FlexProperties";
import CheckBox from "../../../../utils/inputs/CheckBox/CheckBox";
import MPbox from "../../components/MPbox";
import Select from "../../../../utils/inputs/Select/Select";
import Colorpicker from "../../../../utils/inputs/Colorpicker/Colorpicker";
import { FaBold, FaItalic, FaStrikethrough, FaUnderline } from "react-icons/fa";
import { AiOutlineFontSize } from "react-icons/ai";

// for boxShadow css property
const getBoxShadowLevel = (value: string) => {
  if (!value || value.includes("0 0")) return "none";
  if (value.includes("0 1px 3px")) return "Extra-small";
  if (value.includes("0 1px 6px")) return "Small";
  if (value.includes("0 3px 6px")) return "Medium";
  if (value.includes("0 10px 15px")) return "Large";
  return "Extra-large";
};

// for textShadow css property
const getTextShadowLevel = (value: string) => {
  if (!value || value.includes("none")) return "none";
  if (value.includes("1px 1px 1px")) return "Extra-small";
  if (value.includes("2px 2px 1px")) return "Small";
  if (value.includes("3px 3px 2px")) return "Medium";
  if (value.includes("4px 5px 2px")) return "Large";
  return "Extra-large";
};

export default function ListOfProp({
  id,
  cssState,
}: {
  id: number;
  cssState: CssState;
}) {
  const dispatch = useDispatch();
  const styleMap = useSelector(
    (state: RootState) => state.treeReducer.styleMap[id][cssState],
  );
  const dataMap = useSelector(
    (state: RootState) => state.treeReducer.dataMap[id],
  );

  const UpdateStyle = (prop: keyof React.CSSProperties, value: string) => {
    let style = { ...styleMap, [prop]: value };
    if (value === "auto") delete style[prop];
    dispatch(updateStyleMap({ id, style, cssState }));
  };

  const UpdateData = (id: number, data: NodeData[number]) => {
    dispatch(updateDataMap({ id, data }));
  };

  const updateBackgroundImageType = (type: BackgroundType) => {
    const tempStyleMap = { ...styleMap };

    switch (type) {
      case "Auto":
        tempStyleMap.background = "transparent";
        delete tempStyleMap.backgroundColor;
        delete tempStyleMap.backgroundImage;
        delete tempStyleMap.backgroundRepeat;
        delete tempStyleMap.backgroundPosition;
        delete tempStyleMap.backgroundSize;
        break;
      case "Solid":
        tempStyleMap.backgroundColor =
          tempStyleMap.backgroundColor || "#ffffff";
        delete tempStyleMap.background;
        delete tempStyleMap.backgroundImage;
        delete tempStyleMap.backgroundRepeat;
        delete tempStyleMap.backgroundPosition;
        delete tempStyleMap.backgroundSize;
        break;
      case "URL":
        tempStyleMap.backgroundImage =
          tempStyleMap.backgroundImage || "url(https://picsum.photos/200/300)";
        tempStyleMap.backgroundRepeat =
          tempStyleMap.backgroundRepeat || "no-repeat";
        tempStyleMap.backgroundPosition =
          tempStyleMap.backgroundPosition || "left top";
        tempStyleMap.backgroundSize = tempStyleMap.backgroundSize || "auto";
        tempStyleMap.backgroundColor =
          tempStyleMap.backgroundColor || "#ffffff";
        delete tempStyleMap.background;
        break;
      case "Custom":
        tempStyleMap.background = tempStyleMap.background || "transparent";
        delete tempStyleMap.backgroundColor;
        delete tempStyleMap.backgroundImage;
        delete tempStyleMap.backgroundRepeat;
        delete tempStyleMap.backgroundPosition;
        delete tempStyleMap.backgroundSize;
        break;
    }
    UpdateData(id, {
      ...dataMap,
      cssData: { ...dataMap.cssData, backgroundType: type },
    });
    dispatch(updateStyleMap({ id, style: tempStyleMap, cssState }));
  };

  return (
    <>
      <Wrap title={"Size"}>
        <div className={`${styles.padwrap} flex flex-col gap-5`}>
          <div className="flex justify-between gap-[5px]">
            <div className={styles.c110}>
              <div className={styles.c1101}>Width</div>
              <div className={styles.c1101}>Min W</div>
              <div className={styles.c1101}>Max W</div>
            </div>
            <div className={styles.c110}>
              <TextInput
                value={styleMap.width as string}
                units={["auto", "50px", "100px", "200px", "400px", "800px"]}
                onChange={(value) => UpdateStyle("width", value)}
              />
              <TextInput
                value={styleMap.minWidth as string}
                units={["auto", "50px", "100px", "200px", "400px", "800px"]}
                onChange={(value) => UpdateStyle("minWidth", value)}
              />
              <TextInput
                value={styleMap.maxWidth as string}
                units={["auto", "50px", "100px", "200px", "400px", "800px"]}
                onChange={(value: string) => UpdateStyle("maxWidth", value)}
              />
            </div>
            <div className={styles.c110} style={{ marginLeft: "10px" }}>
              <div className={styles.c1101}>Height</div>
              <div className={styles.c1101}>Min H</div>
              <div className={styles.c1101}>Max H</div>
            </div>
            <div className={styles.c110}>
              <TextInput
                value={styleMap.height as string}
                units={["auto", "20px", "40px", "80px", "100px", "200px"]}
                onChange={(value) => UpdateStyle("height", value)}
              />
              <TextInput
                value={styleMap.minHeight as string}
                units={["auto", "20px", "40px", "80px", "100px", "200px"]}
                onChange={(value) => UpdateStyle("minHeight", value)}
              />
              <TextInput
                value={styleMap.maxHeight as string}
                units={["auto", "20px", "40px", "80px", "100px", "200px"]}
                onChange={(value) => UpdateStyle("maxHeight", value)}
              />
            </div>
          </div>
        </div>
      </Wrap>

      <Wrap title={"Display"}>
        <div className={`${styles.dicont} ${styles.padwrap}`}>
          <div className={`${styles.dic0} ${styles.beffect}`}>
            <div
              className={`${styleMap.display !== "flex" && styles.beffectactivediv}`}
              onClick={() => UpdateStyle("display", "auto")}
            >
              Block
            </div>
            <div
              className={`${styleMap.display === "flex" && styles.beffectactivediv}`}
              onClick={() => UpdateStyle("display", "flex")}
            >
              Flex
            </div>
          </div>
          {styleMap.display === "flex" && (
            <>
              <FlexProperties
                id={id}
                data={{
                  name: "Direction",
                  prop: "flexDirection",
                  values: [
                    "auto",
                    "row",
                    "row-reverse",
                    "column",
                    "column-reverse",
                  ],
                }}
                onChange={(value) => UpdateStyle("flexDirection", value)}
                cssState={cssState}
              />
              <FlexProperties
                id={id}
                data={{
                  name: "Justify",
                  prop: "justifyContent",
                  values: [
                    "auto",
                    "flex-start",
                    "flex-end",
                    "center",
                    "space-around",
                    "space-between",
                    "space-evenly",
                  ],
                }}
                onChange={(value) => UpdateStyle("justifyContent", value)}
                cssState={cssState}
              />
              <FlexProperties
                id={id}
                data={{
                  name: "Align",
                  prop: "alignItems",
                  values: [
                    "auto",
                    "stretch",
                    "center",
                    "flex-start",
                    "flex-end",
                    "start",
                    "end",
                    "baseline",
                  ],
                }}
                onChange={(value) => UpdateStyle("alignItems", value)}
                cssState={cssState}
              />
              <div className={styles.dic2}>
                <div className={styles.dic20}>
                  <div
                    style={{ color: "var(--text_0)" }}
                    className={styles.c1101}
                  >
                    Gap:
                  </div>
                  <TextInput
                    value={styleMap.gap as string}
                    onChange={(value) => UpdateStyle("gap", value)}
                  />
                </div>
                <CheckBox
                  name={"flexwrap"}
                  checked={styleMap.flexWrap === "wrap"}
                  onChange={(e) =>
                    dispatch(
                      updateStyleMap({
                        id,
                        style: {
                          ...styleMap,
                          flexWrap: e.target.checked ? "wrap" : "nowrap",
                        },
                        cssState,
                      }),
                    )
                  }
                />
              </div>
            </>
          )}
        </div>
      </Wrap>

      <Wrap title={"Margin"}>
        <MPbox
          key={"marginBox" + cssState + id}
          prefix={"margin"}
          cssState={cssState}
        />
      </Wrap>

      <Wrap title={"Padding"}>
        <MPbox
          key={"paddingBox" + cssState + id}
          prefix={"padding"}
          cssState={cssState}
        />
      </Wrap>

      <Wrap title={"Appearance"}>
        <div className={`${styles.padwrap} flex flex-col gap-[15px]`}>
          <div className={styles.bg0}>
            <div className={styles.bg0name}>Background</div>
            <div className={styles.bg01}>
              <Select
                options={["Auto", "Solid", "URL", "Custom"]}
                values={["Auto", "Solid", "URL", "Custom"]}
                onChange={(value) =>
                  updateBackgroundImageType(value as BackgroundType)
                }
                value={dataMap.cssData?.backgroundType || "Auto"}
              />
              {dataMap.cssData?.backgroundType === "Solid" && (
                <Colorpicker
                  key={"backgroundColor" + cssState + id}
                  value={styleMap.backgroundColor as string}
                  onChange={(value) => UpdateStyle("backgroundColor", value)}
                />
              )}
            </div>
          </div>
          {dataMap.cssData?.backgroundType === "URL" && (
            <>
              <div className={styles.bg0}>
                <div className={styles.bg0name}>URL</div>
                <div className={styles.sizesiwrap}>
                  <TextInput
                    value={
                      (styleMap.backgroundImage as string)
                        .split("url(")[1]
                        .split(")")[0]
                    }
                    onChange={(value) =>
                      UpdateStyle("backgroundImage", `url(${value})`)
                    }
                  />
                </div>
              </div>
              <div className={styles.bg0}>
                <div className={styles.bg0name}>Repeat</div>
                <div className={styles.sizesiwrap}>
                  <TextInput
                    value={styleMap.backgroundRepeat || "no-repeat"}
                    units={[
                      "no-repeat",
                      "repeat",
                      "repeat-x",
                      "repeat-y",
                      "space",
                      "space-repeat",
                      "round",
                    ]}
                    onChange={(value) => UpdateStyle("backgroundRepeat", value)}
                    isSelectOnly={true}
                  />
                </div>
              </div>
              <div className={styles.bg0}>
                <div className={styles.bg0name}>Position</div>
                <div className={styles.sizesiwrap}>
                  <TextInput
                    value={
                      (styleMap.backgroundPosition as string) || "left top"
                    }
                    units={[
                      "center",
                      "left",
                      "left top",
                      "left bottom",
                      "top",
                      "top left",
                      "top right",
                      "right",
                      "right top",
                      "right bottom",
                      "bottom",
                      "bottom left",
                      "bottom right",
                    ]}
                    onChange={(value) =>
                      UpdateStyle("backgroundPosition", value)
                    }
                    isSelectOnly={true}
                  />
                </div>
              </div>
              <div className={styles.bg0}>
                <div className={styles.bg0name}>Size</div>
                <div className={styles.sizesiwrap}>
                  <TextInput
                    value={(styleMap.backgroundSize as string) || "auto"}
                    units={["auto", "cover", "contain"]}
                    onChange={(value) => UpdateStyle("backgroundSize", value)}
                    isSelectOnly={true}
                  />
                </div>
              </div>
              <div className={styles.bg0}>
                <div className={styles.bg0name}>Color</div>
                <div className={styles.sizesiwrap}>
                  <Colorpicker
                    key={"urlBackgroundColor" + cssState + id}
                    value={styleMap.backgroundColor as string}
                    onChange={(value) => UpdateStyle("backgroundColor", value)}
                  />
                </div>
              </div>
            </>
          )}
          {dataMap.cssData?.backgroundType === "Custom" && (
            <div className={styles.bg0}>
              <div className={styles.bg0name}>Value</div>
              <div className={styles.sizesiwrap}>
                <TextInput
                  value={styleMap.background as string}
                  onChange={(value) => UpdateStyle("background", value)}
                />
              </div>
            </div>
          )}

          <div className={styles.bg0}>
            <div className={styles.bg0name}>Opacity</div>
            <div className={styles.sizesiwrap}>
              <TextInput
                value={(styleMap.opacity as string) || "1"}
                onChange={(value) => UpdateStyle("opacity", value)}
              />
            </div>
          </div>
        </div>
      </Wrap>

      <Wrap title={"Typography"}>
        <div className={`${styles.padwrap} ${styles.bgwrap}`}>
          <div className="flex justify-between items-center">
            <div className={`${styles.holder}`}>
              <div
                title="bold"
                className={`${styles.holder0} ${styleMap.fontWeight === "bold" ? styles.holderactive : ""}`}
                onClick={() => {
                  if (styleMap.fontWeight === "bold")
                    UpdateStyle("fontWeight", "auto");
                  else UpdateStyle("fontWeight", "bold");
                }}
              >
                <FaBold />
              </div>
              <div
                title="italic"
                className={`${styles.holder0} ${styleMap.fontStyle === "italic" ? styles.holderactive : ""}`}
                onClick={() => {
                  if (styleMap.fontStyle === "italic")
                    UpdateStyle("fontStyle", "auto");
                  else UpdateStyle("fontStyle", "italic");
                }}
              >
                <FaItalic />
              </div>
              <div
                title="underline"
                className={`${styles.holder0} ${styleMap.textDecoration === "underline" ? styles.holderactive : ""}`}
                onClick={() => {
                  if (styleMap.textDecoration === "underline")
                    UpdateStyle("textDecoration", "auto");
                  else UpdateStyle("textDecoration", "underline");
                }}
              >
                <FaUnderline />
              </div>
              <div
                title="strikethrough"
                className={`${styles.holder0} ${styleMap.textDecoration === "line-through" ? styles.holderactive : ""}`}
                onClick={() => {
                  if (styleMap.textDecoration === "line-through")
                    UpdateStyle("textDecoration", "auto");
                  else UpdateStyle("textDecoration", "line-through");
                }}
              >
                <FaStrikethrough />
              </div>
              <div
                title="small-caps"
                className={`${styles.holder0} ${styleMap.fontVariant === "small-caps" ? styles.holderactive : ""}`}
                onClick={() => {
                  if (styleMap.fontVariant === "small-caps")
                    UpdateStyle("fontVariant", "auto");
                  else UpdateStyle("fontVariant", "small-caps");
                }}
              >
                <AiOutlineFontSize size={15} color="var(--text_0)" />
              </div>
            </div>
            <Colorpicker
              key={"textColor" + cssState + id}
              value={styleMap.color || "#000000"}
              onChange={(value) => UpdateStyle("color", value)}
            />
          </div>
          <div className={styles.bg0}>
            <div className={styles.bg0name}>Family</div>
            <div className={styles.fontselect}>
              <input
                type="text"
                className={`${styles.fontsi} ${!styleMap.fontFamily ? styles.fontdefault : ""}`}
                value={styleMap.fontFamily || "auto"}
                readOnly
              />
              <div className={styles.fontdrop}>
                {[
                  "auto",
                  "serif",
                  "sans-serif",
                  "monospace",
                  "cursive",
                  "fantasy",
                  "system-ui",
                  "ui-serif",
                  "ui-sans-serif",
                  "ui-monospace",
                  "ui-rounded",
                  "emoji",
                  "math",
                  "fangsong",
                ].map((font) => (
                  <div
                    key={font}
                    style={{ fontFamily: font !== "auto" ? font : "" }}
                    onMouseDown={() => UpdateStyle("fontFamily", font)}
                  >
                    {font}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className={styles.bg0}>
            <div className={styles.bg0name}>Font-Size</div>
            <div className={styles.sizesiwrap}>
              <TextInput
                value={styleMap.fontSize as string}
                units={[
                  "auto",
                  "8px",
                  "10px",
                  "12px",
                  "14px",
                  "16px",
                  "20px",
                  "24px",
                ]}
                onChange={(value) => UpdateStyle("fontSize", value)}
              />
            </div>
          </div>
          <div className={styles.bg0}>
            <div className={styles.bg0name}>Font-Weight</div>
            <div className={styles.sizesiwrap}>
              <TextInput
                value={styleMap.fontWeight as string}
                units={[
                  "auto",
                  "bold",
                  "bolder",
                  "lighter",
                  "100",
                  "200",
                  "300",
                  "400",
                  "500",
                  "600",
                ]}
                onChange={(value) => UpdateStyle("fontWeight", value)}
              />
            </div>
          </div>
          <div className={styles.bg0}>
            <div className={styles.bg0name}>Transform</div>
            <div className={styles.sizesiwrap}>
              <TextInput
                value={styleMap.textTransform || "none"}
                units={["none", "uppercase", "lowercase", "capitalize"]}
                onChange={(value) => UpdateStyle("textTransform", value)}
                isSelectOnly={true}
              />
            </div>
          </div>
          <div className={styles.bg0}>
            <div className={styles.bg0name}>Alignment</div>
            <div className={styles.sizesiwrap}>
              <TextInput
                value={styleMap.textAlign || "left"}
                units={["left", "right", "center", "justify"]}
                onChange={(value) => UpdateStyle("textAlign", value)}
                isSelectOnly={true}
              />
            </div>
          </div>
          <div className={styles.bg0}>
            <div className={styles.bg0name}>Word-Spacing</div>
            <div className={styles.sizesiwrap}>
              <TextInput
                value={(styleMap.wordSpacing as string) || "normal"}
                units={["normal", "4px", "8px", "12px"]}
                onChange={(value) => UpdateStyle("wordSpacing", value)}
              />
            </div>
          </div>
          <div className={styles.bg0}>
            <div className={styles.bg0name}>Letter-Spacing</div>
            <div className={styles.sizesiwrap}>
              <TextInput
                value={(styleMap.letterSpacing as string) || "normal"}
                units={["normal", "4px", "8px", "12px"]}
                onChange={(value) => UpdateStyle("letterSpacing", value)}
              />
            </div>
          </div>
        </div>
      </Wrap>

      <Wrap title={"Border"}>
        <div className={`${styles.padwrap} ${styles.bgwrap}`}>
          <div className={styles.bg0}>
            <div className={styles.bg0name}>Border-Style</div>
            <div className={styles.sizesiwrap}>
              <TextInput
                value={(styleMap.borderStyle as string) || "none"}
                units={[
                  "none",
                  "solid",
                  "dotted",
                  "dashed",
                  "double",
                  "groove",
                ]}
                onChange={(value) => UpdateStyle("borderStyle", value)}
                isSelectOnly={true}
              />
            </div>
          </div>

          <div className={`relative flex justify-between`}>
            <div className={styles.bg0name}>Border-Width</div>
            <div className="ml-auto w-[100px] flex items-center gap-1 rounded-[5px]">
              <TextInput
                value={(styleMap.borderWidth as string) || "0"}
                units={["0", "1px", "2px", "3px", "4px"]}
                onChange={(value) => UpdateStyle("borderWidth", value)}
              />
              <Colorpicker
                key={"borderColor" + cssState + id}
                value={styleMap.borderColor || "#000000"}
                onChange={(value) => UpdateStyle("borderColor", value)}
              />
            </div>
            <div className="absolute bottom-0 left-4 h-[172px] translate-y-full border-l border-gray-600"></div>
          </div>
          <div className={`${styles.bg0} relative ml-4 pl-4`}>
            <div className="absolute left-0 w-3 top-[50%] border-b border-gray-600"></div>
            <div className={styles.bg0name}>Top</div>
            <div className={`${styles.sizesiwrap} !w-16`}>
              <TextInput
                value={(styleMap.borderTopWidth as string) || "0"}
                units={["0", "1px", "2px", "3px", "4px"]}
                onChange={(value) => UpdateStyle("borderTopWidth", value)}
              />
            </div>
          </div>
          <div className={`${styles.bg0} relative ml-4 pl-4`}>
            <div className="absolute left-0 w-3 top-[50%] border-b border-gray-600"></div>
            <div className={styles.bg0name}>Bottom</div>
            <div className={`${styles.sizesiwrap} !w-16`}>
              <TextInput
                value={(styleMap.borderBottomWidth as string) || "0"}
                units={["0", "1px", "2px", "3px", "4px"]}
                onChange={(value) => UpdateStyle("borderBottomWidth", value)}
              />
            </div>
          </div>
          <div className={`${styles.bg0} relative ml-4 pl-4`}>
            <div className="absolute left-0 w-3 top-[50%] border-b border-gray-600"></div>
            <div className={styles.bg0name}>Right</div>
            <div className={`${styles.sizesiwrap} !w-16`}>
              <TextInput
                value={(styleMap.borderRightWidth as string) || "0"}
                units={["0", "1px", "2px", "3px", "4px"]}
                onChange={(value) => UpdateStyle("borderRightWidth", value)}
              />
            </div>
          </div>
          <div className={`${styles.bg0} relative ml-4 pl-4`}>
            <div className="absolute left-0 w-3 top-[50%] border-b border-gray-600"></div>
            <div className={styles.bg0name}>Left</div>
            <div className={`${styles.sizesiwrap} !w-16`}>
              <TextInput
                value={(styleMap.borderLeftWidth as string) || "0"}
                units={["0", "1px", "2px", "3px", "4px"]}
                onChange={(value) => UpdateStyle("borderLeftWidth", value)}
              />
            </div>
          </div>

          <div className={styles.bg0}>
            <div className={styles.bg0name}>Border-Radius</div>
            <div className={styles.sizesiwrap}>
              <TextInput
                value={(styleMap.borderRadius as string) || "0"}
                units={["0", "2px", "4px", "8px", "50%", "100%"]}
                onChange={(value) => UpdateStyle("borderRadius", value)}
              />
            </div>
          </div>
        </div>
      </Wrap>

      <Wrap title={"Position"}>
        <div className={`${styles.padwrap} ${styles.bgwrap}`}>
          <div className={styles.bg0}>
            <div className={styles.bg0name}>Position</div>
            <div className={styles.sizesiwrap}>
              <TextInput
                value={styleMap.position || "static"}
                units={["static", "relative", "absolute", "fixed"]}
                onChange={(value) => UpdateStyle("position", value)}
                isSelectOnly={true}
              />
            </div>
          </div>
          {styleMap.position && styleMap.position !== "static" && (
            <>
              <div className={styles.bg0}>
                <div className={styles.bg0name}>Top</div>
                <div className={styles.sizesiwrap}>
                  <TextInput
                    value={(styleMap.top as string) || "auto"}
                    onChange={(value) => UpdateStyle("top", value)}
                  />
                </div>
              </div>
              {styleMap.position !== "fixed" && (
                <>
                  <div className={styles.bg0}>
                    <div className={styles.bg0name}>Right</div>
                    <div className={styles.sizesiwrap}>
                      <TextInput
                        value={(styleMap.right as string) || "auto"}
                        onChange={(value) => UpdateStyle("right", value)}
                      />
                    </div>
                  </div>
                  <div className={styles.bg0}>
                    <div className={styles.bg0name}>Bottom</div>
                    <div className={styles.sizesiwrap}>
                      <TextInput
                        value={(styleMap.bottom as string) || "auto"}
                        onChange={(value) => UpdateStyle("bottom", value)}
                      />
                    </div>
                  </div>
                </>
              )}
              <div className={styles.bg0}>
                <div className={styles.bg0name}>Left</div>
                <div className={styles.sizesiwrap}>
                  <TextInput
                    value={(styleMap.left as string) || "auto"}
                    onChange={(value) => UpdateStyle("left", value)}
                  />
                </div>
              </div>
              <div className={styles.bg0}>
                <div className={styles.bg0name}>Z-Index</div>
                <div className={styles.sizesiwrap}>
                  <TextInput
                    value={(styleMap.zIndex as string) || "auto"}
                    onChange={(value) => UpdateStyle("zIndex", value)}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </Wrap>

      <Wrap title={"Overflow"}>
        <div className={`${styles.padwrap} ${styles.bgwrap}`}>
          <div className={styles.bg0}>
            <div className={styles.bg0name}>Overflow-X</div>
            <div className={styles.sizesiwrap}>
              <TextInput
                value={styleMap.overflowX || "auto"}
                units={["auto", "hidden", "scroll", "visible"]}
                onChange={(value) => UpdateStyle("overflowX", value)}
                isSelectOnly={true}
              />
            </div>
          </div>
          <div className={styles.bg0}>
            <div className={styles.bg0name}>Overflow-Y</div>
            <div className={styles.sizesiwrap}>
              <TextInput
                value={styleMap.overflowY || "auto"}
                units={["auto", "hidden", "scroll", "visible"]}
                onChange={(value) => UpdateStyle("overflowY", value)}
                isSelectOnly={true}
              />
            </div>
          </div>
        </div>
      </Wrap>

      <Wrap title={"Shadows"}>
        <div className={`${styles.padwrap} ${styles.bgwrap}`}>
          <div className={styles.bg0}>
            <div className={styles.bg0name}>Box-Shadow</div>
            <div className="w-[100px] rounded-[5px] flex flex-col items-end gap-2">
              <TextInput
                value={getBoxShadowLevel(styleMap.boxShadow as string)}
                units={[
                  "none",
                  "Extra-small",
                  "Small",
                  "Medium",
                  "Large",
                  "Extra-large",
                ]}
                onChange={(value) => {
                  let prefix = "";
                  switch (value) {
                    case "none":
                      prefix = "0 0";
                      break;
                    case "Extra-small":
                      prefix = "0 1px 3px";
                      break;
                    case "Small":
                      prefix = "0 1px 6px";
                      break;
                    case "Medium":
                      prefix = "0 3px 6px";
                      break;
                    case "Large":
                      prefix = "0 10px 15px";
                      break;
                    case "Extra-large":
                      prefix = "0 25px 50px";
                      break;
                  }

                  if (styleMap.boxShadow && styleMap.boxShadow.includes("#")) {
                    UpdateStyle(
                      "boxShadow",
                      `${prefix} #${styleMap.boxShadow.split("#")[1]}`,
                    );
                  } else {
                    UpdateStyle("boxShadow", `${prefix} #000000`);
                  }
                }}
                isSelectOnly={true}
              />
              <Colorpicker
                key={"boxShadowColor" + cssState + id}
                value={
                  styleMap.boxShadow
                    ? `#${styleMap.boxShadow.split("#")[1]}`
                    : "#000000"
                }
                onChange={(value) => {
                  if (styleMap.boxShadow?.includes("#")) {
                    UpdateStyle(
                      "boxShadow",
                      `${styleMap.boxShadow.split("#")[0]}${value}`,
                    );
                  }
                }}
              />
            </div>
          </div>
          <div className={styles.bg0}>
            <div className={styles.bg0name}>Text-Shadow</div>
            <div className="w-[100px] rounded-[5px] flex flex-col items-end gap-2">
              <TextInput
                value={getTextShadowLevel(styleMap.textShadow as string)}
                units={[
                  "none",
                  "Extra-small",
                  "Small",
                  "Medium",
                  "Large",
                  "Extra-large",
                ]}
                onChange={(value) => {
                  let prefix = "";
                  switch (value) {
                    case "none":
                      prefix = "none";
                      break;
                    case "Extra-small":
                      prefix = "1px 1px 1px";
                      break;
                    case "Small":
                      prefix = "2px 2px 1px";
                      break;
                    case "Medium":
                      prefix = "3px 3px 2px";
                      break;
                    case "Large":
                      prefix = "4px 5px 2px";
                      break;
                    case "Extra-large":
                      prefix = "5px 6px 3px";
                      break;
                  }

                  if (value === "none") {
                    UpdateStyle("textShadow", "none");
                  } else if (
                    styleMap.textShadow &&
                    styleMap.textShadow.includes("#")
                  ) {
                    UpdateStyle(
                      "textShadow",
                      `${prefix} #${styleMap.textShadow.split("#")[1]}`,
                    );
                  } else {
                    UpdateStyle("textShadow", `${prefix} #000000`);
                  }
                }}
                isSelectOnly={true}
              />
              <Colorpicker
                key={"textShadowColor" + cssState + id}
                value={
                  styleMap.textShadow
                    ? `#${styleMap.textShadow.split("#")[1]}`
                    : "#000000"
                }
                onChange={(value) => {
                  if (
                    styleMap.textShadow &&
                    styleMap.textShadow.includes("#")
                  ) {
                    UpdateStyle(
                      "textShadow",
                      `${styleMap.textShadow.split("#")[0]}${value}`,
                    );
                  }
                }}
              />
            </div>
          </div>
        </div>
      </Wrap>

      <Wrap title={"Transform"}>
        <div className={`${styles.padwrap} ${styles.bgwrap}`}>
          <div className={styles.bg0}>
            <div className={styles.bg0name}>Translate-X</div>
            <div className={styles.sizesiwrap}>
              <TextInput
                value={
                  styleMap.translate
                    ? (styleMap.translate as string).split(" ")[0]
                    : "0"
                }
                units={["0", "2px", "4px", "50%", "100%"]}
                onChange={(value) => {
                  if (
                    styleMap.translate &&
                    (styleMap.translate as string).includes(" ")
                  ) {
                    UpdateStyle(
                      "translate",
                      `${value} ${(styleMap.translate as string).split(" ")[1]}`,
                    );
                  } else {
                    UpdateStyle("translate", `${value} 0`);
                  }
                }}
              />
            </div>
          </div>
          <div className={styles.bg0}>
            <div className={styles.bg0name}>Translate-Y</div>
            <div className={styles.sizesiwrap}>
              <TextInput
                value={
                  styleMap.translate
                    ? (styleMap.translate as string).split(" ")[1]
                    : "0"
                }
                units={["0", "2px", "4px", "50%", "100%"]}
                onChange={(value) => {
                  if (
                    styleMap.translate &&
                    (styleMap.translate as string).includes(" ")
                  ) {
                    UpdateStyle(
                      "translate",
                      `${(styleMap.translate as string).split(" ")[0]} ${value}`,
                    );
                  } else {
                    UpdateStyle("translate", `0 ${value}`);
                  }
                }}
              />
            </div>
          </div>
          <div className={styles.bg0}>
            <div className={styles.bg0name}>Scale-X</div>
            <div className={styles.sizesiwrap}>
              <TextInput
                value={(() => {
                  if (!styleMap.scale) return "1";
                  return (styleMap.scale as string).split(" ")[0];
                })()}
                onChange={(value) =>
                  UpdateStyle(
                    "scale",
                    (() => {
                      if (!styleMap.scale) return `${value} 1`;
                      return `${value} ${(styleMap.scale as string).split(" ")[1]}`;
                    })(),
                  )
                }
              />
            </div>
          </div>
          <div className={styles.bg0}>
            <div className={styles.bg0name}>Scale-Y</div>
            <div className={styles.sizesiwrap}>
              <TextInput
                value={(() => {
                  if (!styleMap.scale) return "1";
                  return (styleMap.scale as string).split(" ")[1];
                })()}
                onChange={(value) =>
                  UpdateStyle(
                    "scale",
                    (() => {
                      if (!styleMap.scale) return `1 ${value}`;
                      return `${(styleMap.scale as string).split(" ")[0]} ${value}`;
                    })(),
                  )
                }
              />
            </div>
          </div>
          <div className={styles.bg0}>
            <div className={styles.bg0name}>Rotate</div>
            <div className={styles.sizesiwrap}>
              <TextInput
                value={styleMap.rotate || "0"}
                units={["0deg", "45deg", "90deg", "180deg"]}
                onChange={(value) => UpdateStyle("rotate", value)}
              />
            </div>
          </div>
        </div>
      </Wrap>

      <Wrap title={"Cursor"}>
        <div className={`${styles.padwrap} ${styles.bgwrap}`}>
          <div className={styles.bg0}>
            <div className={styles.bg0name}>Cursor</div>
            <div className={styles.sizesiwrap}>
              <TextInput
                value={styleMap.cursor || "auto"}
                units={[
                  "auto",
                  "default",
                  "pointer",
                  "move",
                  "grab",
                  "grabbing",
                  "not-allowed",
                  "all-scroll",
                  "zoom-in",
                  "zoom-out",
                ]}
                onChange={(value) => UpdateStyle("cursor", value)}
                isSelectOnly={true}
              />
            </div>
          </div>
        </div>
      </Wrap>

      <Wrap title={"Transition"}>
        <div className={`${styles.padwrap} ${styles.bgwrap}`}>
          <CheckBox
            name={"Enable Transition"}
            checked={styleMap.transition != null}
            onChange={(e) =>
              UpdateStyle("transition", e.target.checked ? "all 200ms" : "auto")
            }
          />
        </div>
      </Wrap>

      <Wrap title={"Fitting & Alignment"}>
        <div className={`${styles.padwrap} ${styles.bgwrap}`}>
          <div className={styles.bg0}>
            <div className={styles.bg0name}>Object-Fit</div>
            <div className={styles.sizesiwrap}>
              <TextInput
                value={styleMap.objectFit || "none"}
                units={["none", "cover", "contain", "fill"]}
                onChange={(value) => UpdateStyle("objectFit", value)}
                isSelectOnly={true}
              />
            </div>
          </div>
          <div className={styles.bg0}>
            <div className={styles.bg0name}>Object-Position</div>
            <div className={styles.sizesiwrap}>
              <TextInput
                value={(styleMap.objectPosition as string) || "left top"}
                units={[
                  "center",
                  "left",
                  "left top",
                  "left bottom",
                  "top",
                  "top left",
                  "top right",
                  "right",
                  "right top",
                  "right bottom",
                  "bottom",
                  "bottom left",
                  "bottom right",
                ]}
                onChange={(value) => UpdateStyle("objectPosition", value)}
                isSelectOnly={true}
              />
            </div>
          </div>
        </div>
      </Wrap>
    </>
  );
}
