import JSZip, {JSZipObject} from "jszip";
import * as parse5 from "parse5";
import {InsightDatasetKind, InsightError, InsightResult} from "../IInsightFacade";
import {CourseClass} from "./CourseClass";
import {Building} from "./Building";
import {Room} from "./Room";
import {Section} from "./Section";
import {Result} from "../queryEngine/DatasetInterface";
const zip = new JSZip();
const requiredFieldNames: string[] = [
	"id", "Course", "Title", "Professor", "Subject", "Year", "Avg", "Pass", "Fail", "Audit"];

export class Dataset {
	private readonly _id: string;
	private readonly _kind: InsightDatasetKind;
	private readonly _rawData: string;
	private _jsonFile: unknown[];
	private _convertedZip: string;
	private readonly _courses: CourseClass[];
	private readonly _buildings: Building[];

	constructor(id: string, kind: InsightDatasetKind, rawData: string) {
		this._id = id;
		this._kind = kind;
		this._rawData = rawData;
		this._jsonFile = [];
		this._courses = [];
		this._buildings = [];
		this._convertedZip = "";

		if (!this.checkValidID()) {
			throw new InsightError("Invalid ID");
		}
		if (!this.checkValidZipThenConvert()) {
			throw new InsightError("Invalid zip");
		}
	}

	private checkValidID() {
		if (this._id === "" || this._id.includes(" ") || this._id.includes("_")) {
			return false;
		}
		return true;
	}

	private async checkValidZipThenConvert(): Promise<boolean> {
		if (this.checkValidZip()) {
			if (this._kind === InsightDatasetKind.Sections) {
				await this.convertSectionsDataset();
			} else if (this._kind === InsightDatasetKind.Rooms){
				await this.convertRoomsDataset();
			}
			return true;
		}
		return false;
	}

	private checkValidZip(): boolean {
		return this._rawData.endsWith(".zip");
	}

	private isValidJSON(text: string): boolean {
		try {
			JSON.parse(text);
			return true;
		} catch (error) {
			return false;
		}
	}

	public async convertSectionsDataset(): Promise<void>{
		this._convertedZip = this._rawData;
		const base64Data = this._convertedZip;
		const zipBuffer = Buffer.from(base64Data, "base64");
		try {
			const zipFile = await zip.loadAsync(zipBuffer);
			const coursesFolder = zipFile.folder("courses");
			// const coursesFolder = zipFile.folder(/^courses$/);
			if (!coursesFolder) {
				throw new InsightError("no 'courses' folder");
			}
			const filePromises = [];

			for (const [relativePath, fileEntry] of Object.entries(coursesFolder.files)) {
				const file = coursesFolder.files[relativePath];
				if (file.dir || file.name === ".DS_Store") {
					continue; // Skip directories and .DS_Store files
				}
				const promise = file.async("nodebuffer").then((data) => {
					const course = data.toString("utf-8");
					try {
						this.processCourseJSON(course);
					} catch (error) {
						// do something
					}
				});
				filePromises.push(promise);
			}
			await Promise.all(filePromises);
		} catch (error) {
			// Handle errors here
		}
	}

	public async convertRoomsDataset(): Promise<void> {
		this._convertedZip = this._rawData;
		const base64Data = this._convertedZip;
		const zipBuffer = Buffer.from(base64Data, "base64");
		try {
			const zipFile = await zip.loadAsync(zipBuffer);
			const indexFile = zipFile.file("index.htm");
			if (indexFile) {
				const htmlContent = await indexFile.async("text");
				const tableClass = "views-table cols-5 table";
				const targetTable = this.findBuildingRoomTable(htmlContent, tableClass);
				if (targetTable) {
					const tbody = this.findTBody(targetTable);
					if (tbody) {
						const buildingFilePromises: Array<Promise<void>> = [];
						for (const childNode of tbody.childNodes || []) {
							if (childNode.nodeName === "tr") {
								let building: Building = new Building();
								building.getBuildingInfo(childNode);
								building.getGeolocation() // get lon and lat of building
									.then(() => {
										// good
									})
									.catch((error) => {
										// no location
									});
								this.createBuilding(building, zipFile, buildingFilePromises);
							}
						}
						await Promise.all(buildingFilePromises);
					}
				}
			}
		} catch (err) {
			console.log("convertRoomsDataset error: ", err);
		}
	}

