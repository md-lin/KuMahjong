// contains all EBNF query definitions

export interface Query {
	// WHERE : {}
	// each of the different filters has a different corresponding field name
	// logic: AND/OR field name
	// mComparison: LT/GT/EQ field name
	// sComparison: IS
	// negation: NOT
	WHERE: ANDFilter | ORFilter | LTFilter | GTFilter | EQFilter | ISFilter | NOTFilter;
	OPTIONS: Options;
	TRANSFORMATIONS?: Transformations;
}

export interface ANDFilter {
	AND: Array<ANDFilter | ORFilter | LTFilter | GTFilter | EQFilter | ISFilter | NOTFilter>;
}

export interface ORFilter {
	OR: Array<ANDFilter | ORFilter | LTFilter | GTFilter | EQFilter | ISFilter | NOTFilter>;
}

export interface LTFilter {
	LT: MComparator;
}

export interface GTFilter {
	GT: MComparator;
}

export interface EQFilter {
	EQ: MComparator;
}

export interface ISFilter {
	IS: SComparator;
}

export interface NOTFilter {
	NOT: ANDFilter | ORFilter | LTFilter | GTFilter | EQFilter | ISFilter | NOTFilter;
}

export interface SComparator {
	// key must be an sKey
	// value must be a valid input string
	[key: string]: string;
}

export interface MComparator {
	// key must be an mKey
	[key: string]: number;
}

export interface Options {
	// OPTIONS: { columns } | OPTIONS: { columns, ORDER: "" }
	// string must be string of format MKey or SKey or ApplyKey
	COLUMNS: string[];
	// string must be string of format MKey or SKey
	ORDER?: string | Order;
}

export interface Order {
	dir: "UP" | "DOWN";
	// string is an AnyKey
	keys: string[];
}

export interface Transformations {
	// TRANSFORMATIONS: { GROUP,  APPLY }
	// string must be a string of format MKey or SKey
	GROUP: string[];
	APPLY: Array<ApplyRuleMax | ApplyRuleSum | ApplyRuleAvg | ApplyRuleMin | ApplyRuleCount>;
}

export interface ApplyRule {
	// key must be an applyKey
	[key: string]: MaxToken | MinToken | AvgToken | CountToken | SumToken | ApplyToken;
}

export interface ApplyRuleMax {
	[key: string]: {MAX: string};
}

export interface ApplyRuleMin {
    [key: string]: {MIN: string};
}

export interface ApplyRuleAvg {
    [key: string]: {AVG: string};
}

export interface ApplyRuleCount {
    [key: string]: {COUNT: string};
}

export interface ApplyRuleSum {
    [key: string]: {SUM: string};
}

export interface ApplyToken {
	// key is one of MAX | MIN | AVG | COUNT | SUM
	// string is an mKey or sKey
	[key: string]: string;
}

export interface MaxToken {
	// string is an mKey or sKey
	MAX: string;
}

export interface MinToken {
	// string is an mKey or sKey
	MIN: string;
}

export interface AvgToken {
	// string is an mKey or sKey
	AVG: string;
}

export interface CountToken {
	// string is an mKey or sKey
	COUNT: string;
}

export interface SumToken {
	// string is an mKey or sKey
	SUM: string;
}
