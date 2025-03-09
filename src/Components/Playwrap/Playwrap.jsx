import Playground from '../../pages/playground/Playground';
import styles from './playwrap.module.css';

export default () => {
    return (
        <div className={styles.playwrap}>
            <div className={styles.head}></div>
            <Playground />
        </div>
    );
}