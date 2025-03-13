import React, { useEffect, useRef } from 'react';
import styles from './contextmenu.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { deleteFromParent, deleteNode, duplicate, paste, revealParent, updateClipboard } from '../../store/reducers/treeReducer';
import { changeTab } from '../../store/reducers/focusReducer';

export default ({ id, points, sidebar, setClicked }) => {

    const dispatch = useDispatch();
    const bgHeight = useSelector(state => state.treeReducer.bgContentRect.height);
    const bgTop = useSelector(state => state.treeReducer.bgContentRect.top);

    const list = sidebar ? [
        [
            {
                name: "Cut",
                command: "Ctrl + X",
                isOff: id === "root",
                func: () => {
                    dispatch(updateClipboard({ cut: id, copy: null }));
                    dispatch(deleteFromParent({ id }))
                }
            },
            {
                name: "Copy",
                command: "Ctrl + C",
                isOff: id === "root",
                func: () => {
                    dispatch(updateClipboard({ copy: id, cut: null }));
                }
            },
            {
                name: "Paste",
                command: "Ctrl + V",
                func: () => {
                    dispatch(paste());
                }
            }
        ],
        [
            {
                name: "Duplicate",
                command: "Ctrl + D",
                isOff: id === "root",
                func: () => {
                    dispatch(duplicate());
                }
            },
            {
                name: "Rename",
                command: "Ctrl + R",
                func: () => {
                    dispatch(changeTab({ tab: "12" }))
                }
            },
            {
                name: "Delete",
                command: "Backspace",
                func: () => {
                    dispatch(deleteNode({ id }))
                },
                isOff: id === "root"
            }
        ],
    ] : [
        [
            {
                name: "Cut",
                command: "Ctrl + X",
                isOff: id === "root",
                func: () => {
                    dispatch(updateClipboard({ cut: id, copy: null }));
                    dispatch(deleteFromParent({ id }))
                }
            },
            {
                name: "Copy",
                command: "Ctrl + C",
                isOff: id === "root",
                func: () => {
                    dispatch(updateClipboard({ copy: id, cut: null }));
                }
            },
            {
                name: "Paste",
                command: "Ctrl + V",
                func: () => {
                    dispatch(paste());
                }
            }
        ],
        [
            {
                name: "Duplicate",
                command: "Ctrl + D",
                isOff: id === "root",
                func: () => {
                    dispatch(duplicate());
                }
            },
            {
                name: "Rename",
                command: "Ctrl + R",
                func: () => {
                    dispatch(changeTab({ tab: "12" }))
                }
            },
            {
                name: "Delete",
                command: "Backspace",
                func: () => {
                    dispatch(deleteNode({ id }))
                },
                isOff: id === "root"
            }
        ],
        [
            {
                name: "Select Parent",
                command: "",
                isOff: id === "root",
                func: () => {
                    dispatch(revealParent());
                }
            },
        ]
    ]
    return (
        <div
            className={styles.cover}
            onContextMenu={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setClicked(false);
            }}
            onClick={(e) => {
                e.stopPropagation();
                setClicked(false);
            }}
        >
            <div
                className={styles.contextmenu}
                style={{
                    left: points.x,
                    top: points.y,
                    transform: points.y - bgTop > bgHeight * 2 / 3 && 'translateY(-100%)'
                }}
                onMouseDown={e => {
                    e.stopPropagation();
                }}
                onContextMenu={e => {
                    e.preventDefault();
                    e.stopPropagation();
                }}
                onClick={(e) => {
                    e.stopPropagation();
                }}
            >
                {
                    list.map((item, ind) => (
                        <React.Fragment key={ind}>
                            {
                                item.map((subItem, sind) => (
                                    <div onClick={() => {
                                        if (subItem.isOff) return;
                                        subItem.func();
                                        setClicked(false)
                                    }} key={"" + ind + sind} className={`${styles.cmitem} ${subItem.isOff && styles.cmitemoff}`}>
                                        <div className={styles.cmitem0}>{subItem.name}</div>
                                        <div className={styles.cmitem1}>{subItem.command}</div>
                                    </div>
                                ))
                            }
                            {
                                ind < list.length - 1 &&
                                <div className={styles.br}></div>
                            }
                        </React.Fragment>
                    ))
                }
            </div>
        </div>
    );
}