import * as React from "react";
import { VisualFormattingSettingsModel } from "./settings";
interface TableVisualProps {
    row: any[];
    col: any[];
    title?: string;
    subtitle?: string;
    formattingSettings: VisualFormattingSettingsModel;
    onSettingsChange: (settings: VisualFormattingSettingsModel) => void;
}
declare const TableVisual: React.FC<TableVisualProps>;
export default TableVisual;
