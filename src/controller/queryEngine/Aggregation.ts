import {InsightResult} from "../IInsightFacade";
import {
	ApplyRule,
	ApplyRuleAvg,
	ApplyRuleCount,
	ApplyRuleMax,
	ApplyRuleMin, ApplyRuleSum,
	ApplyToken, AvgToken, CountToken, MaxToken, MinToken, SumToken,
	Transformations
} from "./QueryInterface";
import {Result} from "./DatasetInterface";
import {AggregationValidator} from "./AggregationValidator";
import {StringUtil} from "./StringUtil";
import Decimal from "decimal.js";

export class Aggregation {
	private groupMap: Map<string, InsightResult[]>;
	private applyMap: Map<string, InsightResult>;

	constructor() {
		// each group will be mapped by their unique set
		this.groupMap = new Map<string, InsightResult[]>();
		this.applyMap = new Map<string, InsightResult>();
	}

	// grouping should occur after the where filtering
	// so we take a list of insight results which have been filtered, then group them into our map structure
	public MakeGroups(input: InsightResult[], keys: string[]) {
		// yuh
		for (const insightResult of input) {
			let currValues: string = "";
			for (const key of keys) {
				currValues = currValues + insightResult[StringUtil.extractFieldUnderscore(key)];
			}
			let temp = this.groupMap.get(currValues);

			if (temp === undefined) {
				let array: InsightResult[] = [];
				this.groupMap.set(currValues, array.concat(insightResult));
			} else {
				temp.push(insightResult);
			}
		}
	}

	// from https://www.30secondsofcode.org/js/s/match-object-properties/
	public matches(obj: InsightResult, source: InsightResult) {
		for (const key of Object.keys(source)) {
			if (obj[key] === undefined) {
				return false;
			} else if (obj[key] !== source[key]) {
				return false;
			}
		}
		return true;
	}

	// returns results grouped by their unique column set from the map
	public flattenGroups() {
		let results: InsightResult[] = [];

		for (const [key, value] of this.applyMap) {
			results = results.concat(value);
		}
		return results;
	}

	// each group should have a single result with the columns from filterColumns
	public flattenGroupsNoApplyKey(keys: string[]) {
		let results: InsightResult[] = [];

		for (const [key1, value] of this.groupMap) {
			let result = new Result();
			for (const key of keys) {
				result[key] = value[0][StringUtil.extractFieldUnderscore(key)];
			}
			if (!results.includes(result)) {
				results = results.concat(result);
			}
		}
		return results;
	}

	public Transformations(input: InsightResult[], query: Transformations) {
		if (query.APPLY.length === 0) {
			this.MakeGroups(input, query.GROUP);
			return this.flattenGroupsNoApplyKey(query.GROUP);
		} else {
			// for each applyKey, execute the operation
			this.MakeGroups(input, query.GROUP);
			this.prepareApplyMap(query.GROUP);
			for (const applyRule of query.APPLY) {
				// let applyKey: string = "";
				if (AggregationValidator.isApplyRuleCount(applyRule)) {
					this.ApplyCount(applyRule);
				} else if (AggregationValidator.isApplyRuleMax(applyRule)) {
					this.ApplyMax(applyRule);
				} else if (AggregationValidator.isApplyRuleMin(applyRule)) {
					this.ApplyMin(applyRule);
				} else if (AggregationValidator.isApplyRuleSum(applyRule)) {
					this.ApplySum(applyRule);
				} else {
					this.ApplyAvg(applyRule);
				}
			}

			// putting this in to make it compile but you need to set it up so you can do the applyKey
			return this.flattenGroups();
		}
	}

	// keys are the columns from the group
	// takes each entry from the groupMap and creates a corresponding insightResult in the applyMap with only the
	// columns from the grouping.
	// idea is to add applyKeys as you go.
	public prepareApplyMap(keys: string[]) {
		for (const [key1, value] of this.groupMap) {
			let result = new Result();
			for (const key of keys) {
				result[key] = value[0][StringUtil.extractFieldUnderscore(key)];
			}
			this.applyMap.set(key1, result);
		}
	}

	// apply max operation to each group, add to the applyMap
	public ApplyMax(query: ApplyRuleMax) {
		let applyKey: string = Object.keys(query)[0];
		let searchKey: string = StringUtil.extractFieldUnderscore(query[applyKey].MAX);
		for (const [key1, value] of this.groupMap) {
			let maxSoFar: number = 0;
			for (const thing of value) {
				for (const result of value) {
					if (result[searchKey] > maxSoFar) {
						maxSoFar = result[searchKey] as number;
					}
				}
			}
			let temp = this.applyMap.get(key1);
			if (temp !== undefined) {
				temp[applyKey] = Number(maxSoFar);
			}
		}
	}

	public ApplyMin(query: ApplyRuleMin) {
		let applyKey: string = Object.keys(query)[0];
		let searchKey: string = StringUtil.extractFieldUnderscore(query[applyKey].MIN);
		for (const [key1, value] of this.groupMap) {
			let minSoFar: number = Number.MAX_SAFE_INTEGER;
			for (const thing of value) {
				for (const result of value) {
					if (result[searchKey] < minSoFar) {
						minSoFar = result[searchKey] as number;
					}
				}
			}
			let temp = this.applyMap.get(key1);
			if (temp !== undefined) {
				temp[applyKey] = Number(minSoFar);
			}
		}
	}

	// count usages of the particular field, add to the applyMap
	public ApplyCount(query: ApplyRuleCount) {
		let applyKey: string = Object.keys(query)[0];
		let searchKey: string = StringUtil.extractFieldUnderscore(query[applyKey].COUNT);
        // each key value pair is a group
		for (const [key1, value] of this.groupMap) {
			let count: number = 0;
			let curr: Array<number | string> = new Array<number | string>();
			for (const result of value) {
				if (!curr.includes(result[searchKey])) {
					curr.push(result[searchKey]);
					count++;
				}
			}

			let temp = this.applyMap.get(key1);
			if (temp !== undefined) {
				temp[applyKey] = count;
			}
		}

	}

	public ApplySum(query: ApplyRuleSum) {
		let applyKey: string = Object.keys(query)[0];
		let searchKey: string = StringUtil.extractFieldUnderscore(query[applyKey].SUM);
		for (const [key1, value] of this.groupMap) {
			let sum: number = 0;
			for (const result of value) {
				sum += result[searchKey] as number;
			}
			let temp = this.applyMap.get(key1);
			if (temp !== undefined) {
				temp[applyKey] = Number(sum.toFixed(2));
			}
		}
	}

	public ApplyAvg(query: ApplyRuleAvg) {
		let applyKey: string = Object.keys(query)[0];
		let searchKey: string = StringUtil.extractFieldUnderscore(query[applyKey].AVG);
		// TODO: implement this
		for (const [key1, value] of this.groupMap) {
			let total: Decimal = new Decimal(0);
			for (const result of value) {
				total = total.add(new Decimal(result[searchKey]));
			}
			let temp = this.applyMap.get(key1);
			if (temp !== undefined) {
				let avg = total.toNumber() / value.length;
				temp[applyKey] = Number(avg.toFixed(2));
			}
		}
	}


}
