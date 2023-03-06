import { memo } from 'react';
import Chart from "react-apexcharts";

const ScatterChart = (props) => {
  return (
      <Chart
        series={props.chartData}
        options={props.chartOptions}
        type="scatter"
        width="100%"
        height="100%"
      />
  );
}

export default memo(ScatterChart);
