import {Result} from "../queryEngine/DatasetInterface";

import {InsightResult} from "../IInsightFacade";

export class Section {
	private _uuid: string;
	private _id: string;
	private _title: string;
	private _instructor: string;
	private _dept: string;
	private _year: number;
	private _avg: number;
	private _pass: number;
	private _fail: number;
	private _audit: number;
	[key: string]: string | number;
	// private _extraFields: Map<string, any>;


	constructor(
		uuid: string,
		id: string,
		title: string,
		instructor: string,
		dept: string,
		year: number,
		avg: number,
		pass: number,
		fail: number,
		audit: number,
		// extraFields: Map<string, any>
		extraFields: Result[]
	) {
		this._uuid = uuid;
		this._id = id;
		this._title = title;
		this._instructor = instructor;
		this._dept = dept;
		this._year = year;
		this._avg = avg;
		this._pass = pass;
		this._fail = fail;
		this._audit = audit;
		// this._extraFields = extraFields;

		for (const result of extraFields) {
			for (const key of Object.keys(result)) {
				this[key] = result[key];
			}
		}
	}

	public get uuid(): string {
		return this._uuid;
	}

	public set uuid(value: string) {
		this._uuid = value;
	}

	public get id(): string {
		return this._id;
	}

	public set id(value: string) {
		this._id = value;
	}

	public get title(): string {
		return this._title;
	}

	public set title(value: string) {
		this._title = value;
	}

	public get instructor(): string {
		return this._instructor;
	}

	public set instructor(value: string) {
		this._instructor = value;
	}

	public get dept(): string {
		return this._dept;
	}

	public set dept(value: string) {
		this._dept = value;
	}

	public get year(): number {
		return this._year;
	}

	public set year(value: number | string) {
		if (value === "overall"){
			this._year = 1900;
		} else {
			this._year = value as number;
		}
	}

	public get avg(): number {
		return this._avg;
	}

	public set avg(value: number) {
		this._avg = value;
	}

	public get pass(): number {
		return this._pass;
	}

	public set pass(value: number) {
		this._pass = value;
	}

	public get fail(): number {
		return this._fail;
	}

	public set fail(value: number) {
		this._fail = value;
	}

	public get audit(): number {
		return this._audit;
	}

	public set audit(value: number) {
		this._audit = value;
	}
}
