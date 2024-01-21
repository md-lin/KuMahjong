
import {Options, Query, ANDFilter, ORFilter, LTFilter, GTFilter, EQFilter, ISFilter, NOTFilter} from "./QueryInterface";
import {InsightError, InsightResult, ResultTooLargeError} from "../IInsightFacade";
import {Validator} from "./Validator";
import {Section} from "../DatasetProcessorClasses/Section";
import {CourseInterface, DatasetInterface, Result, SectionInterface} from "./DatasetInterface";
import {Aggregation} from "./Aggregation";
import {StringUtil} from "./StringUtil";

export default class QueryEngine {
	private validator: Validator;
	private aggregation: Aggregation;
	private data: InsightResult[];
	constructor() {
		this.validator = new Validator();
		this.aggregation = new Aggregation();
		this.data = [];
	}

	public getValidator() {
		return this.validator;
	}

	public performQuery(query: Query, data: InsightResult[]): InsightResult[] {
		let results: InsightResult[] = [];
		this.data = data;

		if (this.validator.isANDFilterType(query.WHERE)) {
			results = this.AndFilter(query.WHERE, this.data);
		} else if (this.validator.isORFilterType(query.WHERE)) {
			results = this.OrFilter(query.WHERE, this.data);
		}  else if (this.validator.isLTFilterType(query.WHERE)) {
			results = this.LTFilter(query.WHERE, this.data);
		}  else if (this.validator.isGTFilterType(query.WHERE)) {
			results = this.GTFilter(query.WHERE, this.data);
		} else if (this.validator.isEQFilterType(query.WHERE)) {
			results = this.EQFilter(query.WHERE, this.data);
		} else if (this.validator.isISFilterType(query.WHERE)) {
			results = this.IsFilter(query.WHERE, this.data);
		} else if (this.validator.isNOTFilterType(query.WHERE)) {
			results = this.NotFilter(query.WHERE, this.data);
		} else {
			results = this.data;
		}

		// TODO: remove this thing because it's for debugging
		let returnVal = results;

		if (query.TRANSFORMATIONS !== undefined) {
			returnVal = this.aggregation.Transformations(returnVal, query.TRANSFORMATIONS);
		}

		// TODO NOTE: can't filter first because you will remove columns necessary for the grouping
		// see if you can filter WHILE aggregating because that will be faster
		if (query.TRANSFORMATIONS === undefined) {
			returnVal = this.filterColumns(query.OPTIONS.COLUMNS, returnVal);
		}

		if (returnVal.length > 5000) {
			throw new ResultTooLargeError("TOO LONG");
		}

		returnVal.sort(this.compare);

		return returnVal;
	}

	public filterColumns(columns: string[], result: InsightResult[]) {
		// return a section with only the fields that we want
		let results: InsightResult[] = [];
		for (const oldResult of result) {
			let newResult = new Result();
			for (const key of columns) {
				newResult[key] = oldResult[StringUtil.extractFieldUnderscore(key)];
			}
			results.push(newResult);
		}
		return results;
	}

	public AndFilter(input: ANDFilter, data: InsightResult[]): InsightResult[] {
		let resultSoFar: InsightResult[] = data;

		for (const filter of input.AND) {
			if (this.validator.isANDFilterType(filter)) {
				resultSoFar = this.AndFilter(filter, resultSoFar);
			} else if (this.validator.isORFilterType(filter)) {
				resultSoFar = this.OrFilter(filter, resultSoFar);
			}  else if (this.validator.isLTFilterType(filter)) {
				resultSoFar = this.LTFilter(filter, resultSoFar);
			}  else if (this.validator.isGTFilterType(filter)) {
				resultSoFar = this.GTFilter(filter, resultSoFar);
			} else if (this.validator.isEQFilterType(filter)) {
				resultSoFar = this.EQFilter(filter, resultSoFar);
			} else if (this.validator.isISFilterType(filter)) {
				resultSoFar = this.IsFilter(filter, resultSoFar);
			} else if (this.validator.isNOTFilterType(filter)) {
				resultSoFar = this.NotFilter(filter, resultSoFar);
			}
		}
		return resultSoFar;
	}

	public OrFilter(input: ORFilter, data: InsightResult[]): InsightResult[] {
		let result: InsightResult[] = [];
		// for each filter in the array, call its respective helper filter function
		for (const filter of input.OR) {
			if (this.validator.isANDFilterType(filter)) {
				result = result.concat(this.AndFilter(filter, data));
			} else if (this.validator.isORFilterType(filter)) {
				result = result.concat(this.OrFilter(filter, data));
			}  else if (this.validator.isLTFilterType(filter)) {
				result = result.concat(this.LTFilter(filter, data));
			}  else if (this.validator.isGTFilterType(filter)) {
				result = result.concat(this.GTFilter(filter, data));
			} else if (this.validator.isEQFilterType(filter)) {
				result = result.concat(this.EQFilter(filter, data));
			} else if (this.validator.isISFilterType(filter)) {
				result = result.concat(this.IsFilter(filter, data));
			} else if (this.validator.isNOTFilterType(filter)) {
				result = result.concat(this.NotFilter(filter, data));
			}
		}
		return result;
	}

