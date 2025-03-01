import { useRef } from 'react';
import styles from './playground.module.css';
import SideBar from '../../Components/SideBar/SideBar';
import Cssbar from '../../Components/Cssbar/Cssbar';
import TreeManager from '../../utils/TreeManager';

export default () => {

    const stopScrollRef = useRef(null);

    return (
        <div className={styles.playground}>
            <div ref={stopScrollRef} className={styles.container}>
                <SideBar />
                <Cssbar />
                <div className={styles.bg}>
                    <TreeManager />
                </div>
            </div>
        </div>
    );

}