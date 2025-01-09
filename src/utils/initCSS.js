export default function initCSS(type){

    let style = {
        width:"auto",
        height:"auto",
        display:"auto",
        flexDirection:"row",
    };

    switch(type){
        case "ROW":
            style.width = "auto";
            style.height = "50px";
            style.display = "flex";
            break;
    }

    return style;
}