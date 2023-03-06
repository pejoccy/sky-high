import _ from 'lodash';

export const countUniqueObjectReducer = (data, key) => {
  const set = data.reduce((acc, obj) => {
    acc.add(obj[key]);
    return acc;
  }, new Set());
  return set.size
}

export const sumTotalObjectReducer = (key) => (acc, obj) => {
  acc += Number(obj[key]);
  return acc;
}

export const combinatorDataTransformer = ({
  data,
  x,
  y,
  sample,
  formatter = Number,
}) => {
  return Object.entries(_.groupBy(data, sample))
    .map(([name, val]) => {
      const cData = val.map((obj) => ([
        formatter(obj[x]),
        formatter(obj[y])
      ]));

      return { name, data: cData };
    });
}

export const tableDataTransformer = ({
  data,
  page = 1,
  pageSize = 10,
}) => {
  page = page < 1 ? 1 : page;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  return _.slice(data, start, end);
}

export const compositeDataTransformer = ({
  data,
  xOrKeyFn,
  keyLblFn,
  y,
  value,
  formatter = Number,
}) => {
  const xAxis = Object.entries(_.groupBy(data, xOrKeyFn)).reduce((acc, [key]) => {
    acc[key] = { key, label: keyLblFn(key), value: 0 };
    return acc;
  }, {});
  const categories = _.map(_.sortBy(xAxis, 'key'), 'label');

  const collections = Object.entries(_.groupBy(data, y)).map(([name, val]) => {
    const xAxisData = Object.entries(_.groupBy(val, xOrKeyFn))
      .reduce((acc, [key, mVal]) => {
        acc[key] = { key, label: acc[key].label };
        acc[key].value = formatter(mVal.reduce(
          sumTotalObjectReducer(value),
          0
        ));
        return acc;
      }, { ...xAxis });

    return { name, data: _.map(_.sortBy(xAxisData, 'key'), 'value') };
  });

  return { collections, categories };
}

export const simpleDataTransformer = ({
  data,
  xOrKeyFn,
  keyLblFn,
  value,
  formatter = Number,
}) => {
  // 
  const xAxis = Object.entries(_.groupBy(data, xOrKeyFn))
    .reduce((acc, [key, val]) => {
      acc[key] = {
        key,
        label: !!keyLblFn && keyLblFn(key) || key,
        value: formatter(val.reduce(sumTotalObjectReducer(value), 0)),
      };
      return acc;
    }, {});

  return {
    data: _.map(xAxis, 'value'),
    labels: _.map(xAxis, 'label'),
  };
}
