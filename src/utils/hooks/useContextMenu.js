import { useEffect, useState } from "react";

export function useContextMenu() {
  const [clicked, setClicked] = useState(false);
  const [points, setPoints] = useState({ x: 0, y: 0 });

  return {
    clicked,
    setClicked,
    points,
    setPoints,
  };
}
