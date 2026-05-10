import { useEffect, useState } from "react";

export default function Loader() {
  const [fakeProgress, setFakeProgress] = useState(0);

  useEffect(() => {
    const updateProgressInterval = setInterval(() => {
      setFakeProgress((previousProgress) => {
        const nextProgress = Math.min(98, previousProgress + 3);
        if (nextProgress === 98) clearInterval(updateProgressInterval);
        return nextProgress;
      });
    }, 50);

    return () => {
      clearInterval(updateProgressInterval);
    };
  }, []);

  return (
    <div
      className={`fixed w-screen h-screen z-[999] bg-black top-0 left-0 flex items-center justify-center`}
    >
      <div className="w-[95%] max-w-[400px] p-4 border border-gray-800 text-gray-300 text-sm">
        <div>
          Divbucket{" "}
          <span className="ml-1 text-[10px] text-gray-400">
            a nocode website builder
          </span>
        </div>
        <div className="mt-4 text-xs">Initializing...</div>
        <div className="flex gap-1 items-center">
          <div className="relative h-1.5 mt-2 w-full bg-[#283037] rounded-full -translate-x-0.5">
            <div
              style={{ width: fakeProgress + "%" }}
              className="absolute h-full bg-blue-400 border border-gray-400 rounded-full transition-[width] duration-75"
            ></div>
          </div>
          <div className="text-gray-400 text-xs translate-y-0.5">
            {fakeProgress}%
          </div>
        </div>
      </div>
    </div>
  );
}
