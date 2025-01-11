import { MdKeyboardArrowDown, MdKeyboardArrowRight } from 'react-icons/md';
import styles from './cssbar.module.css';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateStyleMap } from '../../store/reducers/treeReducer';

export default () => {

    const [block, setBlock] = useState(null);
    const { activeNodeId: id, styleMap } = useSelector(state => state.treeReducer);
    const dispatch = useDispatch();

    return (
        <div className={styles.cssbar}>
            {id && <div className={styles.c1}>
                <Wrap title={"Size"}>
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
                </Wrap>
                <Wrap title={"Display"}>
                    hello world
                </Wrap>
                <Wrap title={"Margin & Padding"}>
                    hello world
                </Wrap>
                <Wrap title={"Colors"}>
                    hello world
                </Wrap>
                <Wrap title={"Position"}>
                    hello world
                </Wrap>
            </div>}
        </div>
    );
}

const Size_Input = ({ data, property, defaultValue }) => {

    const [value, setValue] = useState({ x: "auto" });
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
                <div className={styles.d0}>
                    <div onMouseDown={() => setValue({ y: null, x: "auto" })}>auto</div>
                    <div onMouseDown={() => setValue({ y: null, x: "fit-content" })}>fit-content</div>
                    <div onMouseDown={() => setValue({ y: null, x: "max-content" })}>max-content</div>
                    <div onMouseDown={() => setValue({ y: null, x: "min-content" })}>min-content</div>
                </div>
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