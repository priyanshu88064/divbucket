import styles from "./sidebar.module.css";
import { IoAddOutline, IoLayers } from "react-icons/io5";
import { useState } from "react";
import Explorer from "./components/ExplorerTab";
import ElementsTab from "./components/ElementsTab";

const tabList = [
  {
    id: 0,
    icon: <IoAddOutline size={18} />,
  },
  {
    id: 1,
    icon: <IoLayers size={16} />,
  },
];

export default () => {
  const [tab, setTab] = useState<number | null>(0);

  const handleTabClick = (ind: number) => {
    if (tab === ind) setTab(null);
    else setTab(ind);
  };

  return (
    <div className={`${styles.sidebar}`}>
      <div className="w-12 bg-[#1B2228] h-full p-2 flex flex-col gap-2 border-r border-gray-600">
        {tabList.map((_tab, ind) => (
          <div
            key={"_tab-" + ind}
            onClick={() => handleTabClick(ind)}
            className={`
                flex items-center justify-center aspect-square rounded-md cursor-pointer [&>*]:text-gray-300 hover:border border-gray-600
                ${tab === ind ? "bg-[#323A43] [&>*]:text-white" : ""}
              `}
          >
            {_tab.icon}
          </div>
        ))}
      </div>
      {tab !== null && (
        <div className="w-[250px] bg-[#283037] text-xs flex flex-col">
          {tab === 0 ? <ElementsTab /> : tab == 1 ? <Explorer /> : <></>}
        </div>
      )}
    </div>
  );
};
