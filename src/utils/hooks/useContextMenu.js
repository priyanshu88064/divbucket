import { useEffect, useState } from "react";

export function useContextMenu() {
  const [clicked, setClicked] = useState(false);
  const [points, setPoints] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleClick = () => setClicked(false);
    window.addEventListener("mousedown", handleClick);
    return () => {
      window.removeEventListener("mousedown", handleClick);
    };
  }, []);

  return {
    clicked,
    setClicked,
    points,
    setPoints,
  };
}