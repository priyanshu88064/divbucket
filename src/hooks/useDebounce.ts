import { useEffect, useState } from "react";

export function useDebounce(value: string, delay: number) {
  const [dvalue, setDvalue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDvalue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return dvalue;
}
