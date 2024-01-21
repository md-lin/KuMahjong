import {
	ANDFilter, EQFilter, GTFilter, ISFilter, LTFilter, NOTFilter, Options, ORFilter,
	Query, MComparator, SComparator, Transformations
} from "./QueryInterface";
import {InsightError} from "../IInsightFacade";
import {Key} from "readline";
import {KeyValidator} from "./KeyValidator";
import {AggregationValidator} from "./AggregationValidator";

export class Validator {
	// return true if parsed object is of type Query, according to the EBNF
	private keyValidator: KeyValidator;
	private aggrValidator: AggregationValidator;

	constructor() {
		this.keyValidator = new KeyValidator();
		this.aggrValidator = new AggregationValidator(this.keyValidator);
	}

	public getKeyValidator() {
		return this.keyValidator;
	}

	public isQueryType(input: unknown): input is Query {
		if ( typeof input !== "object" || input === undefined || input === null) {
			throw new InsightError("invalid type");
		}

		if (Object.keys(input).length > 3) {
			return false;
		}

		let query = input as Query;

		if ("WHERE" in query) {
			// or can just pass through all the filters and if they all return false then return false
			if (this.isANDFilterType(query.WHERE) || this.isORFilterType(query.WHERE) ||
				this.isNOTFilterType(query.WHERE) || this.isISFilterType(query.WHERE) ||
				this.isEQFilterType(query.WHERE) || this.isLTFilterType(query.WHERE) ||
				this.isGTFilterType(query.WHERE)) {
				// comment
			} else if (Object.keys(query.WHERE).length === 0) {
				// comment
			} else {
				return false;
			}
		} else {
			return false;
		}
		if ("OPTIONS" in query) {
			if (!this.isOptionsType(query.OPTIONS)) {
				return false;
			}
		} else {
			return false;
		}
		if ("TRANSFORMATIONS" in query) {
			if (!this.aggrValidator.isTransformationsType(query.TRANSFORMATIONS)) {
				return false;
			}
		}
		for (const key of Object.keys(query)) {
			if (key !== "WHERE" && key !== "OPTIONS" && key !== "TRANSFORMATIONS") {
				return false;
			}
		}
		// return true if query has a valid where and valid options clause
		return true;
	}

	public isANDFilterType(input: unknown): input is ANDFilter {
		if ( typeof input !== "object" || input === undefined || input === null) {
			throw new InsightError("invalid type");
		}
		if (Object.keys(input).length > 1) {
			return false;
		}
		if ("AND" in input) {
			let query = input as ANDFilter;

			// validate that query.OR is an array of filters
			if (this.isFilterListType(query.AND)) {
				return true;
			}
		}
		return false;
	}

	public isORFilterType(input: unknown): input is ORFilter {
		if ( typeof input !== "object" || input === undefined || input === null) {
			throw new InsightError("invalid type");
		}
		if (Object.keys(input).length > 1) {
			return false;
		}
		if ("OR" in input) {
			let query = input as ORFilter;

			// validate that query.OR is an array of filters
			if (this.isFilterListType(query.OR)) {
				return true;
			}
		}
		return false;
	}

	public isLTFilterType(input: unknown): input is LTFilter {
		if ( typeof input !== "object" || input === undefined || input === null) {
			throw new InsightError("invalid type");
		}
		if (Object.keys(input).length > 1) {
			return false;
		}
		if ("LT" in input) {
			let query = input as LTFilter;

			if (this.isMComparatorType(query.LT)) {
				return true;
			}
		}
		return false;
	}

	public isGTFilterType(input: unknown): input is GTFilter {
		if ( typeof input !== "object" || input === undefined || input === null) {
			throw new InsightError("invalid type");
		}
		if (Object.keys(input).length > 1) {
			return false;
		}
		if ("GT" in input) {
			let query = input as GTFilter;

			if (this.isMComparatorType(query.GT)) {
				return true;
			}
		}
		return false;
	}

