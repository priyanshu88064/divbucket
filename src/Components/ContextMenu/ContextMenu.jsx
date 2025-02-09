import React from 'react';
import styles from './contextmenu.module.css';
import { useDispatch } from 'react-redux';
import { deleteNode } from '../../store/reducers/treeReducer';

export default ({ id, points, sidebar, setClicked }) => {

    const dispatch = useDispatch();

    const list = sidebar ? [
        [
            {
                name: "Cut",
                command: "Ctrl + X"
            },
            {
                name: "Copy",
                command: "Ctrl + C"
            },
            {
                name: "Paste",
                command: "Ctrl + V"
            }
        ],
        [
            {
                name: "Duplicate",
                command: "Ctrl + D"
            },
            {
                name: "Rename",
                command: "Ctrl + R"
            },
            {
                name: "Delete",
                command: "Backspace",
            }
        ],
    ] : [
        [
            {
                name: "Cut",
                command: "Ctrl + X"
            },
            {
                name: "Copy",
                command: "Ctrl + C"
            },
            {
                name: "Paste",
                command: "Ctrl + V"
            }
        ],
        [
            {
                name: "Duplicate",
                command: "Ctrl + D"
            },
            {
                name: "Lock",
                command: "Ctrl + D"
            },
            {
                name: "Rename",
                command: "Ctrl + R"
            },
            {
                name: "Delete",
                command: "Backspace",
                func: () => {
                    dispatch(deleteNode({ id }))
                    setClicked(false);
                }
            }
        ],
        [
            {
                name: "Select Parent",
                command: ""
            },
            {
                name: "Reveal in Explorer",
                command: ""
            }
        ]
    ]

    return (
        <div
            className={styles.contextmenu}
            style={{ left: points.x, top: points.y }}
            onMouseDown={e => {
                e.stopPropagation();
            }}
            onContextMenu={e => {
                e.preventDefault();
                e.stopPropagation();
            }}
        >
            {
                list.map((item, ind) => (
                    <React.Fragment key={ind}>
                        {
                            item.map((subItem, sind) => (
                                <div onClick={() => { subItem.func() }} key={"" + ind + sind} className={styles.cmitem}>
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
    );
}