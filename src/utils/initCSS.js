export default function initCSS(type){

    let style = {
        width:"auto",
        height:"auto",
        display:"auto",
        flexDirection:"row",
    };

    switch(type){
        case "ROW":
            style.height = "50px";
            style.display = "flex";
            break;
        case "BLOCK":
            style.height = "20px";
            break;
    }

    return style;
}