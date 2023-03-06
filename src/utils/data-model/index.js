import _ from "lodash";
import { matchSorter } from 'match-sorter';
import sortByFn from 'sort-by';

export class DataModel {
  data = [];
  
  constructor(data) {
    this.data = data || [];
  }

  getData(extractFn) {
    if (typeof extractFn === 'function') {
      return this.data.map(extractFn);
    }
    return this.data;
  }

  filter(term, { keys } = {}) {
    this.data = matchSorter(this.data, term, { ...(keys && { keys }) });
    return this;
  }

  sort(sortBy = []) {
    this.data = this.data.sort(sortByFn(...sortBy));
    return this;
  }
}