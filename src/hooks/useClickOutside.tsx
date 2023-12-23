import { useEffect, useRef } from "react";

type Handler = () => void;

export function useClickOutside<T extends HTMLDivElement>(handler: Handler) {
  const ref = useRef<T>(null);

  useEffect(() => {
    let listener = (event: { target: any }) => {
      if (ref.current && !ref.current.contains(event.target)) {
        // runs your passed function
        handler();
      }
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.addEventListener("touchend", listener);
    };
  }, [handler]);

  return ref;
}
