import styles from './sidebar.module.css';

export default ()=>{

    const handleDragStart = (e)=>{
        e.dataTransfer.setData("text/plain","helloDrag");
        console.log("drag started")
    }
    
    return (
        <div className={styles.sidebar}>
            <div draggable onDragStart={handleDragStart}>dragMe</div>
        </div>
    );
}