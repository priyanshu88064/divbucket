import { MdOutlineEdit } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { FaCss3, FaHome, FaImage, FaRegSquare, FaVideo } from "react-icons/fa";
import { changeTab } from "../../store/reducers/focusReducer";
import { LuHeading1 } from "react-icons/lu";
import { IoText } from "react-icons/io5";
import { BsTextParagraph } from "react-icons/bs";
import type { AppDispatch, RootState } from "../../store/store";
import Empty from "./components/Empty";
import EditTab from "./tabs/EditTab";
import CssTab from "./tabs/CssTab/CssTab";
import { IoIosMenu } from "react-icons/io";

export const GetIconOfType = (type: string, size?: number) => {
  switch (type) {
    case "root":
      return <FaHome size={size || 12} />;
    case "Block":
      return <FaRegSquare size={size || 12} />;
    case "Row":
      return <FaRegSquare size={size || 12} />;
    case "Heading":
      return <LuHeading1 size={size || 12} />;
    case "Text":
      return <IoText size={size || 12} />;
    case "Paragraph":
      return <BsTextParagraph size={size || 12} />;
    case "Image":
      return <FaImage size={size || 12} />;
    case "Video":
      return <FaVideo size={size || 12} />;

    default:
      return <FaHome size={size || 12} />;
  }
};

const CssTabs = [
  {
    name: "Styles",
    icon: <FaCss3 size={16} />,
    changeRef: "00",
  },
  {
    name: "Edit",
    icon: <MdOutlineEdit size={16} />,
    changeRef: "10",
  },
];

export default () => {
  const tab = useSelector((state: RootState) => state.focusReducer.tab);
  const id = useSelector((state: RootState) => state.treeReducer.activeNodeId);
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div className="w-[280px] h-full ml-auto text-white flex text-xs overflow-hidden bg-[#283037]">
      {id ? (
        <>
          <div className="flex-1 overflow-y-scroll h-full pb-[150px]">
            {tab[0] === "0" ? <CssTab /> : <EditTab focus={tab[1]} />}
          </div>
          <div className="p-[4px] pr-[2px] pt-2 flex flex-col items-center gap-2">
            <div className="flex justify-center items-center w-6 h-6 p-[4px] border border-transparent rounded-sm hover:border-blue-400 active:bg-hoverblue">
              <IoIosMenu size={18} />
            </div>
            {CssTabs.map((csstab, ind) => (
              <div
                key={csstab.name + ind}
                title={csstab.name}
                className={`
                flex justify-center items-center w-6 h-6 p-[4px] border border-transparent rounded-sm
                hover:border-blue-400 active:bg-hoverblue ${tab[0] === ind + "" ? "bg-gray-600" : ""}
              `}
                onClick={() => dispatch(changeTab({ tab: csstab.changeRef }))}
              >
                {csstab.icon}
              </div>
            ))}
          </div>
        </>
      ) : (
        <Empty />
      )}
    </div>
  );
};