	public NotFilter(input: NOTFilter, data: InsightResult[]): InsightResult[] {
		let notResults: InsightResult[] = data;
		let results: InsightResult[] = [];
		if (this.validator.isANDFilterType(input.NOT)) {
			let temp: InsightResult[] = this.AndFilter(input.NOT, notResults);
			results = notResults.filter((value) => {
				return !temp.includes(value);
			});
		} else if (this.validator.isORFilterType(input.NOT)) {
			let temp: InsightResult[] = this.OrFilter(input.NOT, notResults);
			results = notResults.filter((value) => {
				return !temp.includes(value);
			});
		}  else if (this.validator.isLTFilterType(input.NOT)) {
			let temp: InsightResult[] = this.LTFilter(input.NOT, notResults);
			results = notResults.filter((value) => {
				return !temp.includes(value);
			});
		}  else if (this.validator.isGTFilterType(input.NOT)) {
			let temp: InsightResult[] = this.GTFilter(input.NOT, notResults);
			results = notResults.filter((value) => {
				return !temp.includes(value);
			});
		} else if (this.validator.isEQFilterType(input.NOT)) {
			let temp: InsightResult[] = this.EQFilter(input.NOT, notResults);
			results = notResults.filter((value) => {
				return !temp.includes(value);
			});
		} else if (this.validator.isISFilterType(input.NOT)) {
			let temp: InsightResult[] = this.IsFilter(input.NOT, notResults);
			results = notResults.filter((value) => {
				return !temp.includes(value);
			});
		} else if (this.validator.isNOTFilterType(input.NOT)) {
			let temp: InsightResult[] = this.NotFilter(input.NOT, notResults);
			results = notResults.filter((value) => {
				return !temp.includes(value);
			});
		}
		return results;
	}

	public LTFilter(input: LTFilter, data: InsightResult[]): InsightResult[] {
		let results: InsightResult[] = [];
		for (const mKey of Object.keys(input.LT)) {
			for (const tuple of data) {
				if (tuple[StringUtil.extractFieldUnderscore(mKey)] < input.LT[mKey]) {
					results.push(tuple);
				}
			}
		}
		return results;
	}

	public GTFilter(input: GTFilter, data: InsightResult[]): InsightResult[] {
		let results: InsightResult[] = [];
		for (const mKey of Object.keys(input.GT)) {
			for (const tuple of data) {
				if (tuple[StringUtil.extractFieldUnderscore(mKey)] > input.GT[mKey]) {
					results.push(tuple);
				}
			}
		}
		return results;
	}

	public EQFilter(input: EQFilter, data: InsightResult[]): InsightResult[] {
		let results: InsightResult[] = [];
		for (const mKey of Object.keys(input.EQ)) {
			for (const tuple of data) {
				if (tuple[StringUtil.extractFieldUnderscore(mKey)] === input.EQ[mKey]) {
					results.push(tuple);
				}
			}
		}
		return results;
	}

	public IsFilter(input: ISFilter, data: InsightResult[]): InsightResult[] {
		let results: InsightResult[] = [], key = Object.keys(input.IS)[0],
			filter = input.IS[key];

		const underscoreKey = StringUtil.extractFieldUnderscore(key);

		if (filter.startsWith("*")) {
			if (filter.endsWith("*")) {
				// case: starts and ends with *
				filter = filter.slice(1, filter.length - 1);
				for (const result of data) {
					if ((result[underscoreKey] as string).includes(filter)) {
						results.push(result);
					}
				}
			} else {
				// case: starts with * and does not end with *
				filter = filter.slice(1, filter.length);
				for (const result of data) {
					if ((result[underscoreKey] as string).endsWith(filter)) {
						results.push(result);
					}
				}
			}
		} else if (filter.endsWith("*")) {
			// case: does not start with a * but ends with *
			filter = filter.slice(0, filter.length - 1);
			for (const result of data) {
				if ((result[underscoreKey] as string).startsWith(filter)) {
					results.push(result);
				}
			}
		} else {
			// case: has no wildcards
			for (const result of data) {
				if (result[underscoreKey] === filter) {
					results.push(result);
				}
			}
		}
		return results;
	}

	// TODO: working on this
	public compare(a: InsightResult, b: InsightResult): number {
		// if ( a.last_nom < b.last_nom ){
		return -1;
		// }
		// if ( a.last_nom > b.last_nom ){
		// 	return 1;
		// }
		// return 0;
	}


}
