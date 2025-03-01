import { MdKeyboardArrowDown, MdKeyboardArrowRight, MdOutlineEdit, MdOutlineLink } from 'react-icons/md';
import styles from './cssbar.module.css';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateDataMap, updateStyleMap } from '../../store/reducers/treeReducer';
import { IoIosArrowDown, IoMdLink } from 'react-icons/io';
import { FaCss3, FaLink } from 'react-icons/fa';

export default () => {

    const [tab, setTab] = useState(0);
    const id = useSelector(state => state.treeReducer.activeNodeId);
    console.log("cssbar")

    return (
        <div className={styles.cssbarwrapper}>
            <div className={styles.cssbar}>
                <div className={styles.c0}>
                    <div>Paragraph</div>
                    <div
                        style={{ marginLeft: 'auto', }}
                        className={`${tab === 0 ? styles.c0icon : ''}`}
                        onClick={() => setTab(0)}
                        title='css'
                    >
                        <FaCss3 />
                    </div>
                    <div
                        className={`${tab === 1 ? styles.c0icon : ''}`}
                        onClick={() => setTab(1)}
                        title='edit'
                    >
                        <MdOutlineEdit />
                    </div>
                </div>
                <div className={styles.c1}>
                    {
                        id ?
                            tab ?
                                <EditTab /> :
                                <CssTab /> :
                            "Please select an element"
                    }
                </div>
            </div>
        </div>
    );
}

