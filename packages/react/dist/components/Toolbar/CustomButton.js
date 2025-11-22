import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import CustomIcon from "./CustomIcon";
const CustomButton = ({ tooltip, onClick, selected, children, iconName, icon, }) => {
    // const style: CSSProperties = { userSelect: "none" };
    return (_jsxs("div", { className: "fortune-toolbar-button fortune-toolbar-item", onClick: onClick, tabIndex: 0, "data-tips": tooltip, role: "button", style: selected ? { backgroundColor: "#E7E5EB" } : {}, children: [_jsx(CustomIcon, { iconName: iconName, content: icon }), tooltip && _jsx("div", { className: "fortune-tooltip", children: tooltip }), children] }));
};
export default CustomButton;
