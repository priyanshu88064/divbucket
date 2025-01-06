import { MdKeyboardArrowDown, MdKeyboardArrowRight } from 'react-icons/md';
import styles from './cssbar.module.css';
import { useState } from 'react';

export default () => {

    const [block, setBlock] = useState(null);

    return (
        <div className={styles.cssbar}>
            <div className={styles.c1}>
                <Wrap title={"Size"}>
                    <div className={styles.c11}>
                        <div className={styles.c110}>
                            <div>Width:</div>
                            <div className={styles.c1100}>230px</div>
                            <div className={styles.gapleft}>Height:</div>
                            <div className={styles.c1100}>1200px</div>
                        </div>
                        <div className={styles.c110}>
                            <div>Width:</div>
                            <div className={styles.c1100}>230px</div>
                            <div className={styles.gapleft}>Height:</div>
                            <div className={styles.c1100}>1200px</div>
                        </div>
                        <div className={styles.c110}>
                            <div>Width:</div>
                            <div className={styles.c1100}>230px</div>
                            <div className={styles.gapleft}>Height:</div>
                            <div className={styles.c1100}>1200px</div>
                        </div>
                    </div>
                </Wrap>
                <Wrap title={"Display"}>
                    hello world
                </Wrap>
                <Wrap title={"Margin & Padding"}>
                    hello world
                </Wrap>
                <Wrap title={"Colors"}>
                    hello world
                </Wrap>
                <Wrap title={"Position"}>
                    hello world
                </Wrap>
            </div>
        </div>
    );
}

const Wrap = ({ children, title }) => {

    const [isActive, setIsActive] = useState(true);

    return (
        <div className={styles.c10}>
            <div onClick={()=>setIsActive(f=>!f)} className={styles.c100}>
                {title}
                {
                    isActive ?
                    <MdKeyboardArrowDown className={styles.arrow} />:
                    <MdKeyboardArrowRight className={styles.arrow} />
                }
            </div>
            {isActive && children}
        </div>
    );

}