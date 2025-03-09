import { CiSearch } from 'react-icons/ci';
import styles from './sidebar.module.css';
import { IoAddOutline, IoLayers, IoText } from 'react-icons/io5';
import { useEffect, useState } from 'react';
import { GiSquare } from 'react-icons/gi';
import { LuHeading1, LuLetterText, LuSquareArrowRight } from 'react-icons/lu';
import { PiImageLight, PiVideoLight } from 'react-icons/pi';
import { RiText } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
import { MdKeyboardArrowDown, MdKeyboardArrowRight } from 'react-icons/md';
import { updateActiveNode, updateMaxRootWidth } from '../../store/reducers/treeReducer';
import { useContextMenu } from '../../utils/hooks/useContextMenu';
import ContextMenu from '../ContextMenu/ContextMenu';
import { GetIconOfType } from '../Cssbar/Cssbar';

export default () => {

    const [tab, setTab] = useState(0);
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
            ref={e => dispatch(updateMaxRootWidth({ key: "left", value: e?.getBoundingClientRect()?.right }))}
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
                                <>
                                    <div className={`${styles.head} ${styles.exp}`}>EXPLORER</div>
                                    <div className={styles.rlist}>
                                        <RLItem
                                            key={"root"}
                                            node={"root"}
                                        />
                                    </div>
                                </> :
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

const RecursiveList = ({ start }) => {

    const tree = useSelector(state => state.treeReducer.tree);

    return (
        <>
            {
                tree[start].map(node => (
                    <RLItem
                        key={node}
                        node={node}
                    />
                ))
            }
        </>
    );
}

const RLItem = ({ node }) => {

    const type = useSelector(state => state.treeReducer.dataMap[node].type);
    const [active, setActive] = useState(true);
    const activeNodeId = useSelector(state => state.treeReducer.activeNodeId);
    const name = useSelector(state => state.treeReducer.dataMap[node].name);
    const { clicked, setClicked, points, setPoints } = useContextMenu();
    const dispatch = useDispatch();

    return (
        <div className={styles.rlistitem}>
            <div
                className={`${styles.rliwrap} ${activeNodeId === node ? styles.activeItemClass : ''}`}
                onClick={() => {
                    setActive(f => !f)
                    if (activeNodeId !== node)
                        dispatch(updateActiveNode({ id: node }))
                }}
                onContextMenu={e => {
                    e.preventDefault();
                    setClicked(true);
                    setPoints({ x: e.pageX, y: e.pageY });
                }}

            >
                <div
                    className={styles.rli0}
                    onClick={e => { e.preventDefault(); e.stopPropagation(); setActive(f => !f) }}
                >
                    {
                        ["root", "Row", "Block"].includes(type) ?
                            active ?
                                <MdKeyboardArrowDown size={17} color='var(--text_0)' /> :
                                <MdKeyboardArrowRight size={17} color='var(--text_0)' /> :
                            <MdKeyboardArrowRight size={17} color='transparent' />

                    }
                </div>
                <div className={styles.rli0}>
                    {GetIconOfType(type)}
                    {name}
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
                <div className={styles.rlicollapse}>
                    <RecursiveList start={node} />
                </div>
            }
        </div>
    );

}