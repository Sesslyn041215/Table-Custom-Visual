import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";
import FormattingSettingsCard = formattingSettings.SimpleCard;
import FormattingSettingsSlice = formattingSettings.Slice;
import FormattingSettingsModel = formattingSettings.Model;
/**
 * Formatting settings interface
 */
export interface VisualFormattingSettingsModel {
    bold: boolean;
    italic: boolean;
    underline: boolean;
    scaling: string;
    theme: string;
}
declare class DemoSection extends FormattingSettingsCard {
    title: formattingSettings.TextInput;
    subTitle: formattingSettings.TextInput;
    name: string;
    displayName?: string;
    slices: Array<FormattingSettingsSlice>;
}
/**
 * Default formatting settings
 */
export declare const defaultFormattingSettings: VisualFormattingSettingsModel;
/**
 * Visual formatting settings model class
 */
export declare class VisualFormattingSettingsModel extends FormattingSettingsModel {
    demoSec: DemoSection;
    cards: Array<FormattingSettingsCard>;
}
export {};
