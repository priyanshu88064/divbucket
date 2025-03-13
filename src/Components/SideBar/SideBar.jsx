import { CiSearch } from 'react-icons/ci';
import styles from './sidebar.module.css';
import { IoAddOutline, IoLayers, IoText } from 'react-icons/io5';
import { useEffect, useRef, useState } from 'react';
import { GiSquare } from 'react-icons/gi';
import { LuHeading1, LuLetterText, LuSquareArrowRight } from 'react-icons/lu';
import { PiImageLight, PiVideoLight } from 'react-icons/pi';
import { RiText } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
import { MdKeyboardArrowDown, MdKeyboardArrowRight } from 'react-icons/md';
import { addNode, deleteFromParent, splice, updateActiveNode, updateMaxRootWidth } from '../../store/reducers/treeReducer';
import { useContextMenu } from '../../utils/hooks/useContextMenu';
import ContextMenu from '../ContextMenu/ContextMenu';
import { GetIconOfType } from '../Cssbar/Cssbar';
import { GrDrag } from 'react-icons/gr';

export default () => {

    const [tab, setTab] = useState(1);
    const leftOffset = useSelector(state => state.treeReducer.maxRootWidth.left);
    const dispatch = useDispatch();

    const handleDragStart = (e, type) => {
        e.dataTransfer.setData("id", Date.now());
        e.dataTransfer.setData("type", type);
    }
    const handleTabClick = (ind) => {
        if (tab === ind) setTab(null);
        else setTab(ind);
    }

    return (
        <div
            className={styles.sidebar}
            ref={e => {
                const newLeftOffset = e?.getBoundingClientRect()?.right;
                if (newLeftOffset && newLeftOffset !== leftOffset)
                    dispatch(updateMaxRootWidth({ key: "left", value: newLeftOffset }))
            }}
        >
            <div className={styles.cont}>
                <div onClick={() => handleTabClick(0)} className={`${tab === 0 && styles.activetab} ${styles.it}`}><IoAddOutline className={styles.it0} size={23} /></div>
                <div onClick={() => handleTabClick(1)} className={`${tab === 1 && styles.activetab} ${styles.it}`}><IoLayers className={styles.it0} size={23} /></div>
                <div onClick={() => handleTabClick(2)} className={`${tab === 2 && styles.activetab} ${styles.it}`}><CiSearch className={styles.it0} strokeWidth={'1'} size={23} /></div>
            </div>
            {
                tab !== null &&
                <div className={styles.a}>
                    {
                        tab === 0 ?
                            <>
                                <div className={styles.head}>Nodes</div>
                                <div className={styles.a1}>
                                    <div className={styles.a10} draggable onDragStart={(e) => handleDragStart(e, "Block")}>
                                        <div><GiSquare size={40} /></div>
                                        <div>Div</div>
                                    </div>
                                    <div className={styles.a10} draggable onDragStart={(e) => handleDragStart(e, "Row")} title='horizontal flex box'>
                                        <div><LuSquareArrowRight size={40} /></div>
                                        <div>H-Flex</div>
                                    </div>
                                    <div className={styles.a10} draggable onDragStart={(e) => handleDragStart(e, "Heading")}>
                                        <div><LuHeading1 size={40} /></div>
                                        <div>Heading</div>
                                    </div>
                                    <div className={styles.a10} draggable onDragStart={(e) => handleDragStart(e, "Text")}>
                                        <div><RiText size={30} style={{ margin: '7px 0' }} /></div>
                                        <div>Text</div>
                                    </div>
                                    <div className={styles.a10} draggable onDragStart={(e) => handleDragStart(e, "Paragraph")}>
                                        <div><LuLetterText size={40} /></div>
                                        <div>Paragraph</div>
                                    </div>
                                    <div className={styles.a10} draggable onDragStart={(e) => handleDragStart(e, "Image")}>
                                        <div><PiImageLight size={40} /></div>
                                        <div>Image</div>
                                    </div>
                                    <div className={styles.a10} draggable onDragStart={(e) => handleDragStart(e, "Video")}>
                                        <div><PiVideoLight size={40} /></div>
                                        <div>Video</div>
                                    </div>
                                </div>
                            </> :
                            tab == 1 ?
                                <Explorer /> :
                                <>
                                    <div className={styles.head}>Search</div>
                                    <div></div>
                                </>
                    }
                </div>
            }
        </div>
    );
}

