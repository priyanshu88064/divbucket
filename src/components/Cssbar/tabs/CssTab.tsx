import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import { updateStyleMap } from "../../../store/reducers/treeReducer";
import Wrap from "../Wrap";
import styles from "../cssbar.module.css";
import TextInput from "../../../utils/inputs/TextInput/TextInput";
import FlexProperties from "../components/FlexProperties";
import CheckBox from "../../../utils/inputs/CheckBox/CheckBox";
import MPbox from "../components/MPbox";
import Select from "../../../utils/inputs/Select/Select";
import Colorpicker from "../../../utils/inputs/Colorpicker/Colorpicker";
import { FaBold, FaItalic, FaStrikethrough, FaUnderline } from "react-icons/fa";
import { AiOutlineFontSize } from "react-icons/ai";

const bgtype = (bg: string) => {
  if (!bg || !bg.length) return "Auto";
  if (bg.includes("http")) return "URL";
  return "Solid";
};

export default function CssTab() {
  const id = useSelector((state: RootState) => state.treeReducer.activeNodeId);
  if (!id) return <></>;

  const styleMap = useSelector(
    (state: RootState) => state.treeReducer.styleMap[id],
  );
  const dispatch = useDispatch();

  const UpdateStyle = (prop: keyof React.CSSProperties, value: string) => {
    let style = { ...styleMap, [prop]: value };
    if (value === "auto") delete style[prop];
    dispatch(updateStyleMap({ id, style }));
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
        <MPbox prefix={"margin"} />
      </Wrap>

      <Wrap title={"Padding"}>
        <MPbox prefix={"padding"} />
      </Wrap>

      <Wrap title={"Background"}>
        <div className={`${styles.padwrap} flex flex-col gap-[15px]`}>
          <div className={styles.bg0}>
            <div className={styles.bg0name}>Color:</div>
            <div className={styles.bg01}>
              <Select
                options={["Auto", "Solid", "URL"]}
                values={["auto", "white", "url(https://picsum.photos/200/300)"]}
                onChange={(value) => UpdateStyle("background", value)}
                value={bgtype(styleMap.background as string)}
              />
              {bgtype(styleMap.background as string) === "Solid" && (
                <Colorpicker
                  key={"background" + id}
                  value={styleMap.background as string}
                  onChange={(value) => UpdateStyle("background", value)}
                />
              )}
            </div>
          </div>
          {bgtype(styleMap.background as string) === "URL" && (
            <>
              <div className={styles.bg0}>
                <div className={styles.bg0name}>URL</div>
                <div className={styles.sizesiwrap}>
                  <TextInput
                    value={(styleMap.background as string).split("url(")[1]}
                    onChange={(value) =>
                      UpdateStyle("background", `url(${value})`)
                    }
                  />
                </div>
              </div>
              <div className={styles.bg0}>
                <div className={styles.bg0name}>Position</div>
                <div className={styles.sizesiwrap}>
                  <TextInput
                    value={"no-repeat"}
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
                    value={"left top"}
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
                    value={"auto"}
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
                    key={"backgroundColor" + id}
                    value={"white"}
                    onChange={(value) => UpdateStyle("backgroundColor", value)}
                  />
                </div>
              </div>
            </>
          )}
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
              key={"text" + id}
              value={styleMap.color || "black"}
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
                value={"none"}
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
                value={"left"}
                units={["left", "right", "justify"]}
                onChange={(value) => UpdateStyle("textAlign", value)}
                isSelectOnly={true}
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
                value={styleMap.borderStyle as string}
                units={[
                  "auto",
                  "solid",
                  "dotted",
                  "dashed",
                  "double",
                  "groove",
                  "hidden",
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
                value={styleMap.borderWidth as string}
                units={["auto", "1px", "2px", "3px", "4px"]}
                onChange={(value) => UpdateStyle("borderWidth", value)}
              />
              <Colorpicker
                key={"border" + id}
                value={styleMap.borderColor || "black"}
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
                value={"auto"}
                units={["auto", "1px", "2px", "3px", "4px"]}
                onChange={(value) => UpdateStyle("borderTopWidth", value)}
              />
            </div>
          </div>
          <div className={`${styles.bg0} relative ml-4 pl-4`}>
            <div className="absolute left-0 w-3 top-[50%] border-b border-gray-600"></div>
            <div className={styles.bg0name}>Bottom</div>
            <div className={`${styles.sizesiwrap} !w-16`}>
              <TextInput
                value={"auto"}
                units={["auto", "1px", "2px", "3px", "4px"]}
                onChange={(value) => UpdateStyle("borderBottomWidth", value)}
              />
            </div>
          </div>
          <div className={`${styles.bg0} relative ml-4 pl-4`}>
            <div className="absolute left-0 w-3 top-[50%] border-b border-gray-600"></div>
            <div className={styles.bg0name}>Right</div>
            <div className={`${styles.sizesiwrap} !w-16`}>
              <TextInput
                value={"auto"}
                units={["auto", "1px", "2px", "3px", "4px"]}
                onChange={(value) => UpdateStyle("borderRightWidth", value)}
              />
            </div>
          </div>
          <div className={`${styles.bg0} relative ml-4 pl-4`}>
            <div className="absolute left-0 w-3 top-[50%] border-b border-gray-600"></div>
            <div className={styles.bg0name}>Left</div>
            <div className={`${styles.sizesiwrap} !w-16`}>
              <TextInput
                value={"auto"}
                units={["auto", "1px", "2px", "3px", "4px"]}
                onChange={(value) => UpdateStyle("borderLeftWidth", value)}
              />
            </div>
          </div>

          <div className={styles.bg0}>
            <div className={styles.bg0name}>Border-Radius</div>
            <div className={styles.sizesiwrap}>
              <TextInput
                value={"0"}
                units={["0", "2px", "4px", "8px", "50%", "100%"]}
                onChange={(value) => UpdateStyle("borderRadius", value)}
              />
            </div>
          </div>
        </div>
      </Wrap>

      <Wrap title={"Overflow"}>
        <div className={`${styles.padwrap} ${styles.bgwrap}`}>
          <div className={styles.bg0}>
            <div className={styles.bg0name}>Overflow-X</div>
            <div className={styles.sizesiwrap}>
              <TextInput
                value={"auto"}
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
                value={"auto"}
                units={["auto", "hidden", "scroll", "visible"]}
                onChange={(value) => UpdateStyle("overflowY", value)}
                isSelectOnly={true}
              />
            </div>
          </div>
        </div>
      </Wrap>

      <Wrap title={"Box Shadow"}>
        <div className={`${styles.padwrap} ${styles.bgwrap}`}>
          <div className={styles.bg0}>
            <div className={styles.bg0name}>Box Shadow</div>
            <div className={styles.sizesiwrap}>
              <TextInput
                value={"none"}
                units={[
                  "none",
                  "Extra-Small",
                  "Small",
                  "Medium",
                  "Large",
                  "Extra-Large",
                  "2XL",
                ]}
                onChange={(value) => UpdateStyle("cursor", value)}
                isSelectOnly={true}
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
                value={"auto"}
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
    </>
  );
}
