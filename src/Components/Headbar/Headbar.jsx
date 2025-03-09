import { FaLaptop, FaMobileAlt, FaTabletAlt } from 'react-icons/fa';
import styles from './headbar.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { updateRootWidth } from '../../store/reducers/treeReducer';

export default () => {
    const dispatch = useDispatch();
    const maxWidth = useSelector(state => state.treeReducer.maxRootWidth.diff);
    const width = useSelector(state => {
        if (state.treeReducer.styleMap.root.width === '100%')
            return maxWidth;
        return Math.min(maxWidth, Math.max(350, Number(state.treeReducer.styleMap.root.width.split('p')[0])));
    });

    return (
        <div className={styles.head}>
            <div className={styles.removethis}>x</div>
            <div className={styles.dimensions}>
                <div onClick={() => dispatch(updateRootWidth({ width: "425px" }))} title='mobile' className={`${styles.d0} ${width <= 425 && styles.active}`}><FaMobileAlt size={13} /></div>
                <div onClick={() => dispatch(updateRootWidth({ width: "768px" }))} title='tablet' className={`${styles.d0} ${width > 425 && width <= 768 && styles.active}`}><FaTabletAlt size={13} /></div>
                <div onClick={() => dispatch(updateRootWidth({ width: "100%" }))} title='PC' className={`${styles.d0} ${width > 768 && styles.active}`}><FaLaptop size={15} /></div>
            </div>
            <div className={styles.width}>
                <div>
                    {
                        width <= 425 ? 'Mobile' :
                            width > 425 && width <= 768 ? 'Tablet' :
                                'Laptop'
                    }
                </div>
                {width}px
            </div>
        </div >
    );
}