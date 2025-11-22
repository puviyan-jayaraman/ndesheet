import { jsx as _jsx } from "react/jsx-runtime";
import { useMemo } from "react";
const CustomIcon = ({ iconName, width = 24, height = 24, content, }) => {
    const innrContent = useMemo(() => {
        if (iconName) {
            return (_jsx("svg", { width: width, height: height, children: _jsx("use", { xlinkHref: `#${iconName}` }) }));
        }
        if (content) {
            return content;
        }
        return (_jsx("svg", { width: width, height: width, children: _jsx("use", { xlinkHref: "#default" }) }));
    }, [content, height, iconName, width]);
    return (_jsx("div", { style: {
            width,
            height,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        }, children: innrContent }));
};
export default CustomIcon;
