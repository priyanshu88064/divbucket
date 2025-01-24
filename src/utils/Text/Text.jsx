import Resizable from "../Resizable/Resizable";

export default ({ tree }) => {
    return (
        <Resizable
            id={tree.id}
        >
            Text
        </Resizable>
    );
}