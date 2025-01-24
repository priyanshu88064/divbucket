import { MdKeyboardArrowDown, MdKeyboardArrowRight } from 'react-icons/md';
import styles from './cssbar.module.css';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateStyleMap } from '../../store/reducers/treeReducer';
import { IoIosArrowDown } from 'react-icons/io';

export default () => {

    const { activeNodeId: id, styleMap } = useSelector(state => state.treeReducer);
    const disptach = useDispatch();

    return (
        <div className={styles.cssbar}>
            <div className={styles.c1}>
                {id && <Wrap title={"Size"}>
                    <div className={`${styles.c11} ${styles.padwrap}`}>
                        <div className={styles.c110}>
                            <div className={styles.c1101}>Width</div>
                            <div className={styles.c1101}>Min W</div>
                            <div className={styles.c1101}>Max W</div>
                        </div>
                        <div className={styles.c110}>
                            <Size_Input defaultValue={"auto"} property={"width"} data={styleMap[id].width} />
                            <Size_Input defaultValue={"0px"} property={"minWidth"} data={styleMap[id].minWidth} />
                            <Size_Input defaultValue={"none"} property={"maxWidth"} data={styleMap[id].maxWidth} />
                        </div>
                        <div className={styles.c110}>
                            <div className={styles.c1101}>Height</div>
                            <div className={styles.c1101}>Min H</div>
                            <div className={styles.c1101}>Max H</div>
                        </div>
                        <div className={styles.c110}>
                            <Size_Input defaultValue={"auto"} property={"height"} data={styleMap[id].height} />
                            <Size_Input defaultValue={"0px"} property={"minHeight"} data={styleMap[id].minHeight} />
                            <Size_Input defaultValue={"none"} property={"maxHeight"} data={styleMap[id].maxHeight} />
                        </div>
                    </div>
                </Wrap>}
                {id && <Wrap title={"Display"}>
                    <div className={`${styles.dicont} ${styles.padwrap}`}>
                        <div className={`${styles.dic0} ${styles.beffect}`}>
                            <div className={`${styleMap[id].display === "block" && styles.beffectactivediv}`} onClick={() => disptach(updateStyleMap({ id, style: { ...styleMap[id], display: "block" } }))}  >Block</div>
                            <div className={`${styleMap[id].display === "flex" && styles.beffectactivediv}`} onClick={() => disptach(updateStyleMap({ id, style: { ...styleMap[id], display: "flex" } }))} >Flex</div>
                            <div className={`${styleMap[id].display === "none" && styles.beffectactivediv}`} onClick={() => disptach(updateStyleMap({ id, style: { ...styleMap[id], display: "none" } }))} >None</div>
                            <div className={`${styleMap[id].display === "temp" && styles.beffectactivediv}`} onClick={() => disptach(updateStyleMap({ id, style: { ...styleMap[id], display: "block" } }))} >_Temp</div>
                        </div>
                        {
                            styleMap[id].display === "flex" &&
                            <>
                                <FlexProperties data={{ name: "Direction", prop: "flexDirection", values: ["row", "row-reverse", "column", "column-reverse"] }} />
                                <FlexProperties data={{ name: "Justify", prop: "justifyContent", values: ["flex-start", "flex-end", "center", "space-around", "space-between", "space-evenly"] }} />
                                <FlexProperties data={{ name: "Align", prop: "alignItems", values: ["stretch", "center", "flex-start", "flex-end", "start", "end", "baseline"] }} />
                                <div className={styles.dic2}>
                                    <div className={styles.dic20}>
                                        <div style={{ color: 'var(--text_0)' }} className={styles.c1101}>Gap:</div>
                                        <Size_Input defaultValue={"0px"} property={"gap"} data={styleMap[id].gap} extraOff={true} />
                                    </div>
                                    <CheckBox name={"Flex-Wrap"} prop={"flexWrap"} values={["wrap", "nowrap"]} />
                                </div>
                            </>
                        }
                    </div>
                </Wrap>}
                {id && <Wrap title={"Margin"}>
                    <MPbox prefix={"margin"} />
                </Wrap>}
                {id && <Wrap title={"Padding"}>
                    <MPbox prefix={"padding"} />
                </Wrap>}
                {id && <Wrap title={"Position"}>
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
                </Wrap>}
            </div>
        </div>
    );
}

const Position = ({ }) => {

    const [mouseOn, setMouseOn] = useState("static");
    const { activeNodeId: id, styleMap } = useSelector(state => state.treeReducer);
    const dispatch = useDispatch();

    const block = (e, style,key) => (<div key={key} className={styles.pdefault} style={style}>{e}</div>)
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
                {["2", "3", "4", "5", "6", "7", "8"].map((d,i) => block(d,{},i))}
            </div>
        </>
    );
    const stickyE = (
        <>
            {block("1 : Sticky")}
            <div className={styles.ppscroll}>
                <div className={styles.pscroll}>
                    {["2", "3", "4", "5", "6", "7", "8"].map((d,i) => block(d,{},i))}
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

    const { activeNodeId: id, styleMap } = useSelector(state => state.treeReducer);
    const disptach = useDispatch();
    const [value, setValue] = useState({ Top: "0", Right: "0", Bottom: "0", Left: "0" });

    useEffect(() => {
        setValue({
            Top: styleMap[id][prefix + "Top"],
            Right: styleMap[id][prefix + "Right"],
            Bottom: styleMap[id][prefix + "Bottom"],
            Left: styleMap[id][prefix + "Left"],
        });
    }, [id, styleMap]);

    const onKeyDown = e => {
        if (isNaN(e.key) && e.key !== "Backspace") e.preventDefault();
    }
    const onFocus = e => e.target.select();
    const onBlur = (dir) => {
        let style = { ...styleMap[id] };
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

    const { activeNodeId: id, styleMap } = useSelector(state => state.treeReducer);
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

const FlexProperties = ({ data }) => {

    const { activeNodeId: id, styleMap } = useSelector(state => state.treeReducer);
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
    const { activeNodeId: id, styleMap } = useSelector(state => state.treeReducer);
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

const Wrap = ({ children, title }) => {

    const [isActive, setIsActive] = useState(true);

    return (
        <div className={styles.c10}>
            <div onClick={() => setIsActive(f => !f)} className={styles.c100}>
                {title}
                {
                    isActive ?
                        <MdKeyboardArrowDown className={styles.arrow} /> :
                        <MdKeyboardArrowRight className={styles.arrow} />
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