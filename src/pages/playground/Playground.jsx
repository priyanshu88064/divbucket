import { useRef, useState } from 'react';
import Editor from '../../utils/Editor/Editor';
import styles from './playground.module.css';
import SideBar from '../../Components/SideBar/SideBar';
import TreeManager from '../../utils/TreeManager';
import { useDispatch } from 'react-redux';
import { updateActiveNode } from '../../store/reducers/treeReducer';
import Cssbar from '../../Components/Cssbar/Cssbar';

export default () => {

    const stopScrollRef = useRef(null);
    const dispatch = useDispatch();

    return (
        <div className={styles.playground} onClick={() => dispatch(updateActiveNode({ nodeId: null }))}>
            <div ref={stopScrollRef} className={styles.container}>
                <SideBar />
                <Cssbar />
                <div className={styles.bg}>
                    <Editor
                        e_width={'1200px'}
                        e_height={'800px'}
                        stopScrollRef={stopScrollRef}
                    >
                        <TreeManager />
                    </Editor>
                </div>
            </div>
        </div>
    );

}