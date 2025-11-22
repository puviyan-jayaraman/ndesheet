import { Context } from "../context";
import { CellMatrix, CellWithRowAndCol, Sheet } from "../types";
export type CommonOptions = {
    index?: number;
    id?: string;
};
export declare const dataToCelldata: (data: CellMatrix | undefined) => CellWithRowAndCol[];
export declare const celldataToData: (celldata: CellWithRowAndCol[], rowCount?: number, colCount?: number) => CellMatrix | null;
export declare function getSheet(ctx: Context, options?: CommonOptions): Sheet;
export declare function getSheetWithLatestCelldata(ctx: Context, options?: CommonOptions): {
    celldata: CellWithRowAndCol[];
    name: string;
    config?: import("../types").SheetConfig;
    order?: number;
    color?: string;
    data?: CellMatrix;
    id?: string;
    images?: import("../types").Image[];
    zoomRatio?: number;
    column?: number;
    row?: number;
    addRows?: number;
    status?: number;
    hide?: number;
    luckysheet_select_save?: import("../types").Selection[];
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
