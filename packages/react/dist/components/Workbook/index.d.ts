import { Settings, CellWithRowAndCol, Sheet as SheetType, Op, CellMatrix } from "@nde-sheet/core";
import React from "react";
import "./index.css";
import { generateAPIs } from "./api";
export type WorkbookInstance = ReturnType<typeof generateAPIs>;
type AdditionalProps = {
    onChange?: (data: SheetType[]) => void;
    onOp?: (op: Op[]) => void;
};
declare const Workbook: React.ForwardRefExoticComponent<Settings & AdditionalProps & React.RefAttributes<{
    applyOp: (ops: Op[]) => void;
    getCellValue: (row: number, column: number, options?: import("@nde-sheet/core/dist/api").CommonOptions & {
        type?: keyof import("@nde-sheet/core").Cell;
    }) => any;
    setCellValue: (row: number, column: number, value: any, options?: import("@nde-sheet/core/dist/api").CommonOptions & {
        type?: keyof import("@nde-sheet/core").Cell;
    }) => void;
    clearCell: (row: number, column: number, options?: import("@nde-sheet/core/dist/api").CommonOptions) => void;
    setCellFormat: (row: number, column: number, attr: keyof import("@nde-sheet/core").Cell, value: any, options?: import("@nde-sheet/core/dist/api").CommonOptions) => void;
    autoFillCell: (copyRange: import("@nde-sheet/core").SingleRange, applyRange: import("@nde-sheet/core").SingleRange, direction: "up" | "down" | "left" | "right") => void;
    freeze: (type: "row" | "column" | "both", range: {
        row: number;
        column: number;
    }, options?: import("@nde-sheet/core/dist/api").CommonOptions) => void;
    insertRowOrColumn: (type: "row" | "column", index: number, count: number, direction?: "lefttop" | "rightbottom", options?: import("@nde-sheet/core/dist/api").CommonOptions) => void;
    deleteRowOrColumn: (type: "row" | "column", start: number, end: number, options?: import("@nde-sheet/core/dist/api").CommonOptions) => void;
    hideRowOrColumn: (rowOrColInfo: string[], type: "row" | "column") => void;
    showRowOrColumn: (rowOrColInfo: string[], type: "row" | "column") => void;
    setRowHeight: (rowInfo: Record<string, number>, options?: import("@nde-sheet/core/dist/api").CommonOptions, custom?: boolean) => void;
    setColumnWidth: (columnInfo: Record<string, number>, options?: import("@nde-sheet/core/dist/api").CommonOptions, custom?: boolean) => void;
    getRowHeight: (rows: number[], options?: import("@nde-sheet/core/dist/api").CommonOptions) => Record<number, number>;
    getColumnWidth: (columns: number[], options?: import("@nde-sheet/core/dist/api").CommonOptions) => Record<number, number>;
    getSelection: () => {
        row: number[];
        column: number[];
    }[] | undefined;
    getFlattenRange: (range: import("@nde-sheet/core").Range) => {
        r: number;
        c: number;
    }[];
    getCellsByFlattenRange: (range?: {
        r: number;
        c: number;
    }[]) => (import("@nde-sheet/core").Cell | null)[];
    getSelectionCoordinates: () => string[];
    getCellsByRange: (range: import("@nde-sheet/core").Selection, options?: import("@nde-sheet/core/dist/api").CommonOptions) => (import("@nde-sheet/core").Cell | null)[][];
    getHtmlByRange: (range: import("@nde-sheet/core").Range, options?: import("@nde-sheet/core/dist/api").CommonOptions) => string | null;
    setSelection: (range: import("@nde-sheet/core").Range, options?: import("@nde-sheet/core/dist/api").CommonOptions) => void;
    setCellValuesByRange: (data: any[][], range: import("@nde-sheet/core").SingleRange, options?: import("@nde-sheet/core/dist/api").CommonOptions) => void;
    setCellFormatByRange: (attr: keyof import("@nde-sheet/core").Cell, value: any, range: import("@nde-sheet/core").Range | import("@nde-sheet/core").SingleRange, options?: import("@nde-sheet/core/dist/api").CommonOptions) => void;
    mergeCells: (ranges: import("@nde-sheet/core").Range, type: string, options?: import("@nde-sheet/core/dist/api").CommonOptions) => void;
    cancelMerge: (ranges: import("@nde-sheet/core").Range, options?: import("@nde-sheet/core/dist/api").CommonOptions) => void;
    getAllSheets: () => SheetType[];
    getSheet: (options?: import("@nde-sheet/core/dist/api").CommonOptions) => {
        celldata: CellWithRowAndCol[];
        name: string;
        config?: import("@nde-sheet/core").SheetConfig;
        order?: number;
        color?: string;
        data?: CellMatrix;
        id?: string;
        images?: import("@nde-sheet/core").Image[];
        zoomRatio?: number;
        column?: number;
        row?: number;
        addRows?: number;
        status?: number;
        hide?: number;
        luckysheet_select_save?: import("@nde-sheet/core").Selection[];
        luckysheet_selection_range?: {
            row: number[];
            column: number[];
        }[];
        calcChain?: any[];
        defaultRowHeight?: number;
        defaultColWidth?: number;
        showGridLines?: boolean | number;
        pivotTable?: any;
        isPivotTable?: boolean;
        filter?: Record<string, any>;
        filter_select?: {
            row: number[];
            column: number[];
        };
        luckysheet_conditionformat_save?: any[];
        luckysheet_alternateformat_save?: any[];
        dataVerification?: any;
        hyperlink?: Record<string, {
            linkType: string;
            linkAddress: string;
        }>;
        dynamicArray_compute?: any;
        dynamicArray?: any[];
        frozen?: {
            type: "row" | "column" | "both" | "rangeRow" | "rangeColumn" | "rangeBoth";
            range?: {
                row_focus: number;
                column_focus: number;
            };
        };
    };
    addSheet: (sheetId?: string) => void;
    deleteSheet: (options?: import("@nde-sheet/core/dist/api").CommonOptions) => void;
    updateSheet: (data: SheetType[]) => void;
    activateSheet: (options?: import("@nde-sheet/core/dist/api").CommonOptions) => void;
    setSheetName: (name: string, options?: import("@nde-sheet/core/dist/api").CommonOptions) => void;
    setSheetOrder: (orderList: Record<string, number>) => void;
    scroll: (options: {
        scrollLeft?: number;
        scrollTop?: number;
        targetRow?: number;
        targetColumn?: number;
    }) => void;
    addPresences: (newPresences: import("@nde-sheet/core").Presence[]) => void;
    removePresences: (arr: {
        username: string;
        userId?: string;
    }[]) => void;
    handleUndo: () => void;
    handleRedo: () => void;
    calculateFormula: (id?: string, range?: import("@nde-sheet/core").SingleRange) => void;
    dataToCelldata: (data: CellMatrix | undefined) => CellWithRowAndCol[];
    celldataToData: (celldata: CellWithRowAndCol[], rowCount?: number, colCount?: number) => CellMatrix | null;
    batchCallApis: (apiCalls: {
        name: string;
        args: any[];
    }[]) => void;
}>>;
export default Workbook;
