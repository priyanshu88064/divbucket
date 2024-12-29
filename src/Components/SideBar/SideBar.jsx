import styles from './sidebar.module.css';

export default ()=>{

    const handleDragStart = (e)=>{
        e.dataTransfer.setData("data",0);
        console.log("drag started")
    }
    
    return (
        <div className={styles.sidebar}>
            <div draggable onDragStart={handleDragStart}>dragMe</div>
        </div>
    );
}