	public isEQFilterType(input: unknown): input is EQFilter {
		if ( typeof input !== "object" || input === undefined || input === null) {
			throw new InsightError("invalid type");
		}
		if (Object.keys(input).length > 1) {
			return false;
		}
		if ("EQ" in input) {
			let query = input as EQFilter;

			if (this.isMComparatorType(query.EQ)) {
				return true;
			}
		}
		return false;
	}

	public isISFilterType(input: unknown): input is ISFilter {
		if ( typeof input !== "object" || input === undefined || input === null) {
			throw new InsightError("invalid type");
		}
		if (Object.keys(input).length > 1) {
			return false;
		}
		if ("IS" in input) {
			let query = input as ISFilter;

			if (this.isSComparatorType(query.IS)) {
				return true;
			}
		}
		return false;
	}

	public isNOTFilterType(input: unknown): input is NOTFilter {
		if ( typeof input !== "object" || input === undefined || input === null) {
			throw new InsightError("invalid type");
		}
		if (Object.keys(input).length > 1) {
			return false;
		}
		if ("NOT" in input) {
			let query = input as NOTFilter;
			if (this.isANDFilterType(query.NOT) || this.isORFilterType(query.NOT) ||
				this.isNOTFilterType(query.NOT) || this.isISFilterType(query.NOT) ||
				this.isEQFilterType(query.NOT) || this.isLTFilterType(query.NOT) ||
				this.isGTFilterType(query.NOT)) {
				return true;
			}
		}
		return false;
	}

	public isOptionsType(input: unknown): input is Options {
		if ( typeof input !== "object" || input === undefined || input === null) {
			throw new InsightError("invalid type");
		}

		if (Object.keys(input).length > 2) {
			return false;
		}

		let options = input as Options;
		if (!("COLUMNS" in options)) {
			return false;
		}
		if (!this.keyValidator.isAnyKeyListType(options.COLUMNS)) {
			return false;
		}
		if ("ORDER" in options) {
			if (!this.keyValidator.isAnyKeyType(options.ORDER) && !this.aggrValidator.isOrderType(options.ORDER)) {
				return false;
			}
		}
		return true;
	}

	public isFilterListType(input: unknown): input is Array<ANDFilter | ORFilter | LTFilter
		| GTFilter | EQFilter | ISFilter | NOTFilter> {
		// return true if input is an array with keys
		if ( typeof input !== "object" || input === undefined || input === null) {
			throw new InsightError("invalid type");
		}
		let filterList = input as unknown[];
		if (filterList.length < 1) {
			return false;
		}
		// verify that each item in the array is one of the filters
		for (const value of filterList) {
			if (!(this.isANDFilterType(value) || this.isORFilterType(value) ||
				this.isNOTFilterType(value) || this.isISFilterType(value) ||
				this.isEQFilterType(value) || this.isLTFilterType(value) ||
				this.isGTFilterType(value))) {
				return false;
			}
		}
		return true;
	}

	public  isSComparatorType(input: unknown): input is SComparator {
		if (typeof input !== "object" || input === undefined || input === null) {
			throw new InsightError("invalid type");
		}

		if (Object.keys(input).length > 1) {
			return false;
		}

		let query = input as SComparator;
		// check that key is an sKey and that string is a valid input string
		return this.keyValidator.isValidSKey(Object.keys(input)[0]) &&
			this.keyValidator.isValidInputString(query[Object.keys(input)[0]]);
	}

	public  isMComparatorType(input: unknown): input is MComparator {
		if (typeof input !== "object" || input === undefined || input === null) {
			throw new InsightError("invalid type");
		}

		if (Object.keys(input).length > 1) {
			return false;
		}
		let query = input as MComparator;
		// check that key is an sKey and that string is a valid input string
		return this.keyValidator.isValidMKey(Object.keys(input)[0]) &&
			(typeof query[Object.keys(input)[0]] === "number");
	}
}
