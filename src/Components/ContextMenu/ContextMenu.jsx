import React from 'react';
import styles from './contextmenu.module.css';

export default ({ points, list }) => {
    return (
        <div
            className={styles.contextmenu}
            style={{ left: points.x, top: points.y }}
            onMouseDown={e => {
                e.stopPropagation();
            }}
        >
            {
                list.map((item, ind) => (
                    <React.Fragment key={ind}>
                        {
                            item.map((subItem, sind) => (
                                <div key={"" + ind + sind} className={styles.cmitem}>
                                    <div className={styles.cmitem0}>{subItem.name}</div>
                                    <div className={styles.cmitem1}>{subItem.command}</div>
                                </div>
                            ))
                        }
                        {
                            ind < list.length - 1 &&
                            <div className={styles.br}></div>
                        }
                    </React.Fragment>
                ))
            }
        </div>
    );
}