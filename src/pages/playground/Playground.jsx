import styles from './playground.module.css';
import SideBar from '../../Components/SideBar/SideBar';
import Cssbar from '../../Components/Cssbar/Cssbar';
import TreeManager from '../../utils/TreeManager';

export default () => {

    return (
        <div className={styles.playground}>
            <SideBar />
            <div className={styles.bg}>
                <TreeManager />
            </div>
            <Cssbar />
        </div>
    );

}