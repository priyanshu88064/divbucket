import { CiSearch } from 'react-icons/ci';
import styles from './sidebar.module.css';
import { IoAddOutline, IoLayers } from 'react-icons/io5';
import { useRef, useState } from 'react';
import { GiSquare } from 'react-icons/gi';
import { LuHeading1, LuLetterText, LuSquareArrowRight } from 'react-icons/lu';
import { PiImageLight, PiVideoLight } from 'react-icons/pi';
import { RiText } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
import { MdKeyboardArrowDown, MdKeyboardArrowRight } from 'react-icons/md';
import { addNode, moveItem, updateActiveNode, updateActiveTab } from '../../store/reducers/treeReducer';
import { useContextMenu } from '../../utils/hooks/useContextMenu';
import ContextMenu from '../ContextMenu/ContextMenu';
import { GetIconOfType } from '../Cssbar/Cssbar';
import { GrDrag } from 'react-icons/gr';
import { FaFile, FaHome } from 'react-icons/fa';
import { FaFileCirclePlus } from 'react-icons/fa6';
import { BsFileEarmarkPlus, BsFileEarmarkPlusFill } from 'react-icons/bs';
import { VscNewFile } from 'react-icons/vsc';
import { createTemplate } from '../../utils/template';

export default () => {

    const [tab, setTab] = useState(1);

    const handleDragStart = (e, type) => {
        e.dataTransfer.setData("type", type);
    }
    const handleTabClick = (ind) => {
        if (tab === ind) setTab(null);
        else setTab(ind);
    }

    return (
        <div className={styles.sidebar}>
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
    const dragWrapperRef = useRef(null);
    const dispatch = useDispatch();
    const tabs = useSelector(state => state.treeReducer.tree.tabs);
    const activeTab = useSelector(state => state.treeReducer.activeTab);
    const [newPage, setNewPage] = useState(false);
    const [newPageName, setNewPageName] = useState('My Page');

    const handleDragStart = (e) => {
        var dragWrapper = document.createElement('div');
        var dragImage = document.createElement('div');
        dragImage.innerText = e.target.innerText;
        dragWrapper.classList.add(styles.dragwrapper);
        dragImage.classList.add(styles.dragimage);
        dragWrapper.appendChild(dragImage)
        document.body.appendChild(dragWrapper);
        e.dataTransfer.setDragImage(dragImage, -10, -10);

        draggedNode.current = e.target;
        dragWrapperRef.current = dragWrapper;
        e.target.classList.add(styles.removingitem);
    }
    const handleDragEnd = (e) => {
        e.target.classList.remove(styles.removingitem);
        if (dragWrapperRef && dragWrapperRef.current)
            dragWrapperRef.current.remove();
        dragWrapperRef.current = null;
        draggedNode.current = null;
    }
    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const targetNode = e.target.getAttribute('data-id');
        if (!draggedNode.current || !targetNode || targetNode === draggedNode.current.getAttribute('data-id')) return;
        const rect = e.target.getBoundingClientRect();
        const diff = e.clientY - rect.top;
        if (targetNode !== activeTab && diff <= rect.height / 3) {
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
        if (!draggedNode.current) return;
        e.target.classList.remove(styles.dragtop, styles.dragmiddle, styles.dragbottom);
        const targetNode = e.target.getAttribute('data-id');
        const _draggedNode = draggedNode.current.getAttribute('data-id');
        if (!targetNode || targetNode === _draggedNode) return;
        const rect = e.target.getBoundingClientRect();
        const diff = e.clientY - rect.top;
        if (targetNode !== activeTab && diff <= rect.height / 3) {
            dispatch(moveItem({ node: _draggedNode, referenceNode: targetNode, pos: 0 }))
        } else if (diff <= (rect.height * 2) / 3) {
            dispatch(moveItem({ node: _draggedNode, referenceNode: targetNode, pos: -1 }))
        } else {
            dispatch(moveItem({ node: _draggedNode, referenceNode: targetNode, pos: 1 }))
        }
        if (dragWrapperRef && dragWrapperRef.current)
            dragWrapperRef.current.remove();
        dragWrapperRef.current = null;
    }
    const handleDragLeave = (e) => {
        e.target.classList.remove(styles.dragtop, styles.dragmiddle, styles.dragbottom);
    }
    const handleAddPage = () => {
        if (!newPageName.length) return;
        setNewPage(false);
        setNewPageName('My Page');
        const child = createTemplate({ type: 'Tab', name: newPageName, dispatch })
        dispatch(addNode({ parent: 'tabs', child }))
        dispatch(updateActiveTab({ tab: child }))
    }

    return (
        <>
            <div className={`${styles.head} ${styles.exp}`}>
                <div>EXPLORER</div>
                <div title='add page' style={{ cursor: 'pointer' }} onClick={() => setNewPage(f => !f)}>
                    <VscNewFile size={15} color='white' />
                </div>
            </div>
            <div
                className={styles.rlist}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                {
                    newPage &&
                    <div className={styles.newpage}>
                        <input
                            size={5}
                            value={newPageName}
                            onFocus={e => e.target.select()}
                            type='text'
                            onKeyUp={e => {
                                if (e.key === 'Enter') {
                                    handleAddPage();
                                }
                            }}
                            onChange={e => {
                                setNewPageName(e.target.value);
                            }}
                        />
                        <div onClick={() => handleAddPage()}>Add Page</div>
                    </div>
                }
                {
                    tabs.map((tab, ind) => (
                        <RLItem
                            key={tab + ind + ""}
                            node={tab}
                            pleft={5}
                            myTab={tab}
                        />
                    ))
                }
            </div>
        </>
    );
}

const RecursiveList = ({ start, pleft, myTab }) => {

    const tree = useSelector(state => state.treeReducer.tree);

    return (
        <>
            {
                tree[start].map(node => (
                    <RLItem
                        key={node}
                        node={node}
                        pleft={pleft}
                        myTab={myTab}
                    />
                ))
            }
        </>
    );
}

const RLItem = ({ node, pleft, myTab }) => {

    const type = useSelector(state => state.treeReducer.dataMap[node].type);
    const unit = useSelector(state => state.treeReducer.dataMap[node].unit);
    const [active, setActive] = useState(true);
    const activeNodeId = useSelector(state => state.treeReducer.activeNodeId);
    const activeTab = useSelector(state => state.treeReducer.activeTab);
    const name = useSelector(state => state.treeReducer.dataMap[node].name);
    const { clicked, setClicked, points, setPoints } = useContextMenu();
    const dispatch = useDispatch();

    return (
        <div className={styles.rlistitem} >
            <div
                data-id={node}
                draggable={type !== "root"}
                style={{ paddingLeft: pleft + "px" }}
                className={`${styles.rliwrap} ${activeNodeId === node ? styles.activeItemClass : ''} ${unit && styles.redrag}`}
                onClick={() => {
                    if (myTab !== activeTab)
                        dispatch(updateActiveTab({ tab: myTab }))
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
                        !unit ?
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
                <div className={`${styles.grdrag} ${type === 'root' && styles.grshow}`}>
                    {
                        type === 'root' ?
                            <FaFile /> :
                            <GrDrag />
                    }
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
                <RecursiveList start={node} pleft={pleft + 10} myTab={myTab} />
            }
        </div>
    );

}