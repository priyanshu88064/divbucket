import { useRef, useState } from 'react';
import Editor from '../../utils/Editor/Editor';
import Highlight from '../../utils/Highlight/Highlight';
import Resizable from '../../utils/Resizable/Resizable';
import styles from './playground.module.css';
import SideBar from '../../Components/SideBar/SideBar';

export default () => {

    const stopScrollRef = useRef(null);

    return (
        <div className={styles.playground}>
            <div ref={stopScrollRef} className={styles.container}>
                <SideBar />
                <div className={styles.bg}>

                    <Editor
                        e_width={'1200px'}
                        e_height={'800px'}
                        stopScrollRef={stopScrollRef}
                    >
                        <Resizable className={styles.res}>
                            <Resizable className={styles.res}>
                                loop
                            </Resizable>
                            loopsss
                        </Resizable>
                        <Resizable className={styles.res} >
                            hello I'm resizable component
                        </Resizable>

                    </Editor>

                </div>
            </div>
        </div>
    );

}