import {InsightError} from "../IInsightFacade";
import {
	ApplyRule,
	ApplyRuleAvg,
	ApplyRuleCount, ApplyRuleMax, ApplyRuleMin,
	ApplyRuleSum,
	ApplyToken,
	Order,
	Transformations
} from "./QueryInterface";
import {AggregationValidator} from "./AggregationValidator";

export class KeyValidator {
	private idString: string;

	constructor() {
		this.idString = "";
	}

	public getIDString() {
		return this.idString;
	}

	public isKeyListType(input: unknown): input is string[] {
		// return true if input is an array with keys
		if (typeof input !== "object" || input === undefined || input === null) {
			throw new InsightError("invalid type");
		}
		let keyList = input as string[];
		if (keyList.length < 1) {
			return false;
		}
		for (const value of keyList) {
			if (!this.isKeyType(value)) {
				return false;
			}
		}
		return true;
	}

	public isAnyKeyListType(input: unknown): input is string[] {
		// return true if input is an array with anyKeys
		if (typeof input !== "object" || input === undefined || input === null) {
			throw new InsightError("invalid type");
		}
		let keyList = input as string[];
		if (keyList.length < 1) {
			return false;
		}
		for (const value of keyList) {
			if (!this.isAnyKeyType(value)) {
				return false;
			}
		}
		return true;
	}

	public isValidMKey(key: string): boolean {
		// returns true if string is a valid mKey
		if (key.includes("_")) {
			const index = key.indexOf("_");
			if (!this.isValidID(key.substring(0, index))) {
				return false;
			}
			if (!this.isValidMField(key.substring(index + 1, key.length))) {
				return false;
			}
		}
		return true;
	}

	public isValidSKey(key: string): boolean {
		// returns true if string is a valid sKey
		if (key.includes("_")) {
			const index = key.indexOf("_");
			if (!this.isValidID(key.substring(0, index))) {
				return false;
			}
			if (!this.isValidSField(key.substring(index + 1, key.length))) {
				return false;
			}
		}
		return true;
	}

	public isValidMField(mField: string): boolean {
		// return true if string is one of "avg" | "pass" | "fail" | "audit" | "year"
		return mField === "avg" || mField === "pass" || mField === "fail" || mField === "audit" || mField === "year"
			|| mField === "lat" || mField === "lon" || mField === "seats";
	}

	public isValidSField(sField: string): boolean {
		// return true if string is one of "dept" | "id" | "instructor" | "title" | "uuid"
		return sField === "dept" || sField === "id" || sField === "instructor" || sField === "title" ||
			sField === "uuid" || sField === "fullname" || sField === "shortname" || sField === "number" ||
			sField === "name" || sField === "address" || sField === "type" || sField === "furniture" ||
			sField === "href";
	}

	public isValidID(ID: string): boolean {
		// check that string is not empty and does not include an underscore
		// and that ID string is consistent throughout the query
		if (this.idString === "") {
			this.idString = ID;
		} else if (this.idString !== ID) {
			return false;
		}
		return !(!ID || ID.includes("_"));
	}

	public isValidApplyKey(Key: string): boolean {
		return !(!Key || Key.includes("_"));
	}

	public isValidInputString(input: string): boolean {
		// return true if input string is a valid inputString
		let length = input.length;
		if (input.substring(0, 1) === "*") {
			input = input.substring(1, length);
			length--;
			if (length === 0) {
				return true;
			}
		}
		if (input.substring(length - 1, length) === "*") {
			input = input.substring(0, length - 1);
		}
		return !input.includes("*");
	}

	public isKeyType(input: unknown): input is string {
		// returns true if key is of key type
		if ( typeof input !== "string") {
			throw new InsightError("invalid type");
		}

		let key = input as string;

		if (key.includes("_")) {
			const index = key.indexOf("_");
			if (!this.isValidID(key.substring(0, index))) {
				return false;
			}
			if (this.isValidSField(key.substring(index + 1, key.length))) {
				return true;
			} else if (this.isValidMField(key.substring(index + 1, key.length))) {
				return true;
			}
		}
		return false;
	}

	public isAnyKeyType(input: unknown): input is string {
		if (typeof input !== "string") {
			return false;
		}
		return (this.isKeyType(input) || this.isValidApplyKey(input as string));
	}

}
