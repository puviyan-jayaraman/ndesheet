import React from "react";
import { defaultContext, defaultSettings, } from "@nde-sheet/core";
const defaultRefs = {
    globalCache: { undoList: [], redoList: [] },
    cellInput: React.createRef(),
    fxInput: React.createRef(),
    canvas: React.createRef(),
    cellArea: React.createRef(),
    workbookContainer: React.createRef(),
};
const WorkbookContext = React.createContext({
    context: defaultContext(defaultRefs),
    setContext: () => { },
    settings: defaultSettings,
    handleUndo: () => { },
    handleRedo: () => { },
    refs: {
        globalCache: { undoList: [], redoList: [] },
        cellInput: React.createRef(),
        fxInput: React.createRef(),
        canvas: React.createRef(),
        scrollbarX: React.createRef(),
        scrollbarY: React.createRef(),
        cellArea: React.createRef(),
        workbookContainer: React.createRef(),
    },
});
export default WorkbookContext;
