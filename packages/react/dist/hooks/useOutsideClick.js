import { useEffect } from "react";
export function useOutsideClick(containerRef, handler, deps) {
    useEffect(() => {
        function handleClickOutside(e) {
            if (containerRef.current &&
                !containerRef.current.contains(e.target)) {
                handler();
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
}
