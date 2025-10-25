import { GiSquare } from "react-icons/gi";
import { LuLetterText, LuSquareArrowRight } from "react-icons/lu";
import { PiImageLight } from "react-icons/pi";
import { RiText } from "react-icons/ri";
import { IoIosList } from "react-icons/io";
import { GoHorizontalRule } from "react-icons/go";
import { TbLayoutNavbar, TbTemplate } from "react-icons/tb";
import { CiCreditCard1 } from "react-icons/ci";
import { GrDomain } from "react-icons/gr";

const elementList = [
  {
    title: "Elements",
    items: [
      {
        id: "Block",
        icon: <GiSquare size={30} />,
        name: "Div",
      },
      {
        id: "Row",
        icon: <LuSquareArrowRight size={30} />,
        name: "H-Flex",
      },
      {
        id: "Heading",
        icon: <LuSquareArrowRight size={30} />,
        name: "Heading",
      },
      {
        id: "Text",
        name: "Text",
        icon: <RiText size={30} />,
      },
      {
        id: "Paragraph",
        name: "Paragraph",
        icon: <LuLetterText size={30} />,
      },
      {
        id: "Image",
        name: "Image",
        icon: <PiImageLight size={30} />,
      },
      {
        id: "List",
        name: "List",
        icon: <IoIosList size={30} />,
      },
      {
        id: "ListItem",
        name: "List Item",
        icon: <GoHorizontalRule size={30} />,
      },
      {
        id: "Button",
        icon: <div className="border px-2 py-1 rounded-sm text-xs">Button</div>,
      },
      {
        id: "Card",
        name: "Card",
        icon: <CiCreditCard1 size={30} />,
      },
    ],
  },
  {
    title: "Layouts",
    items: [
      {
        id: "Navbar",
        name: "Navbar",
        icon: <TbLayoutNavbar size={30} />,
      },
      {
        id: "Hero",
        name: "Hero",
        icon: <GrDomain size={25} />,
      },
      {
        id: "Feature",
        name: "Feature",
        icon: <TbTemplate size={25} />,
      },
    ],
  },
];

export default function ElementsTab() {
  return (
    <div className="p-3 pb-48 flex flex-col gap-8 overflow-y-auto">
      {elementList.map((ele, ind) => (
        <div key={"elements-" + ind}>
          <div className="mt-2 text-[var(--text_0)] text-xs font-semibold uppercase">
            {ele.title}
          </div>
          <div className="grid grid-cols-2 mt-4 gap-3">
            {ele.items.map((item) => (
              <div
                key={"item-" + ind + item.id}
                draggable
                data-type={item.id}
                className={`
                    flex-1 bg-[#333C46] text-[var(--text_0)] cursor-grab rounded-md shadow-lg
                    py-4 flex gap-2 flex-col justify-center items-center border border-gray-600
                `}
              >
                {item.icon}
                {item.name && <div className="">{item.name}</div>}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
