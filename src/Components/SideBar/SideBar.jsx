import styles from './sidebar.module.css';

export default ()=>{

    const handleDragStart = (e,type)=>{
        e.dataTransfer.setData("type",type);
    }
    
    return (
        <div className={styles.sidebar}>
            <div draggable onDragStart={(e)=>handleDragStart(e,0)}>Resizable</div>
            <div draggable onDragStart={(e)=>handleDragStart(e,"BLOCK")}>Block</div>
            <div draggable onDragStart={(e)=>handleDragStart(e,"ROW")}>Row</div>
        </div>
    );
}