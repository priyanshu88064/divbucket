import { FaCat } from "react-icons/fa";

export default function Empty() {
  return (
    <div className="h-full w-full flex flex-col items-center pt-12 opacity-50">
      <FaCat size={50} />
      <div className="mt-[10px]">Feeling empty</div>
    </div>
  );
}
