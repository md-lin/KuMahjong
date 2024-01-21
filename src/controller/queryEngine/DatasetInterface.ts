import {Section} from "../DatasetProcessorClasses/Section";
import {InsightError, InsightResult} from "../IInsightFacade";

export interface DatasetInterface {
	[index: number]: CourseInterface;
}

export interface CourseInterface {
	result: SectionInterface[];
}

export interface SectionInterface {
	[key: string]: string | number;
}

export class Result{
	[key: string]: string | number;
}

export class DatasetValidator {

	public static isArrayType(input: unknown): input is any[] {
		return input instanceof Array;
	}

	public static isSectionResultArrayType(input: unknown): input is InsightResult[] {
		return true;
	}

	public static isCourseType(input: unknown): input is CourseInterface {
		return true;
	}

	public static isDatasetType (input: unknown): input is CourseInterface[] {
		return true;
	}

	// public static isCourseType (input: unknown): input is CourseInterface {
	// 	if ( typeof input !== "object" || input === undefined || input === null) {
	// 		throw new InsightError("invalid type");
	// 	}
	//
	// 	// if (Object.keys(input).length === 0) {
	// 	// 	return true;
	// 	// }
	//
	// 	if (!(input instanceof Array)) {
	// 		return false;
	// 	}
	//
	// 	let course = input as CourseInterface;
	//
	// 	for (const section in course) {
	// 		if (!DatasetValidator.isSectionType(section)) {
	// 			return false;
	// 		}
	// 	}
	// 	return true;
	// }

	public static isDataset1Type (input: unknown): input is DatasetInterface {
		if ( typeof input !== "object" || input === undefined || input === null) {
			throw new InsightError("invalid type");
		}

		// if (Object.keys(input).length !== 1) {
		// 	return false;
		// }

		let dataset = input as DatasetInterface;

		for (const course in dataset) {
			if (!DatasetValidator.isCourseType(course)) {
				return false;
			}
		}
		return true;
	}

	public static isCourse1Type (input: unknown): input is CourseInterface {
		if ( typeof input !== "object" || input === undefined || input === null) {
			throw new InsightError("invalid type");
		}

		if (Object.keys(input).length === 0) {
			return true;
		}

		let course = input as CourseInterface;

		for (const section in course) {
			if (!DatasetValidator.isSectionType(section)) {
				return false;
			}
		}
		return true;
	}

	public static isSectionType (input: unknown): input is SectionInterface {
		if ( typeof input !== "object" || input === undefined || input === null) {
			throw new InsightError("invalid type");
		}

		let section = input as SectionInterface;

		for (const key of Object.keys(section)) {
			// check that all fields are strings
			if (typeof key !== "string") {
				return false;
			}
			if (typeof section[key] !== "number" || typeof section[key] !== "string") {
				return false;
			}
		}

		return true;
	}
}
