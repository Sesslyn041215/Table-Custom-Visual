import powerbi from "powerbi-visuals-api";
import "../style/visual.css";
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import FormattingModel = powerbi.visuals.FormattingModel;
export declare class Visual {
    private target;
    private formattingSettings;
    private formattingSettingsService;
    private tableVisual;
    private host;
    private rows;
    private columns;
    private title;
    private subtitle;
    private rowLevels;
    private selectionManager;
    constructor(options: VisualConstructorOptions);
    update(options: VisualUpdateOptions): void;
    getFormattingModel(): FormattingModel;
    private render;
    private handleSettingsChange;
    destroy(): void;
}
