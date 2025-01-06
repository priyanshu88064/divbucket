import { CiCirclePlus, CiSearch } from 'react-icons/ci';
import styles from './sidebar.module.css';
import { FiPlusSquare, FiSearch } from 'react-icons/fi';
import { IoMdAdd } from 'react-icons/io';
import { IoAddOutline, IoLayers } from 'react-icons/io5';
import { BsFile, BsFiles } from 'react-icons/bs';
import { TfiLayersAlt } from 'react-icons/tfi';

export default () => {

    const handleDragStart = (e, type) => {
        e.dataTransfer.setData("type", type);
    }

    return (
        <div className={styles.sidebar}>
            <div className={styles.cont}>
                <div className={styles.it}><IoAddOutline className={styles.it0} size={23} /></div>
                <div className={styles.it}><IoLayers className={styles.it0} size={23} /></div>
                <div className={styles.it}><CiSearch className={styles.it0} size={23} /></div>
                <div draggable onDragStart={(e) => handleDragStart(e, 0)}>Resizable</div>
                <div draggable onDragStart={(e) => handleDragStart(e, "BLOCK")}>Block</div>
                <div draggable onDragStart={(e) => handleDragStart(e, "ROW")}>Row</div>
            </div>
            fjdajf
        </div>
    );
}