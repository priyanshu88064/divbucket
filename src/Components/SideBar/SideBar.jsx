import { CiSearch } from 'react-icons/ci';
import styles from './sidebar.module.css';
import { IoAddOutline, IoLayers, IoSquareOutline } from 'react-icons/io5';
import { useState } from 'react';
import { GiSquare } from 'react-icons/gi';
import { LuHeading1, LuLetterText, LuSquareArrowDown, LuSquareArrowRight } from 'react-icons/lu';
import { PiImageLight, PiVideoLight } from 'react-icons/pi';

/*
div
H-Flex
v-Flex

typography-
Headings
Paragraph/Text

media-
images,
videos,
*/

export default () => {

    const [tab, setTab] = useState(0);

    const handleDragStart = (e, type) => {
        e.dataTransfer.setData("type", type);
    }
    const handleTabClick = (ind) => {
        if (tab === ind) setTab(null);
        else setTab(ind);
    }

    return (
        <div className={styles.sidebar}>
            <div className={styles.cont}>
                <div onClick={() => handleTabClick(0)} className={`${tab === 0 && styles.activetab} ${styles.it}`}><IoAddOutline className={styles.it0} size={23} /></div>
                <div onClick={() => handleTabClick(1)} className={`${tab === 1 && styles.activetab} ${styles.it}`}><IoLayers className={styles.it0} size={23} /></div>
                <div onClick={() => handleTabClick(2)} className={`${tab === 2 && styles.activetab} ${styles.it}`}><CiSearch className={styles.it0} size={23} /></div>
                {/* <div draggable onDragStart={(e) => handleDragStart(e, 0)}>Resizable</div>
                <div draggable onDragStart={(e) => handleDragStart(e, "BLOCK")}>Block</div>
                <div draggable onDragStart={(e) => handleDragStart(e, "ROW")}>Row</div> */}
            </div>
            {
                tab !== null &&
                <div className={styles.a}>
                    {
                        tab === 0 ?
                            <>
                                <div className={styles.head}>Nodes</div>
                                <div className={styles.a1}>
                                    <div className={styles.a10}>
                                        <div><GiSquare size={40} /></div>
                                        <div>Div</div>
                                    </div>
                                    <div className={styles.a10} draggable onDragStart={(e) => handleDragStart(e, "ROW")} title='horizontal flex box'>
                                        <div><LuSquareArrowRight size={40} /></div>
                                        <div>H-Flex</div>
                                    </div>
                                    <div className={styles.a10}>
                                        <div><LuHeading1 size={40} /></div>
                                        <div>Heading</div>
                                    </div>
                                    <div className={styles.a10}>
                                        <div><LuLetterText size={40} /></div>
                                        <div>Paragraph</div>
                                    </div>
                                    <div className={styles.a10}>
                                        <div><PiImageLight size={40} /></div>
                                        <div>Image</div>
                                    </div>
                                    <div className={styles.a10}>
                                        <div><PiVideoLight size={40} /></div>
                                        <div>Video</div>
                                    </div>
                                </div>
                            </> :
                            tab == 1 ?
                                <>
                                    <div className={styles.head}>Tree Explorer</div>
                                    <div></div>
                                </> :
                                <>
                                    <div className={styles.head}>Search</div>
                                    <div></div>
                                </>
                    }
                </div>
            }
        </div>
    );
}