const CssTab = () => {

    const id = useSelector(state => state.treeReducer.activeNodeId);
    const styleMap = useSelector(state => state.treeReducer.styleMap[id]);
    const dispatch = useDispatch();
    console.log("csstab")

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
                        <Size_Input defaultValue={"auto"} property={"width"} data={styleMap.width} />
                        <Size_Input defaultValue={"0px"} property={"minWidth"} data={styleMap.minWidth} />
                        <Size_Input defaultValue={"none"} property={"maxWidth"} data={styleMap.maxWidth} />
                    </div>
                    <div className={styles.c110}>
                        <div className={styles.c1101}>Height</div>
                        <div className={styles.c1101}>Min H</div>
                        <div className={styles.c1101}>Max H</div>
                    </div>
                    <div className={styles.c110}>
                        <Size_Input defaultValue={"auto"} property={"height"} data={styleMap.height} />
                        <Size_Input defaultValue={"0px"} property={"minHeight"} data={styleMap.minHeight} />
                        <Size_Input defaultValue={"none"} property={"maxHeight"} data={styleMap.maxHeight} />
                    </div>
                </div>
            </Wrap>
            <Wrap title={"Display"}>
                <div className={`${styles.dicont} ${styles.padwrap}`}>
                    <div className={`${styles.dic0} ${styles.beffect}`}>
                        <div className={`${styleMap.display === "block" && styles.beffectactivediv}`} onClick={() => dispatch(updateStyleMap({ id, style: { ...styleMap, display: "block" } }))}  >Block</div>
                        <div className={`${styleMap.display === "flex" && styles.beffectactivediv}`} onClick={() => dispatch(updateStyleMap({ id, style: { ...styleMap, display: "flex" } }))} >Flex</div>
                        <div className={`${styleMap.display === "none" && styles.beffectactivediv}`} onClick={() => dispatch(updateStyleMap({ id, style: { ...styleMap, display: "none" } }))} >None</div>
                        <div className={`${styleMap.display === "temp" && styles.beffectactivediv}`} onClick={() => dispatch(updateStyleMap({ id, style: { ...styleMap, display: "block" } }))} >_Temp</div>
                    </div>
                    {
                        styleMap.display === "flex" &&
                        <>
                            <FlexProperties data={{ name: "Direction", prop: "flexDirection", values: ["row", "row-reverse", "column", "column-reverse"] }} />
                            <FlexProperties data={{ name: "Justify", prop: "justifyContent", values: ["flex-start", "flex-end", "center", "space-around", "space-between", "space-evenly"] }} />
                            <FlexProperties data={{ name: "Align", prop: "alignItems", values: ["stretch", "center", "flex-start", "flex-end", "start", "end", "baseline"] }} />
                            <div className={styles.dic2}>
                                <div className={styles.dic20}>
                                    <div style={{ color: 'var(--text_0)' }} className={styles.c1101}>Gap:</div>
                                    <Size_Input defaultValue={"0px"} property={"gap"} data={styleMap.gap} extraOff={true} />
                                </div>
                                <CheckBox name={"Flex-Wrap"} prop={"flexWrap"} values={["wrap", "nowrap"]} />
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

const EditTab = () => {

    const id = useSelector(state => state.treeReducer.activeNodeId);
    const dataMap = useSelector(state => state.treeReducer.dataMap[id])
    const dispatch = useDispatch();
    const [data, setData] = useState({});

    useEffect(() => {
        setData({
            name: dataMap.name,
            content: dataMap.content,
            hyperlink: dataMap.hyperlink,
        });
    }, [dataMap]);

    const handleText = (key, data) => {
        if (dataMap[key] !== data)
            dispatch(updateDataMap({ id, data: { ...dataMap, [key]: data } }))
    }

    return (
        <>
            <Wrap title={"Options"} heading={true}>
            </Wrap>
            <div className={`${styles.e0} ${styles.e0flex}`} style={{ marginTop: '10px' }}>
                <input
                    value={data.name}
                    className={styles.e0i}
                    onBlur={() => handleText("name", data.name)}
                    onChange={e => {
                        setData(f => ({ ...f, name: e.target.value }))
                    }}
                    onKeyUp={e => {
                        if (e.key === "Enter") handleText("name", data.name)
                    }}
                />
            </div>
            {
                ["Paragraph", "Text"].includes(dataMap.type) &&
                <div className={`${styles.e0} ${styles.e0flexcol}`}>
                    <div className={styles.e00}>Content</div>
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
                    />
                </div>
            }
            <div className={`${styles.e0} ${styles.e0flexcol}`}>
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
                />
                <CheckBox1
                    name={"Open in a new tab"}
                    checked={dataMap.newTab}
                    onChange={e => handleText("newTab",e.target.checked)}
                />
            </div>
        </>
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
            Top: styleMap[prefix + "Top"],
            Right: styleMap[prefix + "Right"],
            Bottom: styleMap[prefix + "Bottom"],
            Left: styleMap[prefix + "Left"],
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
            hello
        </div>
    );
}

const CheckBox = ({ name, prop, values }) => {

    const id = useSelector(state => state.treeReducer.activeNodeId);
    const styleMap = useSelector(state => state.treeReducer.styleMap);
    const dispatch = useDispatch();

    return (
        <div className={styles.checkbox} title={name}>
            <input
                type='checkbox'
                checked={styleMap[id][prop] === values[0]}
                onChange={e => {
                    dispatch(updateStyleMap({ id, style: { ...styleMap[id], [prop]: (e.target.checked ? values[0] : values[1]) } }));
                }}
            />
            <div className={styles.checkboxname}>{styleMap[id][prop]}</div>
        </div>
    );
}
const CheckBox1 = ({ name, checked, onChange }) => {
    return (
        <label className={styles.checkbox}>
            <input
                type='checkbox'
                checked={checked}
                onChange={onChange}
            />
            {name}
        </label>
    );
}

const FlexProperties = ({ data }) => {

    const id = useSelector(state => state.treeReducer.activeNodeId);
    const styleMap = useSelector(state => state.treeReducer.styleMap);
    const dispatch = useDispatch();
    const [demoStyle, setDemoStyle] = useState({});

    useEffect(() => {
        setDemoStyle({
            flexDirection: styleMap[id].flexDirection,
            justifyContent: styleMap[id].justifyContent,
            alignItems: styleMap[id].alignItems,
        });
    }, [id, styleMap]);

    return (
        <InputDropDown name={data.name} value={styleMap[id][data.prop]} >
            <div className={styles.dic111}>
                {
                    data.values.map((i, d) => <div onMouseEnter={() => setDemoStyle(prev => ({ ...prev, [data.prop]: i }))} onMouseDown={() => dispatch(updateStyleMap({ id, style: { ...styleMap[id], [data.prop]: i } }))} key={d}>{i}</div>)
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

const Size_Input = ({ data, property, defaultValue, extraOff, extraProp }) => {

    const [value, setValue] = useState({ x: "" });
    const id = useSelector(state => state.treeReducer.activeNodeId);
    const styleMap = useSelector(state => state.treeReducer.styleMap);
    const dispatch = useDispatch();

    useEffect(() => {
        const match = String(data).match(/^(\d+)(\D+)$/);
        if (match) setValue({ x: match[1], y: match[2] });
        else setValue({ x: data });
    }, [data]);


    const handleBlur = () => {
        let newStyle = { ...styleMap[id] };
        if (value.x.length) newStyle[property] = value.x + (value.y || "");
        else newStyle[property] = defaultValue;
        dispatch(updateStyleMap({ id, style: newStyle }))
    }

    return (
        <div className={styles.c1100}>
            <input
                className={styles.in}
                maxLength={4}
                value={value.x}
                onFocus={e => e.target.select()}
                onKeyDown={e => {
                    if (isNaN(e.key) && e.key !== "Backspace") e.preventDefault();
                }}
                onChange={e => setValue(f => ({ x: e.target.value, y: f.y || "px" }))}
                onBlur={handleBlur}
            />
            {value.y !== null && <div>{value.y}</div>}
            <div className={`${styles.dropdown} ${styles.makedrop}`}>
                {!extraOff && <div className={styles.d0}>
                    <div onMouseDown={() => setValue({ y: null, x: "auto" })}>auto</div>
                    {!extraProp && <><div onMouseDown={() => setValue({ y: null, x: "fit-content" })}>fit-content</div>
                        <div onMouseDown={() => setValue({ y: null, x: "max-content" })}>max-content</div>
                        <div onMouseDown={() => setValue({ y: null, x: "min-content" })}>min-content</div></>}
                </div>}
                {
                    value.y &&
                    <div className={styles.d1}>
                        <div onMouseDown={() => setValue(f => ({ ...f, y: "%" }))}>%</div>
                        <div onMouseDown={() => setValue(f => ({ ...f, y: "px" }))}>px</div>
                        <div onMouseDown={() => setValue(f => ({ ...f, y: "em" }))}>em</div>
                        <div onMouseDown={() => setValue(f => ({ ...f, y: "rem" }))}>rem</div>
                        <div onMouseDown={() => setValue(f => ({ ...f, y: "vw" }))}>vw</div>
                        <div onMouseDown={() => setValue(f => ({ ...f, y: "vh" }))}>vh</div>
                    </div>
                }
            </div>
        </div>
    );
}

const Wrap = ({ children, title, heading }) => {

    const [isActive, setIsActive] = useState(true);

    return (
        <div className={styles.c10}>
            <div onClick={() => setIsActive(f => !f)} className={styles.c100}>
                {title}
                {
                    !heading ?
                        isActive ?
                            <MdKeyboardArrowDown className={styles.arrow} /> :
                            <MdKeyboardArrowRight className={styles.arrow} /> : ''
                }
            </div>
            {isActive && children}
        </div>
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