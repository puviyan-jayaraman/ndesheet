import { jsx as _jsx } from "react/jsx-runtime";
import { useRef, useEffect } from "react";
const Menu = ({ onClick, onMouseLeave, onMouseEnter, children, }) => {
    useEffect(() => {
        // focus on mount for keyboard nav
        const element = document.querySelector(".luckysheet-cols-menuitem");
        if (element) {
            element.focus();
        }
    }, []);
    const containerRef = useRef(null);
    return (_jsx("div", { ref: containerRef, className: "luckysheet-cols-menuitem luckysheet-mousedown-cancel", onClick: (e) => onClick?.(e, containerRef.current), onMouseLeave: (e) => onMouseLeave?.(e, containerRef.current), onMouseEnter: (e) => onMouseEnter?.(e, containerRef.current), tabIndex: 0, children: _jsx("div", { className: "luckysheet-cols-menuitem-content luckysheet-mousedown-cancel", children: children }) }));
};
export default Menu;
