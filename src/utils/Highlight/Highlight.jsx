import { useEffect, useRef } from 'react';
import styles from './highlight.module.css';

export default ({children})=>{

    return (
        <>
            <div className={`${styles.a}`}>
                <div className={`${styles.resizer} ${styles.top}`}></div>
                <div className={`${styles.resizer} ${styles.right}`}></div>
                <div className={`${styles.resizer} ${styles.bottom}`}></div>
                <div className={`${styles.resizer} ${styles.left}`}></div>
                {children}
            </div>
        </>
    );

}