	private createBuilding(building: Building, zipFile: any, buildingFilePromises: any){
		const href = building.href;
		const buildingFileName = href.split("/").pop();
		const buildingFilePath
			= `campus/discover/buildings-and-classrooms/${buildingFileName}`;
		const buildingFile = zipFile.file(buildingFilePath);
		if (buildingFile) {
			buildingFilePromises.push(
				(async () => {
					const htmlRoomContent = await buildingFile.async("text");
					const roomClass = "views-table cols-5 table";
					const targetRoomTable
						= this.findBuildingRoomTable(htmlRoomContent, roomClass);
					if (targetRoomTable) {
						const tbodyRoom = this.findTBody(targetRoomTable);
						if (tbodyRoom) {
							for (const childNodeRoom of tbodyRoom.childNodes || []) {
								if (childNodeRoom.nodeName === "tr") {
									let room: Room = new Room();
									room.getRoomInfo(childNodeRoom);
									room.name = `${building.shortname}_${room.number}`;
									building.rooms.push(room);
									room.fullname = building.fullname;
									room.shortname = building.shortname;
									room.address = building.address;
									room.shortname = building.shortname;
									room.lon = building.lon;
									room.lat = building.lat;
								}
							}
						}
					}
				})()
			);
		}
		this.buildings.push(building);
	}

	private findBuildingRoomTable(htmlContent: string, tableClass: string): any {
		const node = parse5.parse(htmlContent);
		let targetTable = null;
		for (const childNode of node.childNodes || []) {
			targetTable = this.findTable(childNode, tableClass);
			if (targetTable) {
				break;
			}
		}
		return targetTable;
	}

	private findTBody(table: any) {
		for (const childNode of table.childNodes || []) {
			if (childNode.nodeName === "tbody") {
				return childNode;
			}
		}
		return null;
	}

	private findTable(node: any, tableClass: string): any {
		if (node.nodeName === "table") {
			for (const attr of node.attrs) {
				if (attr.name === "class" && attr.value === "views-table cols-5 table") {
					return node;
				}
			}
		}
		for (const childNode of node.childNodes || []) {
			const result = this.findTable(childNode, tableClass);
			if (result) {
				return result;
			}
		}
		return null;
	}

	private async processCourseJSON(courseContent: string): Promise<void> {
		try {
			if (!this.isValidJSON(courseContent)) {
				return;
			}
			const jsonData = JSON.parse(courseContent);
			// Check if the "result" property is an array
			if (jsonData && jsonData.result && Array.isArray(jsonData.result)) {
				const sections: Section[] = [];
				const sectionsData = jsonData.result;
				// FOR EACH SECTION, CALL "getSectionData"
				sectionsData.forEach((sectionData: any) => {
					this.getSectionData(sectionData, sections);
				});
				const course = new CourseClass(sections);
				this._courses.push(course);
			} else {
				throw new InsightError("'result' is not an array");
			}
		} catch (error) {
			// console.error("Error processing JSON data:", error);
		}
	}

	private async getSectionData(sectionData: any, sections: Section[]): Promise<void> {
		if (!this.containsAllRequiredFields(sectionData)) {
			return;
		}
		if (sectionData["Section"] === "overall") {
			sectionData["Year"] = Number(1900);
		}
		const theExtraFields: Result[] = [];
		for (const key in sectionData) {
			if (!this.isFieldRequired(key)) {
				const result = new Result();
				result[`_${key}`] = sectionData[key];
				theExtraFields.push(result);
			}
		}
		const {id, Course, Title, Professor, Subject, Year, Avg, Pass, Fail, Audit} = sectionData;
		const section = new Section(String(id), Course, Title, Professor, Subject, Number(Year), Avg, Pass, Fail, Audit,
			theExtraFields);
		sections.push(section);
	}

	private isFieldRequired(fieldName: string): boolean {
		return requiredFieldNames.includes(fieldName);
	}

	private containsAllRequiredFields(sectionData: any): boolean {
		return requiredFieldNames.every((fieldName) => fieldName in sectionData);
	}

	public get id(): string {
		return this._id;
	}

	public get kind(): InsightDatasetKind {
		return this._kind;
	}

	public get courses(): CourseClass[] {
		return this._courses;
	}

	public get buildings(): Building[] {
		return this._buildings;
	}
}
