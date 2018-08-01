import {browserHistory} from 'react-router';
import {observable, computed, action} from 'mobx';
import {isEmpty} from 'lodash';
import moment from 'moment';

import ColumnNames from '@Constants/ColumnNames';

import FuelOverTime from '@Stores/FuelOverTime';
import LatencyOverTime from '@Stores/LatencyOverTime';

// this store reads, parses and validates a timeline CSV
class AppState {
  errors: Array = [];

  allESNsOption = {value: 'all', label: 'all'};

  fileContents = undefined;

  @observable fileValueRows = [];

  @observable isLoading = false;

  @computed get esnFilteredValueRows() {
    if(this.selectedESN.value === undefined) {
      return [];
    } else if(this.selectedESN.value === 'all') {
      return this.fileValueRows;
    } else {
      return this.fileValueRows.filter((item) => {
        return item[this.columnsMap[ColumnNames.ESN]] === this.selectedESN.value;
      });
    }
  };

  // this maps the named columns to the specific indexes in the currently imported csv file
  columnsMap = {};

  // ESN filter selection
  @observable selectedESN = this.allESNsOption;

  // ESN options exposed to user
  @observable filterESNs = [this.allESNsOption];

  // can only chart one ESN at a time
  @observable allSelected = true;

  @action onESNFilterChange = (selectedOption) => {
    this.selectedESN = selectedOption;

    this.allSelected = this.selectedESN.value === this.allESNsOption.value;

    this.updateAnalysis();
  };

  logError(message, level, exception = {}) {
    if(this.errors.length > 999) {
      this.errors.splice(-1, 1);
    }
    this.errors.push({
      message: message,
      level: level,
      exception: exception,
      when: moment(),
      stack:  (new Error()).stack
    });

    window.console.log(message);
  };

  constructor() {
    // catch all global/uncaught errors
    window.addEventListener('error', (e: object) => {
      this.logError('Global Error', 'error', e);
    });

     // analysis module stores
    this.latencyOverTime = new LatencyOverTime(this);
    this.fuelOverTime = new FuelOverTime(this);
  }

  setFileContents(contents) {
    this.fileContents = contents;
  }

  parseCSV() {
    this.createColumnMap();
    this.parseRowValues();
  }

  // this creates a map of column name to index so we can access col data uniformly independent of the order the cols are in the import file
  createColumnMap() {
    // reset any existing map
    this.columnsMap = {};

    // get the first line of the file, todo: support unix line endings
    let firstLine = this.fileContents.split('\n')[0];
    let columnHeadings = firstLine.split(',');

    // loop through the headings and assert each is valid and create a map of their locations
    for(let i = 0; i < columnHeadings.length - 1; i++) {
      let heading = columnHeadings[i].replace(/\s/g, '');
      if(isEmpty(heading)) {
        // empty string, do nothing
      } else if(ColumnNames[heading] !== undefined) {
        // got a valid heading, map it to i
        this.columnsMap[heading] = i;
      } else {
        // invalid heading
        this.logError('Found heading ' + heading + ' which is unknown.', 0);
      }
    }
  }

  parseRowValues() {
    this.fileValueRows = [];

    let rows = this.fileContents.split('\n');
    // using an object to deduplicate ESNs found
    let foundESNs = {};

    // 1 1 to skip heading row
    for(let i = 1; i < rows.length - 1; i++) {
      let values = rows[i].split(',');

      //cleans spaces between commas and values
      for(let k = 0; k < values.length - 1; k++) {
        values[k] = values[k].trim();
      }

      this.fileValueRows.push(values);

      // if we have a ESN value add it to our ESN filter list, -1 because we i is already +1 because we skiped the col heading row
      let esn = this.getFilteredColRowValue(ColumnNames.ESN, i-1, false);
      // found a esn with all '\u0000' so filtering those out as well as empty strings
      if(!isEmpty(esn) && esn[0] !== '\u0000') {
        // using the key to denote the ESN exists, using the value to track the count of the ESN occurrence
        if(!foundESNs[esn]) {
          foundESNs[esn] = 1;
        } else {
          foundESNs[esn] = foundESNs[esn]+1;
        }
      }
    }

    this.filterESNs = [this.allESNsOption];
    this.selectedESN = this.allESNsOption;
    Object.keys(foundESNs).forEach(function(key, value) {
      let count = foundESNs[key];
      this.filterESNs.push({value: key, label: key+' ('+count+')'});
    }, this);

    console.log((rows.length-1)+ ' rows found.');
    console.log(this.filterESNs.length+ ' ESNs found.');

    this.updateAnalysis();
  }

  updateAnalysis() {
    // call analyze on each sub-store, only ones with active views will actually compute
    this.latencyOverTime.analyze();
    this.fuelOverTime.analyze();
  }

  getFilteredColRowValue(namedColumn, rowNum, useEsnFiltered = true) {
    let colPosition = this.columnsMap[namedColumn];

    // get row, assert it exists
    let row = useEsnFiltered ? this.esnFilteredValueRows[rowNum] : this.fileValueRows[rowNum];
    if(row === undefined) {
      this.logError('No such row at position: '+row, 0);
      return;
    }

    return row[colPosition];
  }

  getFilteredRow(rowNum, useEsnFiltered = true) {
    // get row, assert it exists
    let row = useEsnFiltered ? this.esnFilteredValueRows[rowNum] : this.fileValueRows[rowNum];
    if(row === undefined) {
      this.logError('No such row at position: '+row, 0);
      return;
    }

    return row;
  }
}

export default new AppState();
