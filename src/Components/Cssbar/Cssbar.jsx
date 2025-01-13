import { MdKeyboardArrowDown, MdKeyboardArrowRight } from 'react-icons/md';
import styles from './cssbar.module.css';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateStyleMap } from '../../store/reducers/treeReducer';
import { IoIosArrowDown } from 'react-icons/io';

export default () => {

    const { activeNodeId: id, styleMap } = useSelector(state => state.treeReducer);
    const [activeDisplay, setActiveDisplay] = useState("flex");
    const disptach = useDispatch();

    return (
        <div className={styles.cssbar}>
            <div className={styles.c1}>
                {id && <Wrap title={"Size"}>
                    <div className={styles.c11}>
                        <div className={styles.c110}>
                            <div className={styles.c1101}>Width:</div>
                            <div className={styles.c1101}>Min W:</div>
                            <div className={styles.c1101}>Max W:</div>
                        </div>
                        <div className={styles.c110}>
                            <Size_Input defaultValue={"auto"} property={"width"} data={styleMap[id].width} />
                            <Size_Input defaultValue={"0px"} property={"minWidth"} data={styleMap[id].minWidth} />
                            <Size_Input defaultValue={"none"} property={"maxWidth"} data={styleMap[id].maxWidth} />
                        </div>
                        <div className={styles.c110}>
                            <div className={styles.c1101}>Height:</div>
                            <div className={styles.c1101}>Min H:</div>
                            <div className={styles.c1101}>Max H:</div>
                        </div>
                        <div className={styles.c110}>
                            <Size_Input defaultValue={"auto"} property={"height"} data={styleMap[id].height} />
                            <Size_Input defaultValue={"0px"} property={"minHeight"} data={styleMap[id].minHeight} />
                            <Size_Input defaultValue={"none"} property={"maxHeight"} data={styleMap[id].maxHeight} />
                        </div>
                    </div>
                </Wrap>}
                {id && <Wrap title={"Display"}>
                    <div className={styles.dicont}>
                        <div className={styles.dic0}>
                            <div className={`${styleMap[id].display === "block" && styles.activedic0}`} onClick={() => disptach(updateStyleMap({ id, style: { ...styleMap[id], display: "block" } }))}  >Block</div>
                            <div className={`${styleMap[id].display === "flex" && styles.activedic0}`} onClick={() => disptach(updateStyleMap({ id, style: { ...styleMap[id], display: "flex" } }))} >Flex</div>
                            <div className={`${styleMap[id].display === "none" && styles.activedic0}`} onClick={() => disptach(updateStyleMap({ id, style: { ...styleMap[id], display: "none" } }))} >None</div>
                            <div className={`${styleMap[id].display === "temp" && styles.activedic0}`} onClick={() => disptach(updateStyleMap({ id, style: { ...styleMap[id], display: "block" } }))} >_Temp</div>
                        </div>
                        {
                            styleMap[id].display === "flex" &&
                            <>
                                <FlexProperties data={{ name: "Direction", prop: "flexDirection", values: ["row", "row-reverse", "column", "column-reverse"] }} />
                                <FlexProperties data={{ name: "Justify", prop: "justifyContent", values: ["flex-start", "flex-end", "center", "space-around", "space-between", "space-evenly"] }} />
                                <FlexProperties data={{ name: "Align", prop: "alignItems", values: ["stretch", "center", "flex-start", "flex-end", "start", "end", "baseline"] }} />
                                <div className={styles.dic2}>
                                    <div style={{ color: 'var(--text_0)' }} className={styles.c1101}>Gap:</div>
                                    <Size_Input defaultValue={"0px"} property={"gap"} data={styleMap[id].gap} extraOff={true} />
                                </div>
                            </>
                        }
                    </div>
                </Wrap>}
                <Wrap title={"Margin & Padding"}>
                    hello world
                </Wrap>
                <Wrap title={"Colors"}>
                    hello world
                </Wrap>
                <Wrap title={"Position"}>
                    hello world
                </Wrap>
            </div>
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
        <div className={`${styles.dic0} ${styles.dic1}`}>
            <div>{data.name}</div>
            <div className={styles.dic10}>
                {styleMap[id][data.prop]}
                <IoIosArrowDown />
                <input className={styles.iforhover} readOnly />
            </div>
            <div className={styles.dic11}>
                <div className={styles.dic110}>
                    <div style={demoStyle} className={styles.dicdemoflex}>
                        <div>1</div>
                        <div>2</div>
                        <div>3</div>
                    </div>
                </div>
                <div className={styles.dic111}>
                    {
                        data.values.map((i, d) => <div onMouseEnter={() => setDemoStyle(prev => ({ ...prev, [data.prop]: i }))} onMouseDown={() => dispatch(updateStyleMap({ id, style: { ...styleMap[id], [data.prop]: i } }))} key={d}>{i}</div>)
                    }
                </div>
            </div>
        </div>
    );
}

const Size_Input = ({ data, property, defaultValue, extraOff }) => {

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
            {value.y !== null && <div className={styles.unit}>{value.y}</div>}
            <div className={styles.dropdown}>
                {!extraOff && <div className={styles.d0}>
                    <div onMouseDown={() => setValue({ y: null, x: "auto" })}>auto</div>
                    <div onMouseDown={() => setValue({ y: null, x: "fit-content" })}>fit-content</div>
                    <div onMouseDown={() => setValue({ y: null, x: "max-content" })}>max-content</div>
                    <div onMouseDown={() => setValue({ y: null, x: "min-content" })}>min-content</div>
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