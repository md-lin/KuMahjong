import {ApplyRule, ApplyRuleAvg, ApplyRuleCount, ApplyRuleMax, ApplyRuleMin, ApplyRuleSum,
	ApplyToken, LTFilter, Order, Transformations} from "./QueryInterface";
import {InsightError} from "../IInsightFacade";
import {KeyValidator} from "./KeyValidator";
import {isKeyObject} from "util/types";
import {Aggregation} from "./Aggregation";
import {StringUtil} from "./StringUtil";

export class AggregationValidator {
	private currApplyKeys: string[] = [];
	private keyValidator: KeyValidator;
	private numberKeys: string[];

	public constructor(keyValidator: KeyValidator) {
		this.keyValidator = keyValidator;
		this.numberKeys = ["lat", "lon", "seats", "avg", "pass", "fail", "audit", "year"];
	}

	public static isApplyRuleMax(input: unknown): input is ApplyRuleMax {
		if ( typeof input !== "object" || input === undefined || input === null) {
			throw new InsightError("invalid type");
		}
		if (Object.keys(input).length !== 1) {
			return false;
		}
		let query = input as ApplyRuleMax;
		return "MAX" in query[Object.keys(query)[0]];
	}

	public static isApplyRuleSum(input: unknown): input is ApplyRuleSum {
		if ( typeof input !== "object" || input === undefined || input === null) {
			throw new InsightError("invalid type");
		}
		if (Object.keys(input).length !== 1) {
			return false;
		}
		let query = input as ApplyRuleMax;
		return "SUM" in query[Object.keys(query)[0]];
	}

	public static isApplyRuleMin(input: unknown): input is ApplyRuleMin {
		if ( typeof input !== "object" || input === undefined || input === null) {
			throw new InsightError("invalid type");
		}
		if (Object.keys(input).length !== 1) {
			return false;
		}
		let query = input as ApplyRuleMin;
		return "MIN" in query[Object.keys(query)[0]];
	}

	public static isApplyRuleCount(input: unknown): input is ApplyRuleCount {
		if ( typeof input !== "object" || input === undefined || input === null) {
			throw new InsightError("invalid type");
		}
		if (Object.keys(input).length !== 1) {
			return false;
		}
		let query = input as ApplyRuleCount;
		return "COUNT" in query[Object.keys(query)[0]];
	}

	public isApplyRuleMaxType(input: unknown): input is ApplyRuleMax {
		if ( typeof input !== "object" || input === undefined || input === null) {
			throw new InsightError("invalid type");
		}
		if (Object.keys(input).length !== 1) {
			return false;
		}
		let query = input as ApplyRuleMax;
		let thing = Object.keys(query)[0];
		if (!this.keyValidator.isValidApplyKey(thing)) {
			return false;
		}
		if (this.currApplyKeys.includes(thing)) {
			return false;
		}
		if ("MAX" in query[thing]) {
            // TODO: add check here to see if the field that we're maxing over is a number
            // would need to have a map of field/types??
			if (!this.numberKeys.includes(StringUtil.extractField(query[thing].MAX))) {
				return false;
			}
			this.currApplyKeys.push(thing);
			return true;
		}
		return false;
	}

	public isApplyRuleMinType(input: unknown): input is ApplyRuleMin {
		if ( typeof input !== "object" || input === undefined || input === null) {
			throw new InsightError("invalid type");
		}
		if (Object.keys(input).length !== 1) {
			return false;
		}
		let query = input as ApplyRuleMin;
		let thing = Object.keys(query)[0];
		if (!this.keyValidator.isValidApplyKey(thing)) {
			return false;
		}
		if (this.currApplyKeys.includes(thing)) {
			return false;
		}
		if ("MIN" in query[thing]) {
			// TODO: add check here to see if the field that we're minning over is a number
			// would need to have a map of field/types??
			if (!this.numberKeys.includes(StringUtil.extractField(query[thing].MIN))) {
				return false;
			}
			this.currApplyKeys.push(thing);
			return true;
		}
		return false;

	}

	public isApplyRuleAvgType(input: unknown): input is ApplyRuleAvg {
		if ( typeof input !== "object" || input === undefined || input === null) {
			throw new InsightError("invalid type");
		}
		if (Object.keys(input).length !== 1) {
			return false;
		}
		let query = input as ApplyRuleAvg;
		let thing = Object.keys(query)[0];
		if (this.currApplyKeys.includes(thing)) {
			return false;
		}

		if ("AVG" in query[thing]) {
			if (!this.numberKeys.includes(StringUtil.extractField(query[thing].AVG))) {
				return false;
			}
			this.currApplyKeys.push(thing);
			return true;
		}
		return false;

	}

