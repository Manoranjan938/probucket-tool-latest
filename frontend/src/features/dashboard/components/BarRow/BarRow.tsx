import React from "react";
import type { ReactNode } from "react";
import { Tooltip } from "@mui/material";

import * as dashboard from "features/dashboard/styles/dashboardClasses";

interface BarRowProps {
  label: ReactNode;
  /** The number shown at the end of the row */
  value: ReactNode;
  /** Width of the bar, 0-100 */
  percent: number;
  tooltip: string;
}

// A labelled row with a thin bar under it, for lists that compare a few numbers
const BarRow = ({ label, value, percent, tooltip }: BarRowProps) => {
  return (
    <Tooltip title={tooltip} placement="top" describeChild>
      <li className={dashboard.barRow}>
        <div className={dashboard.barHeader}>
          <span className={dashboard.barLabel}>{label}</span>
          <span className={dashboard.barValue}>{value}</span>
        </div>
        <div className={dashboard.barTrack}>
          <span className={dashboard.barFill} style={{ width: `${percent}%` }} />
        </div>
      </li>
    </Tooltip>
  );
};

export default BarRow;
