import { memo } from 'react';
import Chart from "react-apexcharts";

const BarChart = (props) => {
  return (
      <Chart
        options={props.chartOptions}
        series={props.chartData}
        type="bar"
        stacked={props.stacked}
        width="100%"
        height="100%"
      />
  );
}

export default memo(BarChart);
