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
  const handleToggleBold = () => {
    onSettingsChange({ ...formattingSettings, bold: !formattingSettings.bold });
  };

  const handleToggleItalic = () => {
    onSettingsChange({
      ...formattingSettings,
      italic: !formattingSettings.italic,
    });
  };

  const handleToggleUnderline = () => {
    onSettingsChange({
      ...formattingSettings,
      underline: !formattingSettings.underline,
    });
  };

  const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newTheme = event.target.value as "light" | "dark";
    onSettingsChange({ ...formattingSettings, theme: newTheme });
  };

  const handleScalingChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newScaling = event.target.value as
      | "none"
      | "thousands"
      | "millions"
      | "auto"
      | "billions"
      | "trillions";
    onSettingsChange({ ...formattingSettings, scaling: newScaling });
  };

  const formatNumber = (
    value: number,
    scaling: VisualFormattingSettingsModel["scaling"]
  ): string => {
    if (!isNaN(value) && isFinite(value)) {
      switch (scaling) {
        case "trillions":
          return (value / 1e12).toFixed(2) + "T";
        case "billions":
          return (value / 1e9).toFixed(2) + "B";
        case "millions":
          return (value / 1e6).toFixed(2) + "M";
        case "thousands":
          return (value / 1e3).toFixed(2) + "K";
        case "auto":
          // Automatically determine based on value size
          if (value >= 1e12) return (value / 1e12).toFixed(2) + "T";
          if (value >= 1e9) return (value / 1e9).toFixed(2) + "B";
          if (value >= 1e6) return (value / 1e6).toFixed(2) + "M";
          if (value >= 1e3) return (value / 1e3).toFixed(2) + "K";
          return value.toFixed(2); // Default case
        case "none":
        default:
          return value.toFixed(2);
      }
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
        <h2>{JSON.stringify(formattingSettings, null, 2)}</h2>
          <div className="formatting-controls">
            <div className="label">
              <div>Formatting</div>
              <div>
                <button
                  className={`formatting-button ${
                    formattingSettings.bold ? "active" : ""
                  }`}
                  onClick={handleToggleBold}
                >
                  <FontAwesomeIcon icon={faBold} />
                </button>
                <button
                  className={`formatting-button ${
                    formattingSettings.italic ? "active" : ""
                  }`}
                  onClick={handleToggleItalic}
                >
                  <FontAwesomeIcon icon={faItalic} />
                </button>
                <button
                  className={`formatting-button ${
                    formattingSettings.underline ? "active" : ""
                  }`}
                  onClick={handleToggleUnderline}
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
                  onChange={handleScalingChange}
                >
                  <option value="none">None</option>
                  <option value="thousands">Thousands</option>
                  <option value="millions">Millions</option>
                  <option value="auto">Auto</option>
                  <option value="billions">Billions</option>
                  <option value="trillions">Trillions</option>
                </select>
              </div>
            </div>
            <div className="label">
              <div>Theme</div>
              <div>
                <select
                  value={formattingSettings.theme}
                  onChange={handleThemeChange}
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
