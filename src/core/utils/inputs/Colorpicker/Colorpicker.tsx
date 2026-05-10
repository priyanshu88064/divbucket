import { useEffect, useState } from "react";
import { useDebounce } from "@core/hooks/useDebounce";
import { createPortal } from "react-dom";
import { HexAlphaColorPicker, HexColorInput } from "react-colorful";

export default ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => {
  const [hex, setHex] = useState(value);
  const debounce = useDebounce(hex, 500);
  const [isOverlay, setIsOverlay] = useState(false);

  useEffect(() => {
    if (value !== debounce && debounce && debounce[0] === "#")
      onChange(debounce);
  }, [debounce, value]);

  return (
    <div className="w-fit">
      <div
        onClick={() => setIsOverlay((f) => !f)}
        className="w-11 h-6 border-4 border-gray-500 active:!bg-hoverblue"
        style={{ background: hex }}
      />

      {isOverlay &&
        createPortal(
          <div
            onClick={() => setIsOverlay(false)}
            className="fixed w-full h-full left-0 top-0 flex items-center justify-center"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-[#292E32] rounded-md shadow-xl shadow-black/60 overflow-hidden"
            >
              <div className="bg-[#283037] border-b border-gray-500 p-2 flex items-center justify-between text-gray-200 text-xs">
                <div className="flex-1"></div>
                <div className="flex-1  text-center">Choose a color</div>
                <div onClick={() => setIsOverlay(false)} className="flex-1 ">
                  <div className="w-min ml-auto p-1 border border-transparent bg-hoverblue hover:border-blue-400 active:bg-transparent rounded-sm cursor-default flex items-center">
                    Done
                  </div>
                </div>
              </div>
              <HexAlphaColorPicker
                color={hex}
                onChange={setHex}
                className="mx-24 my-4"
              />
              <div className="text-center">
                <HexColorInput
                  className="bg-none my-4 w-24 text-center text-gray-200 border-b border-gray-400 outline-none"
                  color={hex}
                  onChange={setHex}
                  prefixed={true}
                  alpha={true}
                />
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
};
