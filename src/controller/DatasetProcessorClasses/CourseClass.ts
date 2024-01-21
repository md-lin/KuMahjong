import {Section} from "./Section";

export class CourseClass {
	private _sections: Section[];

	constructor(sections: Section[]) {
		this._sections = sections;
	}

	// checkValidSection(): boolean{
	// 	return false;
	// }

	public get sections(): Section[] {
		return this._sections;
	}

	public set sections(value: Section[]) {
		this._sections = value;
	}
}
