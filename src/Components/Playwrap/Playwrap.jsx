import { MdOutlineSecurityUpdateWarning } from 'react-icons/md';
import Playground from '../../pages/playground/Playground';
import Headbar from '../Headbar/Headbar';
import styles from './playwrap.module.css';
import { useRef } from 'react';

export default () => {
    const widthRef = useRef(window.screen.width);

    return (
        <div className={styles.playwrap}>
            <Headbar />
            <Playground />
            {
                widthRef.current < 1024 &&
                <div className={styles.notsupported}>
                    <div className={styles.ns0}>
                        <div className={styles.ns00}>Unsupported Device</div>
                        <div className={styles.ns01}>
                            <MdOutlineSecurityUpdateWarning size={100} />
                            <div className={styles.ns010}>
                                Your device's screen is too small to support this app.
                            </div>
                            <div>
                                Please use a Laptop, PC or device with a wider screen.
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}