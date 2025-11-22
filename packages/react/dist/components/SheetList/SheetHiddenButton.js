import { jsx as _jsx } from "react/jsx-runtime";
import { api } from "@nde-sheet/core";
import { useCallback, useContext } from "react";
import SVGIcon from "../SVGIcon";
import WorkbookContext from "../../context";
const SheetHiddenButton = ({ style, sheet }) => {
    const { context, setContext } = useContext(WorkbookContext);
    const showSheet = useCallback(() => {
        if (context.allowEdit === false)
            return;
        if (!sheet)
            return;
        setContext((ctx) => {
            api.showSheet(ctx, sheet.id);
        });
    }, [context.allowEdit, setContext, sheet]);
    return (_jsx("div", { style: style, onClick: (e) => {
            e.stopPropagation();
            showSheet();
        }, tabIndex: 0, className: "fortune-sheet-hidden-button", children: sheet?.hide === 1 ? (_jsx(SVGIcon, { name: "hidden", width: 16, height: 16, style: {
                marginTop: "7px",
            } })) : ("") }));
};
export default SheetHiddenButton;
