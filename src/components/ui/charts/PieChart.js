import { memo } from 'react';
import Chart from "react-apexcharts";

const PieChart = (props) => {
  return (
      <Chart
        series={props.chartData}
        options={props.chartOptions}
        type="pie"
        width="100%"
        height="100%"
      />
  );
}

export default memo(PieChart);
