"use strict";

import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";

// Alias the formatting settings for clarity
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

class DemoSection extends FormattingSettingsCard {
  title = new formattingSettings.TextInput({
    name: "title",
    displayName: "Title",
    value: "Title",
    placeholder: "Enter title",
  });

  subTitle = new formattingSettings.TextInput({
    name: "subTitle",
    displayName: "Sub Title",
    value: "Table Sub Title",
    placeholder: "Enter sub title",
  });

  name: string = "demoSection";
  displayName?: string = "Demo Section";
  slices: Array<FormattingSettingsSlice> = [this.title, this.subTitle];
}

/**
 * Default formatting settings
 */
export const defaultFormattingSettings: VisualFormattingSettingsModel = {
  bold: false,
  italic: false,
  underline: false,
  scaling: 'none',
  theme: 'light',
  demoSec: new DemoSection(),
  cards: []
};

/**
 * Visual formatting settings model class
 */
export class VisualFormattingSettingsModel extends FormattingSettingsModel {
  demoSec = new DemoSection(); // Demo Section Card

  cards: Array<FormattingSettingsCard> = [
    this.demoSec,
    // Add more cards as needed
  ];
}

