import { useRef, useState } from 'react';
import Editor from '../../utils/Editor/Editor';
import styles from './playground.module.css';
import SideBar from '../../Components/SideBar/SideBar';
import TreeManager from '../../utils/TreeManager';
import { addNode } from '../../utils/treeFunctions';

export default () => {

    const [tree, setTree] = useState([]);
    const stopScrollRef = useRef(null);

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setTree(prev => [...prev,{id:Date.now(),childrens:[]}]);
    }
    const handleNodeDrop = (parentId, droppedId) => {
        setTree(prev=>addNode(prev,parentId,{id:Date.now(),childrens:[]}));
    }

    return (
        <div className={styles.playground}>
            <div ref={stopScrollRef} className={styles.container}>
                <SideBar />
                <div className={styles.bg}>
                    <Editor
                        e_width={'1200px'}
                        e_height={'800px'}
                        stopScrollRef={stopScrollRef}
                        handleDrop={handleDrop}
                    >
                        <TreeManager
                            tree={tree}
                            handleNodeDrop={handleNodeDrop}
                        />
                    </Editor>
                </div>
            </div>
        </div>
    );

}