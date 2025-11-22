import { jsx as _jsx } from "react/jsx-runtime";
import Dialog from "../Dialog";
const MessageBox = ({ type = "yesno", onOk, onCancel, children, }) => {
    return (_jsx(Dialog, { type: type, onOk: onOk, onCancel: onCancel, contentStyle: {
            width: 300,
            paddingTop: 20,
            paddingBottom: 30,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        }, children: children }));
};
export default MessageBox;
