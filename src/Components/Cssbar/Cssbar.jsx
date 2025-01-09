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
                            <div className={styles.c1101}>Width:</div>
                            <div className={styles.c1101}>Min W:</div>
                            <div className={styles.c1101}>Max W:</div>
                        </div>
                        <div className={styles.c110}>
                            <div className={styles.c1100}>
                                <div>100</div>
                                <div className={styles.unit}>px</div>
                            </div>
                            <div className={styles.c1100}>
                                <div>100</div>
                                <div className={styles.unit}>px</div>
                            </div>
                            <div className={styles.c1100}>
                                <div>1200</div>
                                <div className={styles.unit}>px</div>
                            </div>
                        </div>
                        <div className={styles.c110}>
                            <div className={styles.c1101}>Height:</div>
                            <div className={styles.c1101}>Min H:</div>
                            <div className={styles.c1101}>Max H:</div>
                        </div>
                        <div className={styles.c110}>
                            <div className={styles.c1100}>
                                <div>100</div>
                                <div className={styles.unit}>px</div>
                            </div>
                            <div className={styles.c1100}>
                                <div>100</div>
                                <div className={styles.unit}>px</div>
                            </div>
                            <div className={styles.c1100}>
                                <div>100</div>
                                <div className={styles.unit}>px</div>
                            </div>
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
            <div onClick={() => setIsActive(f => !f)} className={styles.c100}>
                {title}
                {
                    isActive ?
                        <MdKeyboardArrowDown className={styles.arrow} /> :
                        <MdKeyboardArrowRight className={styles.arrow} />
                }
            </div>
            {isActive && children}
        </div>
    );

}