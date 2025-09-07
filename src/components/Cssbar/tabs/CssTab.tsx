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
        <div className={`${styles.c11} ${styles.padwrap}`}>
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
        <div className={styles.padwrap}>
          <div className={styles.bg0}>
            <div className={styles.bg0name}>Color:</div>
            <div className={styles.bg01}>
              <Select
                options={["Auto", "Solid"]}
                values={["auto", "white"]}
                onChange={(value) => UpdateStyle("background", value)}
                value={styleMap.background ? "Solid" : "Auto"}
              />
              {styleMap.background && (
                <Colorpicker
                  key={"background" + id}
                  value={styleMap.background as string}
                  onChange={(value) => UpdateStyle("background", value)}
                />
              )}
            </div>
          </div>
        </div>
      </Wrap>
      <Wrap title={"Typography"}>
        <div className={`${styles.padwrap} ${styles.bgwrap}`}>
          <div className={styles.bg0}>
            <div className={styles.holder}>
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
          </div>
          <div className={styles.br}></div>
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
            {/* </div> */}
          </div>
          <div className={styles.bg0}>
            <div className={styles.bg0name}>Text-Color</div>
            <div className={styles.bg01}>
              <Colorpicker
                key={"text" + id}
                value={styleMap.color || "black"}
                onChange={(value) => UpdateStyle("color", value)}
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
              />
            </div>
          </div>
          <div className={styles.bg0}>
            <div className={styles.bg0name}>Border-Width</div>
            <div className={styles.sizesiwrap}>
              <TextInput
                value={styleMap.borderWidth as string}
                units={["auto", "1px", "2px", "3px", "4px"]}
                onChange={(value) => UpdateStyle("borderWidth", value)}
              />
            </div>
          </div>
          <div className={styles.bg0}>
            <div className={styles.bg0name}>Border-Color</div>
            <div className={styles.bg01}>
              <Colorpicker
                key={"border" + id}
                value={styleMap.borderColor || "black"}
                onChange={(value) => UpdateStyle("borderColor", value)}
              />
            </div>
          </div>
        </div>
      </Wrap>
      {/* <Wrap title={"Position"}>
                <div className={styles.padwrap}>
                    <Position />
                    {
                        styleMap[id].position !== "static" &&
                        <div className={`${styles.c11} ${styles.padwrap} ${styles.positioninputs}`}>
                            <div className={styles.c110}>
                                <div className={styles.c1101}>Top</div>
                                <div className={styles.c1101}>Left</div>
                            </div>
                            <div className={styles.c110}>
                                <Size_Input extraProp={true} defaultValue={"0px"} property={"top"} data={styleMap[id].top} />
                                <Size_Input extraProp={true} defaultValue={"0px"} property={"left"} data={styleMap[id].left} />
                            </div>
                            <div className={styles.c110}>
                                <div className={styles.c1101}>Bottom</div>
                                <div className={styles.c1101}>Right</div>
                            </div>
                            <div className={styles.c110}>
                                <Size_Input extraProp={true} defaultValue={"0px"} property={"bottom"} data={styleMap[id].bottom} />
                                <Size_Input extraProp={true} defaultValue={"0px"} property={"right"} data={styleMap[id].right} />
                            </div>
                        </div>
                    }
                </div>
            </Wrap> */}
    </>
  );
}
