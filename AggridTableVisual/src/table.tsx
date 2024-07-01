import {
  faBold,
  faItalic,
  faUnderline,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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

const TableVisual: React.FC<TableVisualProps> = ({
  row,
  col,
  title = "Default Title",
  subtitle = "Default Subtitle",
  formattingSettings,
  onSettingsChange,
}) => {
  const handleToggle = (property: keyof VisualFormattingSettingsModel) => {
    const newSettings: VisualFormattingSettingsModel = {
      bold: false,
      italic: false,
      underline: false,
      ...formattingSettings, 
    };
 
    if (property) {
      switch (property) {
        case "bold":
          newSettings.italic = false;
          newSettings.underline = false;
          newSettings.bold = true;
          break;
        case "italic":
          newSettings.bold = false;
          newSettings.underline = false;
          newSettings.italic = true;
          break;
        case "underline":
          newSettings.bold = false;
          newSettings.italic = false;
          newSettings.underline = true;
          break;
        default:
          break;
      }
    }
    onSettingsChange(newSettings);
  };
  
  const handleThemeChange = (key: VisualFormattingSettingsModel["theme"]) => {
    onSettingsChange({ ...formattingSettings, theme: key });
  };

  const handleScalingChange = (
    key: VisualFormattingSettingsModel["scaling"]
  ) => {
    onSettingsChange({ ...formattingSettings, scaling: key });
  };

  const formatNumber = (
    value: number | string,
    scaling: VisualFormattingSettingsModel["scaling"]
  ): string => {
    const numericValue = typeof value === 'string' ? parseFloat(value.replace(/[^\d.-]/g, '')) : value;
  
    if (!isNaN(numericValue) && isFinite(numericValue)) {
      switch (scaling) {
        case "millions":
          return (numericValue / 1e6).toFixed(2);
        case "thousands":
          return (numericValue / 1e3).toFixed(2);
        case "none":
        default:
          return numericValue.toString();
      }
    } else {
      return ""; 
    }
  };
  
  return (
    <div
      className={`table-visual ${
        formattingSettings.theme === "dark" ? "dark-theme" : "light-theme"
      }`}
    >
      <div className="table-visual-header">
        <div className="left-section">
          <h2>Table</h2>
          <div className="formatting-controls">
            <div className="label">
              <div>Formatting</div>
              <div>
                <button
                  className={`formatting-button ${
                    formattingSettings.bold ? "active" : ""
                  }`}
                  onClick={() => handleToggle("bold")}
                >
                  <FontAwesomeIcon icon={faBold} />
                </button>
                <button
                  className={`formatting-button ${
                    formattingSettings.italic ? "active" : ""
                  }`}
                  onClick={() => handleToggle("italic")}
                >
                  <FontAwesomeIcon icon={faItalic} />
                </button>
                <button
                  className={`formatting-button ${
                    formattingSettings.underline ? "active" : ""
                  }`}
                  onClick={() => handleToggle("underline")}
                >
                  <FontAwesomeIcon icon={faUnderline} />
                </button>
              </div>
            </div>
            <div className="label">
              <div>Scaling</div>
              <div>
                <select
                  value={formattingSettings.scaling}
                  onChange={(e) =>
                    handleScalingChange(
                      e.target.value as VisualFormattingSettingsModel["scaling"]
                    )
                  }
                >
                  <option value="none">None</option>
                  <option value="thousands">Thousands</option>
                  <option value="millions">Millions</option>
                </select>
              </div>
            </div>
            <div className="label">
              <div>Theme</div>
              <div>
                <select
                  value={formattingSettings.theme}
                  onChange={(e) =>
                    handleThemeChange(
                      e.target.value as VisualFormattingSettingsModel["theme"]
                    )
                  }
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className="right-section">
          <h2>{title}</h2>
          <p>{subtitle}</p>

          <table className="table">
            <thead>
              <tr>
                {col.map((column: any, index: number) => (
                  <th key={index}>{column.field}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {row.map((dataItem: any, rowIndex: number) => (
                <tr key={rowIndex}>
                  {col.map((column: any, colIndex: number) => (
                    <td key={`${rowIndex}-${colIndex}`}>
                      <span
                        className={`formatted-cell ${
                          formattingSettings.bold ? "bold" : ""
                        } ${formattingSettings.italic ? "italic" : ""} ${
                          formattingSettings.underline ? "underline" : ""
                        }`}
                      >
                        {!isNaN(dataItem[column.field]) &&
                        isFinite(dataItem[column.field])
                          ? formatNumber(
                            dataItem[column.field],
                            formattingSettings.scaling
                          )
                          : dataItem[column.field]}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TableVisual;
