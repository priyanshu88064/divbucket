import { MdOutlineEdit } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { FaCss3, FaHome, FaImage, FaRegSquare, FaVideo } from "react-icons/fa";
import { changeTab } from "@core/state/reducers/focusReducer";
import { LuHeading1 } from "react-icons/lu";
import { IoText } from "react-icons/io5";
import { BsTextParagraph } from "react-icons/bs";
import type { AppDispatch, RootState } from "@core/state/store";
import Empty from "./components/Empty";
import EditPanelHost from "./tabs/EditPanelHost";
import CssTab from "./tabs/CssTab/CssTab";
import { IoIosMenu } from "react-icons/io";

export const GetIconOfType = (type: string, size?: number) => {
  switch (type) {
    case "core:root":
      return <FaHome size={size || 12} />;
    case "core:container":
      return <FaRegSquare size={size || 12} />;
    case "core:row":
      return <FaRegSquare size={size || 12} />;
    case "core:heading":
      return <LuHeading1 size={size || 12} />;
    case "core:text":
      return <IoText size={size || 12} />;
    case "core:paragraph":
      return <BsTextParagraph size={size || 12} />;
    case "core:image":
      return <FaImage size={size || 12} />;
    case "core:video":
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
    <div className="w-[280px] z-[3] h-full ml-auto text-white flex text-xs overflow-hidden bg-[#283037]">
      {id ? (
        <>
          <div className="flex-1 overflow-y-scroll h-full pb-[150px]">
            {tab[0] === "0" ? <CssTab /> : <EditPanelHost id={id} focus={tab[1]} />}
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
