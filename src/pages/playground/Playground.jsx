import styles from './playground.module.css';
import SideBar from '../../Components/SideBar/SideBar';
import Cssbar from '../../Components/Cssbar/Cssbar';
import TreeManager from '../../utils/TreeManager';
import { useDispatch } from 'react-redux';
import { updateBgContentRect } from '../../store/reducers/treeReducer';
import { useEffect, useRef, useState } from 'react';
import { useDrag } from '../../utils/hooks/useDrag';
import { IoIosClose } from 'react-icons/io';

export default () => {
    const dispatch = useDispatch();
    const bgRef = useRef(null);
    const { handleDragStart, handleDragEnd, handleDragOver, handleDrop, handleDragLeave } = useDrag({ styles });
    const [tab,setTab] = useState(0);

    useEffect(() => {
        const observer = new ResizeObserver(entries => {
            const { width, height, top, bottom, left, right } = entries[0].contentRect;
            dispatch(updateBgContentRect({ bgContentRect: { width, height, top, bottom, left, right } }));
        })
        if (bgRef && bgRef.current) observer.observe(bgRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div className={styles.playground}>
            <SideBar />
            <div
                ref={bgRef}
                className={styles.bg}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onDragLeave={handleDragLeave}
                onDragEnd={handleDragEnd}
            >
                <div className={styles.tabwrap}>
                    <div onClick={()=>setTab(0)} className={`${styles.tab} ${tab===0 && styles.activetab}`}>Homepage  <IoIosClose style={{cursor:"pointer"}} size={17}/></div>
                    <div onClick={()=>setTab(1)} className={`${styles.tab} ${tab===1 && styles.activetab}`}>About Us  <IoIosClose style={{cursor:"pointer"}} size={17}/></div>
                    <div onClick={()=>setTab(2)} className={`${styles.tab} ${tab===2 && styles.activetab}`}>Container <IoIosClose style={{cursor:"pointer"}} size={17}/></div>
                </div>
                <TreeManager />
            </div>
            <Cssbar />
        </div>
    );

}