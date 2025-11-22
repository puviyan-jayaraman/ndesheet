import { jsx as _jsx } from "react/jsx-runtime";
import { useRef } from "react";
import { useOutsideClick } from "../../hooks/useOutsideClick";
const MoreItemsContaier = ({ onClose, children }) => {
    const containerRef = useRef(null);
    useOutsideClick(containerRef, () => {
        onClose?.();
    }, [containerRef, onClose]);
    return (_jsx("div", { ref: containerRef, className: "fortune-toolbar-more-container", children: children }));
};
export default MoreItemsContaier;
