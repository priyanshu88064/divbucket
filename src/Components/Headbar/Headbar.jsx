import { FaEye, FaHome, FaLaptop, FaMobileAlt, FaTabletAlt } from 'react-icons/fa';
import styles from './headbar.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { updateRootWidth } from '../../store/reducers/treeReducer';
import { MdFullscreen, MdOutlineContentCopy } from 'react-icons/md';
import { FaDownload } from 'react-icons/fa6';
import { useRef, useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import { generateCode } from '../../utils/treeFunctions';

export default () => {
    const activeTab = useSelector(state => state.treeReducer.activeTab);
    const [isCode, setIsCode] = useState(true);

    return (
        <div className={styles.head}>
            <div className={styles.removethis}>WORK UNDER CONSTRUCTION</div>
            {activeTab && <WidthBox />}
            <div className={styles.fscreen} onClick={() => {
                if (!document.fullscreenElement)
                    document.documentElement.requestFullscreen();
                else if (document.exitFullscreen)
                    document.exitFullscreen();
            }}>
                <MdFullscreen size={22} />
            </div>
            <div className={`${styles.code} ${styles.preview}`}>
                <FaEye />
                PREVIEW
            </div>
            <div className={styles.code} onClick={() => setIsCode(f => !f)}>
                <FaDownload />
                HTML/CSS
            </div>
            {
                isCode &&
                <div className={styles.codeboxwrapper} onClick={() => setIsCode(false)}>
                    <div className={styles.codebox} onClick={e => e.stopPropagation()}>
                        <Code />
                    </div>
                </div>
            }
        </div>
    );
}

const Code = () => {
    const tabs = useSelector(state => state.treeReducer.tree.tabs);
    const tree = useSelector(state => state.treeReducer.tree);
    const dataMap = useSelector(state => state.treeReducer.dataMap);
    const styleMap = useSelector(state => state.treeReducer.styleMap);
    const [activeTab, setActiveTab] = useState(0);
    const code = tabs.map(tab => generateCode({ tab, tree, dataMap, styleMap }));
    const [isHtml, setIsHtml] = useState(true);
    const copiedRef = useRef(null);

    return (
        <>
            <div className={styles.codesidebar}>
                {
                    tabs.map((tab, ind) => (
                        <div
                            key={tab + ind + ""}
                            className={`${styles.csb0} ${ind === activeTab && styles.csb0active}`}
                            onClick={() => setActiveTab(ind)}
                        >
                            <FaHome />
                            {dataMap[tab].name}
                        </div>
                    ))
                }
            </div>
            <div className={styles.codearea}>
                <div className={styles.codecopy} onClick={() => {
                    if (isHtml)
                        navigator.clipboard.writeText(code[activeTab].html);
                    else
                        navigator.clipboard.writeText(code[activeTab].css);
                    if (copiedRef && copiedRef.current)
                        copiedRef.current.style.visibility = 'visible';
                    setTimeout(() => {
                        if (copiedRef && copiedRef.current)
                            copiedRef.current.style.visibility = 'hidden';
                    }, 1000);
                }}>
                    <MdOutlineContentCopy size={20} />
                    <div style={{ visibility: 'hidden' }} ref={copiedRef}>copied!!</div>
                </div>
                <div className={styles.catabs}>
                    <div onClick={() => setIsHtml(true)} className={`${isHtml && styles.catabsactive}`}>HTML</div>
                    <div onClick={() => setIsHtml(false)} className={`${!isHtml && styles.catabsactive}`}>CSS</div>
                </div>
                <textarea style={{ color: isHtml && 'orange' }} value={isHtml ? code[activeTab].html : code[activeTab].css} readOnly />
            </div>
        </>
    );
}

const WidthBox = () => {
    const activeTab = useSelector(state => state.treeReducer.activeTab);
    const maxWidth = useSelector(state => Math.floor(state.treeReducer.bgContentRect?.width - 10 - 80));//-10 for resizebar, -80 for margin
    const width = useSelector(state => {
        if (state.treeReducer.styleMap[activeTab].width === '100%')
            return maxWidth;
        return Math.min(maxWidth, Math.max(350, Number(state.treeReducer.styleMap[activeTab].width.split('p')[0])));
    });
    const dispatch = useDispatch();

    return (
        <>
            <div className={styles.dimensions}>
                <div onClick={() => dispatch(updateRootWidth({ width: "425px" }))} title='mobile' className={`${styles.d0} ${width <= 425 && styles.active}`}><FaMobileAlt size={13} /></div>
                <div onClick={() => dispatch(updateRootWidth({ width: "768px" }))} title='tablet' className={`${styles.d0} ${width > 425 && width <= 768 && styles.active}`}><FaTabletAlt size={13} /></div>
                <div onClick={() => dispatch(updateRootWidth({ width: "100%" }))} title='PC' className={`${styles.d0} ${width > 768 && styles.active}`}><FaLaptop size={14} /></div>
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
        </>
    );
}