	public isApplyRuleCountType(input: unknown): input is ApplyRuleCount {
		if ( typeof input !== "object" || input === undefined || input === null) {
			throw new InsightError("invalid type");
		}
		if (Object.keys(input).length !== 1) {
			return false;
		}
		let query = input as ApplyRuleCount;
		let thing = Object.keys(query)[0];

		if (!this.keyValidator.isValidApplyKey(thing)) {
			return false;
		}

		if (this.currApplyKeys.includes(thing)) {
			return false;
		}
		if ("COUNT" in query[thing]) {
			// if (!this.numberKeys.includes(StringUtil.extractField(query[thing].COUNT))) {
			// 	return false;
			// }
			this.currApplyKeys.push(thing);
			return true;
		}
		return false;

	}

	public isApplyRuleSumType(input: unknown): input is ApplyRuleSum {
		if ( typeof input !== "object" || input === undefined || input === null) {
			throw new InsightError("invalid type");
		}
		if (Object.keys(input).length !== 1) {
			return false;
		}
		let query = input as ApplyRuleSum;
		let thing = Object.keys(query)[0];

		if (!this.keyValidator.isValidApplyKey(thing)) {
			return false;
		}
		if (this.currApplyKeys.includes(thing)) {
			return false;
		}
		if ("SUM" in query[thing]) {
			if (!this.numberKeys.includes(StringUtil.extractField(query[thing].SUM))) {
				return false;
			}
			this.currApplyKeys.push(thing);
			return true;
		}
		return false;

	}


	public isTransformationsType(input: unknown): input is Transformations {
		if (typeof input !== "object" || input === undefined || input === null) {
			throw new InsightError("invalid type");
		}
		if (Object.keys(input).length > 2) {
			return false;
		}
		let query = input as Transformations;
		if ("GROUP" in query) {
			if (!this.keyValidator.isKeyListType(query.GROUP)) {
				return false;
			}
		} else {
			return false;
		}
		if ("APPLY" in query) {
			if (!this.isApplyRuleList(query.APPLY)) {
				return false;
			} else if (!this.isApplyRules(query.APPLY)) {
				return false;
			}
		} else {
			return false;
		}
		for (const key of Object.keys(query)) {
			if (key !== "GROUP" && key !== "APPLY") {
				return false;
			}
		}
		return true;
	}

	public isApplyRules(input: unknown): input is ApplyRule[] {
		if (typeof input !== "object" || input === undefined || input === null) {
			throw new InsightError("invalid type");
		}
		let query = input as ApplyRule[];
		for (const value of query) {
			if (!(this.isApplyRuleSumType(value) || this.isApplyRuleAvgType(value) || this.isApplyRuleCountType(value)
			|| this.isApplyRuleMaxType(value) || this.isApplyRuleMinType(value))) {
				return false;
			}
		}
		return true;
	}

	public isApplyRuleList(input: unknown): input is ApplyRule[] {
		if (typeof input !== "object" || input === undefined || input === null) {
			throw new InsightError("invalid type");
		}
		let query = input as ApplyRule[];
		for (const applyRule of query) {
			for (const key of Object.keys(applyRule)) {
				if (!this.keyValidator.isValidApplyKey(key)) {
					return false;
				}
				if (!this.isApplyTokenType(applyRule[key])) {
					return false;
				}
			}
		}
		return true;
	}

	public isApplyTokenType(input: unknown): input is ApplyToken {
		if (typeof input !== "object" || input === undefined || input === null) {
			throw new InsightError("invalid type");
		}
		let query = input as ApplyToken;
		for (const key of Object.keys(query)) {
			if (!(key === "MAX" || key === "MIN" || key === "AVG" || key === "COUNT" || key === "SUM" )) {
				return false;
			}
			if (!this.keyValidator.isKeyType(query[key])) {
				return false;
			}
		}
		return true;
	}

	public isOrderType(input: unknown): input is Order {
		if (typeof input !== "object" || input === undefined || input === null) {
			throw new InsightError("invalid type");
		}
		let query = input as Order;
		if (query.dir !== "UP" && query.dir !== "DOWN") {
			return false;
		}
		for (const value of query.keys) {
			if (!this.keyValidator.isAnyKeyType(value)) {
				return false;
			}
		}
		return true;
	}
}
