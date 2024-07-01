"use strict";

import powerbi from "powerbi-visuals-api";
import { FormattingSettingsService } from "powerbi-visuals-utils-formattingmodel";
import * as React from "react";
import * as ReactDOM from "react-dom";
import '../style/visual.css';
import { VisualFormattingSettingsModel, defaultFormattingSettings } from "./settings";
import TableVisual from "./table";
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import IVisualHost = powerbi.extensibility.visual.IVisualHost;
import FormattingModel = powerbi.visuals.FormattingModel;

interface VisualProps {
  element: HTMLElement;
  host: IVisualHost;
}

export class Visual {
  private target: HTMLElement;
  private formattingSettings: VisualFormattingSettingsModel;
  private formattingSettingsService: FormattingSettingsService;
  private tableVisual: React.FC<{
    row: any[];
    col: any[];
    title: string;
    subtitle: string;
    formattingSettings: VisualFormattingSettingsModel;
    onSettingsChange: (settings: VisualFormattingSettingsModel) => void;
  }> = TableVisual;
  private host: IVisualHost;
  private rowData: any[];
  private columnData: any[];
  private title: string;
  private subtitle: string;

  constructor(options: VisualConstructorOptions) {
    console.log("Visual constructor", options);
    this.target = options.element;
    this.formattingSettingsService = new FormattingSettingsService();
    this.host = options.host;
    this.formattingSettings = { ...defaultFormattingSettings }; 
  }
  
  public update(options: VisualUpdateOptions) {
    const dataViews = options.dataViews;
    const newFormattingSettings =
      this.formattingSettingsService.populateFormattingSettingsModel(
        VisualFormattingSettingsModel,
        options.dataViews[0]
      ) || defaultFormattingSettings;
 
    this.formattingSettings = {
      ...this.formattingSettings, 
      ...newFormattingSettings 
    };
    this.columnData = dataViews[0].table.columns.map((item) => ({
      field: item.displayName,
    }));

    this.rowData = dataViews[0].table.rows.map((item) =>
      item.reduce((acc, itemval, index) => {
        acc[this.columnData[index].field] = itemval;
        return acc;
      }, {})
    );

    this.title = "Table";
    this.subtitle = "Table Sub Title";

    if (
      dataViews[0].metadata.objects &&
      dataViews[0].metadata.objects.demoSection
    ) {
      if (dataViews[0].metadata.objects.demoSection.title) {
        this.title = dataViews[0].metadata.objects.demoSection.title.toString();
      }
      if (dataViews[0].metadata.objects.demoSection.subTitle) {
        this.subtitle =
          dataViews[0].metadata.objects.demoSection.subTitle.toString();
      }
    }

    this.render();
  }

  public getFormattingModel(): FormattingModel {
    return this.formattingSettingsService.buildFormattingModel(
      this.formattingSettings
    );
  }

  private render(): void {
    ReactDOM.render(
      <this.tableVisual
        row={this.rowData}
        col={this.columnData}
        title={this.title}
        subtitle={this.subtitle}
        formattingSettings={this.formattingSettings}
        onSettingsChange={this.handleSettingsChange}
      />,
      this.target
    );
  }

  private handleSettingsChange = (newSettings: Partial<VisualFormattingSettingsModel>) => {
    this.formattingSettings = { ...this.formattingSettings, ...newSettings };
  
    this.host.persistProperties({
      merge: [
        {
          objectName: "visualSettings",
          selector: null,
          properties: {
            bold: this.formattingSettings.bold,
            italic: this.formattingSettings.italic,
            underline: this.formattingSettings.underline,
            scaling: this.formattingSettings.scaling,
            theme: this.formattingSettings.theme,
          },
        },
      ],
    });
  
    this.render();
  };
  
  public destroy() {
    ReactDOM.unmountComponentAtNode(this.target);
  }
}
