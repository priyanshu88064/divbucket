import Playground from '../../pages/playground/Playground';
import Headbar from '../Headbar/Headbar';
import styles from './playwrap.module.css';

export default () => {
    return (
        <div className={styles.playwrap}>
            <Headbar />
            <Playground />
        </div>
    );
}