"use strict";

import powerbi from "powerbi-visuals-api";
import { FormattingSettingsService } from "powerbi-visuals-utils-formattingmodel";
import * as React from "react";
import * as ReactDOM from "react-dom";
import "../style/visual.less";
import {
  VisualFormattingSettingsModel,
  defaultFormattingSettings,
} from "./settings";
import TableVisual, { TableVisualProps } from "./table";
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import IVisualHost = powerbi.extensibility.visual.IVisualHost;
import FormattingModel = powerbi.visuals.FormattingModel;
import ISelectionManager = powerbi.extensibility.ISelectionManager;

interface VisualProps {
  element: HTMLElement;
  host: IVisualHost;
}

export class Visual {
  private target: HTMLElement;
  private formattingSettings: VisualFormattingSettingsModel;
  private formattingSettingsService: FormattingSettingsService;
  private tableVisual: React.FC<TableVisualProps> = TableVisual;
  private host: IVisualHost;
  private rows: any[];
  private columns: any[];
  private title: string;
  private subtitle: string;
  private rowLevels: any;
  private selectionManager: ISelectionManager;

  constructor(options: VisualConstructorOptions) {
    console.log("Visual constructor", options);
    this.target = options.element;
    this.formattingSettingsService = new FormattingSettingsService();
    this.host = options.host;
    this.formattingSettings = { ...defaultFormattingSettings };
    this.selectionManager = this.host.createSelectionManager();
  }

  public update(options: VisualUpdateOptions) {
    const singleDataView = options.dataViews[0];
    const newFormattingSettings =
      this.formattingSettingsService.populateFormattingSettingsModel(
        VisualFormattingSettingsModel,
        options.dataViews[0]
      ) || defaultFormattingSettings;

    this.formattingSettings = {
      ...this.formattingSettings,
      ...newFormattingSettings,
    };

    this.rows = singleDataView?.matrix?.rows?.root?.children || [];
    this.columns = singleDataView?.matrix?.columns?.root?.children || [];
    this.rowLevels = singleDataView?.matrix?.rows?.levels;
    this.title = "Table";
    this.subtitle = "Matrix";

    if (
      singleDataView.metadata.objects &&
      singleDataView.metadata.objects.demoSection
    ) {
      if (singleDataView.metadata.objects.demoSection.title) {
        this.title =
          singleDataView.metadata.objects.demoSection.title.toString();
      }
      if (singleDataView.metadata.objects.demoSection.subTitle) {
        this.subtitle =
          singleDataView.metadata.objects.demoSection.subTitle.toString();
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
        row={this.rows}
        col={this.columns}
        title={this.title}
        subtitle={this.subtitle}
        formattingSettings={this.formattingSettings}
        onSettingsChange={this.handleSettingsChange}
        selectionManager={this.selectionManager}
        host={this.host}
        rowLevels={this.rowLevels}
      />,
      this.target
    );
  }

  private handleSettingsChange = (
    newSettings: Partial<VisualFormattingSettingsModel>
  ) => {
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
