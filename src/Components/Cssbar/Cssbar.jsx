import { MdKeyboardArrowDown, MdKeyboardArrowRight, MdOutlineEdit } from 'react-icons/md';
import styles from './cssbar.module.css';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateDataMap, updateStyleMap } from '../../store/reducers/treeReducer';
import { IoIosArrowDown } from 'react-icons/io';
import { FaBold, FaCat, FaCss3, FaHome, FaImage, FaItalic, FaLink, FaRegSquare, FaStrikethrough, FaUnderline, FaVideo } from 'react-icons/fa';
import { changeTab } from '../../store/reducers/focusReducer';
import { FaParagraph } from 'react-icons/fa6';
import TextInput from '../../utils/inputs/TextInput/TextInput';
import CheckBox from '../../utils/inputs/CheckBox/CheckBox';
import Colorpicker from '../../utils/inputs/Colorpicker/Colorpicker';
import Select from '../../utils/inputs/Select/Select';
import { LuHeading1 } from 'react-icons/lu';
import { AiOutlineFontSize } from 'react-icons/ai';
import { IoText } from 'react-icons/io5';
import { BsTextParagraph } from 'react-icons/bs';

export const GetIconOfType = (type, size) => {
    return (
        type === "root" ?
            <FaHome size={size || 12} /> :
            type === "Block" ?
                <FaRegSquare size={size || 12} /> :
                type === "Row" ?
                    <FaRegSquare size={size || 12} /> :
                    type === "Heading" ?
                        <LuHeading1 size={size || 12} /> :
                        type === "Text" ?
                            <IoText size={size || 12} /> :
                            type === "Paragraph" ?
                                <BsTextParagraph size={size || 12} /> :
                                type === "Image" ?
                                    <FaImage size={size || 12} /> :
                                    type === "Video" && <FaVideo size={size || 12} />
    )

}

export default () => {

    const tab = useSelector(state => state.focusReducer.tab);
    const id = useSelector(state => state.treeReducer.activeNodeId);
    const name = useSelector(state => state.treeReducer.dataMap[id]?.name);
    const type = useSelector(state => state.treeReducer.dataMap[id]?.type);
    const dispatch = useDispatch();

    return (
        <div
            className={styles.cssbar}
        >
            {
                id ?
                    <>
                        <div className={styles.c0}>
                            <div className={styles.c00}>
                                {GetIconOfType(type)}
                                {name}
                            </div>
                            <div
                                style={{ marginLeft: 'auto' }}
                                className={`${styles.c01} ${tab[0] === "0" ? styles.c0icon : ''}`}
                                onClick={() => dispatch(changeTab({ tab: "00" }))}
                                title='css'
                            >
                                <FaCss3 />
                                Styles
                            </div>
                            <div
                                className={`${styles.c01} ${tab[0] === "1" ? styles.c0icon : ''}`}
                                onClick={() => dispatch(changeTab({ tab: "10" }))}
                                title='edit'
                            >
                                <MdOutlineEdit />
                                EDIT
                            </div>
                        </div>
                        <div className={styles.c1}>
                            {
                                tab[0] === "0" ?
                                    <CssTab /> :
                                    <EditTab focus={tab[1]} />
                            }
                        </div>
                    </> :
                    <Empty />
            }
        </div>
    );
}

const Empty = () => {
    return (
        <div className={styles.empty}>
            <FaCat size={50} />
            <div>Feeling empty</div>
        </div>
    );
}

