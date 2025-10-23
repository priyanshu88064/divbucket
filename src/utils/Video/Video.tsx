import { FaVideo } from "react-icons/fa";
import Resizable from "../Resizable/Resizable";

export default ({ node }: { node: number }) => {
  return (
    <Resizable id={node}>
      <div>
        <FaVideo size={40} color="gray" />
      </div>
    </Resizable>
  );
};