const Explorer = () => {

    const draggedNode = useRef(null);
    const dispatch = useDispatch();

    const handleDragStart = (e) => {
        e.target.classList.add(styles.removingitem);
        draggedNode.current = e.target;
        var img = document.createElement("img");
        img.src = "";
        e.dataTransfer.setDragImage(img, 0, 0);
    }
    const handleDragEnd = (e) => {
        e.target.classList.remove(styles.removingitem);
    }
    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const targetNode = e.target.getAttribute('data-id');
        if (!targetNode || targetNode === draggedNode.current.getAttribute('data-id')) return;
        const rect = e.target.getBoundingClientRect();
        const diff = e.clientY - rect.top;
        if (targetNode !== "root" && diff <= rect.height / 3) {
            e.target.classList.remove(styles.dragbottom, styles.dragmiddle);
            e.target.classList.add(styles.dragtop);
        } else if (diff <= (rect.height * 2) / 3) {
            e.target.classList.remove(styles.dragbottom, styles.dragtop);
            e.target.classList.add(styles.dragmiddle);
        } else {
            e.target.classList.remove(styles.dragtop, styles.dragmiddle);
            e.target.classList.add(styles.dragbottom);
        }
    }
    const handleDrop = (e) => {
        const targetNode = e.target.getAttribute('data-id');
        const _draggedNode = draggedNode.current.getAttribute('data-id');
        if (!targetNode || targetNode === _draggedNode) return;
        const rect = e.target.getBoundingClientRect();
        const diff = e.clientY - rect.top;
        if (targetNode !== "root" && diff <= rect.height / 3) {
            dispatch(deleteFromParent({ id: _draggedNode }));
            dispatch(splice({ node: _draggedNode, referenceNode: targetNode, pos: 0 }))
        } else if (diff <= (rect.height * 2) / 3) {
            dispatch(deleteFromParent({ id: _draggedNode }));
            dispatch(addNode({parent:targetNode,child:Number(_draggedNode)}))
        } else {
            dispatch(deleteFromParent({ id: _draggedNode }));
            dispatch(splice({ node: _draggedNode, referenceNode: targetNode, pos: 1 }))
        }
        e.target.classList.remove(styles.dragtop, styles.dragmiddle, styles.dragbottom);
    }
    const handleDragLeave = (e) => {
        e.target.classList.remove(styles.dragtop, styles.dragmiddle, styles.dragbottom);
    }

    return (
        <>
            <div className={`${styles.head} ${styles.exp}`}>EXPLORER</div>
            <div
                className={styles.rlist}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <RLItem
                    key={"root"}
                    node={"root"}
                    pleft={5}
                />
            </div>
        </>
    );
}

const RecursiveList = ({ start, pleft }) => {

    const tree = useSelector(state => state.treeReducer.tree);

    return (
        <>
            {
                tree[start].map(node => (
                    <RLItem
                        key={node}
                        node={node}
                        pleft={pleft}
                    />
                ))
            }
        </>
    );
}

const RLItem = ({ node, pleft }) => {

    const type = useSelector(state => state.treeReducer.dataMap[node].type);
    const [active, setActive] = useState(true);
    const activeNodeId = useSelector(state => state.treeReducer.activeNodeId);
    const name = useSelector(state => state.treeReducer.dataMap[node].name);
    const { clicked, setClicked, points, setPoints } = useContextMenu();
    const dispatch = useDispatch();

    return (
        <div className={styles.rlistitem} >
            <div
                draggable={node !== "root"}
                data-id={node}
                style={{ paddingLeft: pleft + "px" }}
                className={`${styles.rliwrap} ${activeNodeId === node ? styles.activeItemClass : ''}`}
                onClick={() => {
                    if (activeNodeId !== node)
                        dispatch(updateActiveNode({ id: node }))
                }}
                onDoubleClick={() => setActive(f => !f)}
                onContextMenu={e => {
                    e.preventDefault();
                    setClicked(true);
                    setPoints({ x: e.pageX, y: e.pageY });
                    dispatch(updateActiveNode({ id: node }))
                }}

            >
                <div
                    className={styles.rli0}
                    onClick={e => { setActive(f => !f) }}
                >
                    {
                        ["root", "Row", "Block"].includes(type) ?
                            active ?
                                <MdKeyboardArrowDown size={17} color='var(--text_0)' /> :
                                <MdKeyboardArrowRight size={17} color='var(--text_0)' /> :
                            <MdKeyboardArrowRight size={17} color='transparent' />

                    }
                </div>
                <div onClick={e => { setActive(f => !f) }} className={styles.rli0}>
                    {GetIconOfType(type)}
                    {name}
                </div>
                <div className={`${node === "root" ? styles.blockdrag : styles.grdrag}`}>
                    <GrDrag />
                </div>
                {
                    clicked &&
                    <ContextMenu
                        id={node}
                        points={points}
                        sidebar={true}
                        setClicked={setClicked}
                    />
                }
            </div>
            {
                active &&
                <RecursiveList start={node} pleft={pleft + 10} />
            }
        </div>
    );

}