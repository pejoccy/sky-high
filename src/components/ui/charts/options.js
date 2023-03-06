export const getScatterChartOptions = (labels, options) => ({
  labels,
  chart: {
    toolbar: {
      show: false
    }
  },
  dataLabels: {
    enabled: false,
  },
  xaxis: {
    tickAmount: 10,
    labels: {
      formatter: function(val) {
        return parseFloat(val).toFixed(1)
      },
    },
  },
  yaxis: {
    labels: {
      formatter: function(val) {
        return parseFloat(val).toFixed(2)
      },
    },
  },
  zoom: {
    enabled: true,
    type: 'xy',
  },
});

export const getPieChartOptions = (labels, options) => ({
  labels,
  dataLabels: {
    enabled: true,
  },
});

export const getBarChartOptions = (categories, options) => ({
  chart: {
    toolbar: {
      show: false
    }
  },
  dataLabels: {
    enabled: false,
  },
  plotOptions: {
    bar: {
      columnWidth: "50%"
    }
  },
  stroke: {
    width: [4, 0, 0]
  },
  xaxis: {
    categories
  },
  markers: {
    size: 6,
    strokeWidth: 3,
    fillOpacity: 0,
    strokeOpacity: 0,
    hover: {
      size: 8
    }
  },
  yaxis: {
    tickAmount: 5,
    labels: {
      formatter: function(val) {
        return parseFloat(val).toFixed(2)
      }
    }
  },
  legend: {
    position: 'top',
  },
  responsive: [
    {
      breakpoint: 768,
      options: {
        plotOptions: {
          bar: {
            borderRadius: 0,
          },
        },
      },
    },
  ],
});

export const getLineChartOptions = (categories, { colors } = {}) => ({
  chart: {
    toolbar: {
      show: false,
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: "smooth",
  },
  xaxis: {
    type: "datetime",
    categories,
    labels: {
      style: {
        colors: "#fff",
        fontSize: "12px",
      },
    },
  },
  yaxis: {
    labels: {
      style: {
        colors: "#fff",
        fontSize: "12px",
      },
    },
  },
  legend: {
    position: 'top',
    labels: { colors: '#fff' },
  },
  grid: {
    strokeDashArray: 5,
  },
});