const CssTab = () => {

    const id = useSelector(state => state.treeReducer.activeNodeId);
    const styleMap = useSelector(state => state.treeReducer.styleMap[id]);
    const dispatch = useDispatch();

    const UpdateStyle = (prop, value) => {
        let style = { ...styleMap, [prop]: value };
        if (value === 'auto')
            delete style[prop];
        dispatch(updateStyleMap({ id, style }));
    }

    return (
        <>
            <Wrap title={"Styles"} heading={true}></Wrap>
            <Wrap title={"Size"}>
                <div className={`${styles.c11} ${styles.padwrap}`}>
                    <div className={styles.c110}>
                        <div className={styles.c1101}>Width</div>
                        <div className={styles.c1101}>Min W</div>
                        <div className={styles.c1101}>Max W</div>
                    </div>
                    <div className={styles.c110}>
                        <TextInput
                            value={styleMap.width}
                            units={["auto", "50px", "100px", "200px", "400px", "800px"]}
                            onChange={value => UpdateStyle('width', value)}
                        />
                        <TextInput
                            value={styleMap.minWidth}
                            units={["auto", "50px", "100px", "200px", "400px", "800px"]}
                            onChange={value => UpdateStyle('minWidth', value)}
                        />
                        <TextInput
                            value={styleMap.maxWidth}
                            units={["auto", "50px", "100px", "200px", "400px", "800px"]}
                            onChange={value => UpdateStyle('maxWidth', value)}
                        />
                    </div>
                    <div className={styles.c110} style={{ marginLeft: '10px' }}>
                        <div className={styles.c1101}>Height</div>
                        <div className={styles.c1101}>Min H</div>
                        <div className={styles.c1101}>Max H</div>
                    </div>
                    <div className={styles.c110}>
                        <TextInput
                            value={styleMap.height}
                            units={["auto", "20px", "40px", "80px", "100px", "200px"]}
                            onChange={value => UpdateStyle('height', value)}
                        />
                        <TextInput
                            value={styleMap.minHeight}
                            units={["auto", "20px", "40px", "80px", "100px", "200px"]}
                            onChange={value => UpdateStyle('minHeight', value)}
                        />
                        <TextInput
                            value={styleMap.maxHeight}
                            units={["auto", "20px", "40px", "80px", "100px", "200px"]}
                            onChange={value => UpdateStyle('maxHeight', value)}
                        />
                    </div>
                </div>
            </Wrap>
            <Wrap title={"Display"}>
                <div className={`${styles.dicont} ${styles.padwrap}`}>
                    <div className={`${styles.dic0} ${styles.beffect}`}>
                        <div className={`${styleMap.display !== "flex" && styles.beffectactivediv}`} onClick={() => UpdateStyle('display', 'auto')}  >Block</div>
                        <div className={`${styleMap.display === "flex" && styles.beffectactivediv}`} onClick={() => UpdateStyle('display', 'flex')} >Flex</div>
                    </div>
                    {
                        styleMap.display === "flex" &&
                        <>
                            <FlexProperties
                                id={id}
                                data={{ name: "Direction", prop: "flexDirection", values: ["auto", "row", "row-reverse", "column", "column-reverse"] }}
                                onChange={value => UpdateStyle('flexDirection', value)}
                            />
                            <FlexProperties
                                id={id}
                                data={{ name: "Justify", prop: "justifyContent", values: ["auto", "flex-start", "flex-end", "center", "space-around", "space-between", "space-evenly"] }}
                                onChange={value => UpdateStyle('justifyContent', value)}
                            />
                            <FlexProperties
                                id={id}
                                data={{ name: "Align", prop: "alignItems", values: ["auto", "stretch", "center", "flex-start", "flex-end", "start", "end", "baseline"] }}
                                onChange={value => UpdateStyle('alignItems', value)}
                            />
                            <div className={styles.dic2}>
                                <div className={styles.dic20}>
                                    <div style={{ color: 'var(--text_0)' }} className={styles.c1101}>Gap:</div>
                                    <TextInput
                                        value={styleMap.gap}
                                        onChange={value => UpdateStyle('gap', value)}
                                    />
                                </div>
                                <CheckBox
                                    name={"flexwrap"}
                                    checked={styleMap.flexWrap === "wrap"}
                                    onChange={e => dispatch(updateStyleMap({ id, style: { ...styleMap, flexWrap: e.target.checked ? "wrap" : "nowrap" } }))}
                                />
                            </div>
                        </>
                    }
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
                                onChange={value => UpdateStyle('background', value)}
                                value={styleMap.background ? "Solid" : "Auto"}
                            />
                            {
                                styleMap.background &&
                                <Colorpicker
                                    key={"background" + id}
                                    value={styleMap.background}
                                    onChange={value => UpdateStyle('background', value)}
                                />
                            }
                        </div>
                    </div>
                </div>
            </Wrap>
            <Wrap title={"Typography"}>
                <div className={`${styles.padwrap} ${styles.bgwrap}`}>
                    <div className={styles.bg0}>
                        <div className={styles.holder}>
                            <div
                                title='bold'
                                className={`${styles.holder0} ${styleMap.fontWeight === "bold" ? styles.holderactive : ''}`}
                                onClick={() => {
                                    if (styleMap.fontWeight === "bold") UpdateStyle("fontWeight", "auto");
                                    else UpdateStyle("fontWeight", "bold");
                                }}
                            >
                                <FaBold />
                            </div>
                            <div
                                title='italic'
                                className={`${styles.holder0} ${styleMap.fontStyle === "italic" ? styles.holderactive : ''}`}
                                onClick={() => {
                                    if (styleMap.fontStyle === "italic") UpdateStyle("fontStyle", "auto");
                                    else UpdateStyle("fontStyle", "italic")
                                }}
                            >
                                <FaItalic />
                            </div>
                            <div
                                title='underline'
                                className={`${styles.holder0} ${styleMap.textDecoration === "underline" ? styles.holderactive : ''}`}
                                onClick={() => {
                                    if (styleMap.textDecoration === "underline") UpdateStyle("textDecoration", "auto");
                                    else UpdateStyle("textDecoration", "underline");
                                }}
                            >
                                <FaUnderline />
                            </div>
                            <div
                                title='strikethrough'
                                className={`${styles.holder0} ${styleMap.textDecoration === "line-through" ? styles.holderactive : ''}`}
                                onClick={() => {
                                    if (styleMap.textDecoration === "line-through") UpdateStyle("textDecoration", "auto");
                                    else UpdateStyle("textDecoration", "line-through");
                                }}
                            >
                                <FaStrikethrough />
                            </div>
                            <div
                                title='small-caps'
                                className={`${styles.holder0} ${styleMap.fontVariant === "small-caps" ? styles.holderactive : ''}`}
                                onClick={() => {
                                    if (styleMap.fontVariant === "small-caps") UpdateStyle("fontVariant", "auto");
                                    else UpdateStyle("fontVariant", "small-caps");
                                }}
                            >
                                <AiOutlineFontSize size={15} color='var(--text_0)' />
                            </div>
                        </div>
                    </div>
                    <div className={styles.br}></div>
                    <div className={styles.bg0}>
                        <div className={styles.bg0name}>Family</div>
                        <div className={styles.fontselect}>
                            <input
                                type='text'
                                className={`${styles.fontsi} ${!styleMap.fontFamily ? styles.fontdefault : ''}`}
                                value={styleMap.fontFamily || 'auto'}
                                readOnly
                            />
                            <div className={styles.fontdrop}>
                                {
                                    [
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
                                        "fangsong"
                                    ].map(font => (
                                        <div
                                            key={font}
                                            style={{ fontFamily: font !=='auto' && font }}
                                            onMouseDown={() => UpdateStyle("fontFamily", font)}
                                        >
                                            {font}
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                    <div className={styles.bg0}>
                        <div className={styles.bg0name}>Font-Size</div>
                        <div className={styles.sizesiwrap}>
                            <TextInput
                                value={styleMap.fontSize}
                                units={["auto", "8px", "10px", "12px", "14px", "16px", "20px", "24px"]}
                                onChange={value => UpdateStyle("fontSize", value)}
                            />
                        </div>
                    </div>
                    <div className={styles.bg0}>
                        <div className={styles.bg0name}>Font-Weight</div>
                        <div className={styles.sizesiwrap}>
                            <TextInput
                                value={styleMap.fontWeight}
                                units={["auto", "bold", "bolder", "lighter", "100", "200", "300", "400", "500", "600"]}
                                onChange={value => UpdateStyle("fontWeight", value)}
                            />
                        </div>
                        {/* </div> */}
                    </div>
                    <div className={styles.bg0}>
                        <div className={styles.bg0name}>Text-Color</div>
                        <div className={styles.bg01}>
                            <Colorpicker
                                key={"text" + id}
                                value={styleMap.color || 'black'}
                                onChange={value => UpdateStyle("color", value)}
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
                                value={styleMap.borderStyle}
                                units={["auto", "solid", "dotted", "dashed", "double", "groove", "hidden"]}
                                onChange={value => UpdateStyle("borderStyle", value)}
                            />
                        </div>
                    </div>
                    <div className={styles.bg0}>
                        <div className={styles.bg0name}>Border-Width</div>
                        <div className={styles.sizesiwrap}>
                            <TextInput
                                value={styleMap.borderWidth}
                                units={["auto", "1px", "2px", "3px", "4px"]}
                                onChange={value => UpdateStyle("borderWidth", value)}
                            />
                        </div>
                    </div>
                    <div className={styles.bg0}>
                        <div className={styles.bg0name}>Border-Color</div>
                        <div className={styles.bg01}>
                            <Colorpicker
                                key={"border" + id}
                                value={styleMap.borderColor || 'black'}
                                onChange={value => UpdateStyle("borderColor", value)}
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

const EditTab = ({ focus }) => {

    const id = useSelector(state => state.treeReducer.activeNodeId);
    const dataMap = useSelector(state => state.treeReducer.dataMap[id])
    const dispatch = useDispatch();
    const [data, setData] = useState({
        name: "",
        content: "",
        hyperlink: "",
        src: "",
        alt: ""
    });

    useEffect(() => {
        setData({
            name: dataMap.name,
            content: dataMap.content,
            hyperlink: dataMap.hyperlink,
            src: dataMap.src,
            alt: dataMap.alt,
        });
    }, [dataMap]);

    const handleText = (key, data) => {
        if (dataMap[key] !== data)
            dispatch(updateDataMap({ id, data: { ...dataMap, [key]: data } }))
    }

    return (
        <div className={`${focus === "1" ? styles.edittab : ''}`}>
            <Wrap title={"Options"} heading={true}>
            </Wrap>
            <div
                className={`${styles.e0} ${styles.e0flex} ${focus === "2" ? styles.edittab : ''}`}
                style={{ marginTop: '10px' }}
            >
                <input
                    autoFocus={focus === "2"}
                    value={data.name}
                    className={styles.e0i}
                    onBlur={() => handleText("name", data.name)}
                    onChange={e => {
                        setData(f => ({ ...f, name: e.target.value }))
                    }}
                    onKeyUp={e => {
                        if (e.key === "Enter") handleText("name", data.name)
                    }}
                    onFocus={e => e.target.select()}
                />
            </div>
            {
                dataMap.content &&
                <div className={`${styles.e0} ${styles.e0flexcol}`}>
                    <div className={styles.e00}>Content <FaParagraph /></div>
                    <textarea
                        value={data.content}
                        className={`${styles.e0i} ${styles.e0tarea}`}
                        onBlur={() => handleText("content", data.content)}
                        onKeyUp={e => {
                            if (e.key === "Enter") handleText("content", e.target.value)
                        }}
                        onKeyDown={e => {
                            if (e.key === "Enter") e.preventDefault();
                        }}
                        onChange={e => {
                            setData(f => ({ ...f, content: e.target.value }))
                        }}
                        onFocus={e => e.target.select()}
                    />
                </div>
            }
            {/* <div className={`${styles.e0} ${styles.e0flexcol}`}>
                <div className={styles.e00}>
                    Hyperlink
                    <FaLink size={10} />
                </div>
                <input
                    placeholder='www.google.com'
                    className={styles.e0i}
                    value={data.hyperlink}
                    onBlur={() => handleText("hyperlink", data.hyperlink)}
                    onKeyUp={e => {
                        if (e.key === "Enter") handleText("hyperlink", data.hyperlink);
                    }}
                    onChange={e => setData(f => ({ ...f, hyperlink: e.target.value }))}
                    onFocus={e => e.target.select()}
                />
                <CheckBox
                    name={"Open in a new tab"}
                    checked={dataMap.newTab}
                    onChange={e => handleText("newTab", e.target.checked)}
                />
            </div> */}
            {dataMap.type === "Image" && <><div className={`${styles.e0} ${styles.e0flexcol}`}>
                <div className={styles.e00}>
                    Image URL
                    <FaLink size={10} />
                </div>
                <input
                    value={data.src}
                    className={styles.e0i}
                    placeholder='https://picsum.photos/200'
                    onBlur={() => handleText("src", data.src)}
                    onKeyUp={e => {
                        if (e.key === "Enter") handleText("src", data.src);
                    }}
                    onChange={e => setData(f => ({ ...f, src: e.target.value }))}
                    onFocus={e => e.target.select()}
                />
            </div>
                <div className={`${styles.e0} ${styles.e0flexcol}`}>
                    <div className={styles.e00}>
                        Image Alt
                        <FaLink size={10} />
                    </div>
                    <input
                        className={styles.e0i}
                        value={data.alt}
                        onBlur={() => handleText("alt", data.alt)}
                        onKeyUp={e => {
                            if (e.key === "Enter") handleText("alt", data.alt);
                        }}
                        onChange={e => setData(f => ({ ...f, alt: e.target.value }))}
                        onFocus={e => e.target.select()}
                    />
                </div></>}
        </div>
    );
}

const Position = ({ }) => {

    const [mouseOn, setMouseOn] = useState("static");
    const id = useSelector(state => state.treeReducer.activeNodeId);
    const styleMap = useSelector(state => state.treeReducer.styleMap);
    const dispatch = useDispatch();

    const block = (e, style, key) => (<div key={key} className={styles.pdefault} style={style}>{e}</div>)
    const defaultE = block("Default");
    const relativeE = (
        <>
            {block("1")}
            {block("2 : Relative", { transform: 'translateX(50px)' })}
            {block("3")}
        </>
    );
    const absoluteE = (
        <>
            {block("1")}
            {block("2 : Absolute", { position: 'absolute', top: '5px', left: '80px' })}
            {block("3")}
        </>
    );
    const fixedE = (
        <>
            {block("1 : Fixed", { position: 'absolute', top: '5px', left: '80px' })}
            <div className={styles.pscroll}>
                {["2", "3", "4", "5", "6", "7", "8"].map((d, i) => block(d, {}, i))}
            </div>
        </>
    );
    const stickyE = (
        <>
            {block("1 : Sticky")}
            <div className={styles.ppscroll}>
                <div className={styles.pscroll}>
                    {["2", "3", "4", "5", "6", "7", "8"].map((d, i) => block(d, {}, i))}
                </div>
            </div>
        </>
    );

    const handleMouseDown = () => {
        dispatch(updateStyleMap({ id, style: { ...styleMap[id], position: mouseOn } }));
    }

    return (
        <InputDropDown name={"Position"} value={styleMap[id].position === "static" ? "Default" : styleMap[id].position}>
            <div className={styles.dic111}>
                <div onMouseDown={handleMouseDown} onMouseEnter={() => setMouseOn("static")}>Default</div>
                <div onMouseDown={handleMouseDown} onMouseEnter={() => setMouseOn("relative")}>Relative</div>
                <div onMouseDown={handleMouseDown} onMouseEnter={() => setMouseOn("absolute")}>Absolute</div>
                <div onMouseDown={handleMouseDown} onMouseEnter={() => setMouseOn("fixed")}>Fixed</div>
                <div onMouseDown={handleMouseDown} onMouseEnter={() => setMouseOn("sticky")}>Sticky</div>
            </div>
            <div className={styles.p0}>
                <div className={styles.p00}>
                    {
                        mouseOn === "static" ? defaultE :
                            mouseOn === "relative" ? relativeE :
                                mouseOn === "absolute" ? absoluteE :
                                    mouseOn === "fixed" ? fixedE : stickyE
                    }
                </div>
                <div className={styles.p01}>
                    {
                        mouseOn === "static" ? "Default value. Top, Bottom, Right, Left properties will NOT work." :
                            mouseOn === "relative" ? "Element can move Top, Bottom, Right, Left but physically it will be in the document flow." :
                                mouseOn === "absolute" ? "Element will be out of document flow and move relative to its first positioned (non default) ancestor element." :
                                    mouseOn === "fixed" ? "Fixates an element within it's scrolling container or viewport." :
                                        "A sticky element toggles between relative and fixed, depending on the scroll position. It is positioned relative until a given offset position is met in the viewport - then it `sticks` in place (like position:fixed)."
                    }
                </div>
            </div>
        </InputDropDown>
    );

}

const MPbox = ({ prefix }) => {

    const id = useSelector(state => state.treeReducer.activeNodeId);
    const styleMap = useSelector(state => state.treeReducer.styleMap[id]);
    const disptach = useDispatch();
    const [value, setValue] = useState({ Top: "0", Right: "0", Bottom: "0", Left: "0" });

    useEffect(() => {
        setValue({
            Top: styleMap[prefix + "Top"] || "0",
            Right: styleMap[prefix + "Right"] || "0",
            Bottom: styleMap[prefix + "Bottom"] || "0",
            Left: styleMap[prefix + "Left"] || "0",
        });
    }, [id, styleMap]);

    const onKeyDown = e => {
        if (isNaN(e.key) && e.key !== "Backspace") e.preventDefault();
    }
    const onFocus = e => e.target.select();
    const onBlur = (dir) => {
        let style = { ...styleMap };
        if (value[dir] === "" || value[dir] === "0") style[prefix + dir] = "0";
        else style[prefix + dir] = value[dir] + (isNaN(value[dir]) ? "" : "px");
        disptach(updateStyleMap({ id, style }));
    }

    return (
        <div className={styles.padwrap}>
            <div className={styles.mpout} style={{ boxShadow: prefix === "padding" && "2px 2px 5px #00000070", background: prefix === "padding" && 'var(--bg_gray0)' }}>
                <div title="top" className={`${styles.mpcut} ${styles.top}`}>
                    <input onChange={e => setValue(f => ({ ...f, Top: e.target.value }))} onBlur={e => onBlur("Top")} onFocus={onFocus} onKeyDown={onKeyDown} className={styles.mpcut0} maxLength={4} placeholder='0' value={value.Top} />
                </div>
                <div title="right" className={`${styles.mpcut} ${styles.right}`}>
                    <input onChange={e => setValue(f => ({ ...f, Right: e.target.value }))} onBlur={e => onBlur("Right")} onFocus={onFocus} onKeyDown={onKeyDown} className={styles.mpcut0} maxLength={4} placeholder='0' value={value.Right} />
                </div>
                <div title="bottom" className={`${styles.mpcut} ${styles.bottom}`}>
                    <input onChange={e => setValue(f => ({ ...f, Bottom: e.target.value }))} onBlur={e => onBlur("Bottom")} onFocus={onFocus} onKeyDown={onKeyDown} className={styles.mpcut0} maxLength={4} placeholder='0' value={value.Bottom} />
                </div>
                <div title="left" className={`${styles.mpcut} ${styles.left}`}>
                    <input onChange={e => setValue(f => ({ ...f, Left: e.target.value }))} onBlur={e => onBlur("Left")} onFocus={onFocus} onKeyDown={onKeyDown} className={styles.mpcut0} maxLength={4} placeholder='0' value={value.Left} />
                </div>
                <div className={styles.mpin} style={{ boxShadow: prefix === "margin" ? "2px 2px 5px #00000070" : "inset 2px 2px 5px #00000070", background: prefix === "margin" ? 'var(--bg_gray0)' : 'var(--bg_gray)' }}>
                </div>
            </div>
        </div>
    );
}

const FlexProperties = ({ id, data, onChange }) => {

    const styleMap = useSelector(state => state.treeReducer.styleMap[id]);
    const [demoStyle, setDemoStyle] = useState({});

    useEffect(() => {
        setDemoStyle({
            flexDirection: styleMap.flexDirection,
            justifyContent: styleMap.justifyContent,
            alignItems: styleMap.alignItems,
        });
    }, [id, styleMap]);

    return (
        <InputDropDown name={data.name} value={styleMap[data.prop] || 'auto'} >
            <div className={styles.dic111}>
                {
                    data.values.map((i, d) => <div onMouseEnter={() => setDemoStyle(prev => ({ ...prev, [data.prop]: i }))} onMouseDown={() => onChange(i)} key={d}>{i}</div>)
                }
            </div>
            <div className={styles.dic110}>
                <div style={demoStyle} className={styles.dicdemoflex}>
                    <div>1</div>
                    <div>2</div>
                    <div>3</div>
                </div>
            </div>
        </InputDropDown>
    );
}

const Wrap = ({ children, title, heading }) => {

    const [isActive, setIsActive] = useState(true);
    const id = useSelector(state => state.treeReducer.activeNodeId);
    const type = useSelector(state => state.treeReducer.dataMap[id].type);

    return (
        <>
            {
                isPropAllowed(type, title) &&
                <div className={styles.c10}>
                    <div className={styles.c100} onDoubleClick={() => setIsActive(f => !f)}>
                        <div className={styles.c1000}>{title}</div>
                        <div className={styles.c1000} onClick={() => setIsActive(f => !f)}>
                            {
                                !heading ?
                                    isActive ?
                                        <MdKeyboardArrowDown className={styles.arrow} /> :
                                        <MdKeyboardArrowRight className={styles.arrow} /> : ''
                            }
                        </div>
                    </div>
                    {isActive && children}
                </div>
            }
        </>
    );

}

const InputDropDown = ({ children, name, value }) => {
    return (
        <div className={`${styles.dic1} ${styles.beffect}`}>
            <div>{name}</div>
            <div className={`${styles.dic10} ${styles.beffectactivediv}`}>
                {value}
                <IoIosArrowDown />
                <input className={styles.iforhover} readOnly />
            </div>
            <div className={`${styles.dic11} ${styles.makedrop}`}>
                {children}
            </div>
        </div>
    );
}

const isPropAllowed = (type, prop) => {
    if (type === "root") {
        if (["Display", "Padding", "Background", "Styles", "Options"].includes(prop)) return true;
        return false;
    }
    else if (type === "Image") {
        if (["Padding", "Background", "Styles", "Options", "Size", "Margin", "Border"].includes(prop)) return true;
        return false;
    }
    return true;
}