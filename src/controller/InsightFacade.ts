import {
	IInsightFacade,
	InsightDataset,
	InsightDatasetKind,
	InsightError,
	InsightResult,
	NotFoundError,
} from "./IInsightFacade";
import {Dataset} from "./DatasetProcessorClasses/Dataset";
import JSZip from "jszip";
import fs from "fs-extra";
import QueryEngine from "./queryEngine/QueryEngine";
import {StringUtil} from "./queryEngine/StringUtil";

const zip = new JSZip();
const dataFolderPath = "../../data";
const persistDir = "./data";

/**
 * This is the main programmatic entry point for the project.
 * Method documentation is in IInsightFacade
 *
 */
export default class InsightFacade implements IInsightFacade {
	private currentDatasetsSections: Map<string, InsightResult[]>;
	private currentDatasetsRooms: Map<string, InsightResult[]>;
	private currentDatasetsAll: InsightDataset[];

	constructor() {
		this.currentDatasetsAll = [];
		this.currentDatasetsSections = new Map<string, InsightResult[]>();
		this.currentDatasetsRooms = new Map<string, InsightResult[]>();

		// check if data folder exists, if it does, then add each file to its corresponding map
		// and add it to the currentDatasetsAll map
		if (fs.existsSync("./data/")) {
			// for each dataset in the data folder, add it to the map
			for (const folder of fs.readdirSync("./data/")) {
				for (const file of fs.readdirSync("./data/" + folder + "/")) {
					if (file.substring(0, file.length - 5).endsWith("rooms")) {
						const data = JSON.parse(fs.readFileSync("./data/" + folder + "/" + file,
							{encoding: "utf8", flag: "r"}));
						const key = StringUtil.extractID(file);
						if (this.isInsightResult(data) && (data.length !== 0)) {
							this.currentDatasetsRooms.set(key, data);
							let insightDataset: InsightDataset = {
								id: key,
								kind: InsightDatasetKind.Rooms,
								numRows: data.length,
							};
							this.currentDatasetsAll.push(insightDataset);
						}
					} else if (file.substring(0, file.length - 5).endsWith("sections")) {
						const data = JSON.parse(fs.readFileSync("./data/" + folder + "/" + file,
							{encoding: "utf8", flag: "r"}));
						const key = StringUtil.extractID(file);
						if (this.isInsightResult(data) && (data.length !== 0)) {
							this.currentDatasetsSections.set(key, data);
							let insightDataset: InsightDataset = {
								id: key,
								kind: InsightDatasetKind.Sections,
								numRows: data.length,
							};
							this.currentDatasetsAll.push(insightDataset);
						}
					}
				}
			}
		}
	}

	public async addDataset(id: string, content: string, kind: InsightDatasetKind): Promise<string[]> {
		try {
			if (this.currentDatasetsAll.some((set) => set.id === id)) {
				return Promise.reject(new InsightError());
			}
			// Create a new Dataset object and convert it
			let dataset: Dataset = new Dataset(id, kind, content);
			if (kind === InsightDatasetKind.Sections) {
				await dataset.convertSectionsDataset();
			} else if (kind === InsightDatasetKind.Rooms){
				await dataset.convertRoomsDataset();
			}

			await this.saveDatasetToDisk(id, dataset);

			// Now, save the updated dataset to disk
			let numRows: number = 0;
			if (dataset.courses.length !== 0){
				for (const course of dataset.courses) {
					numRows += course.sections.length;
				}
			} else {
				for (const course of dataset.buildings) {
					numRows += course.rooms.length;
				}
			}
			let insightDataset: InsightDataset = {
				id: id,
				kind: kind,
				numRows: numRows,
			};
			this.currentDatasetsAll.push(insightDataset);
			await this.saveDatasetToDisk(id, dataset);

			// Now, save the updated dataset to disk

			const sectionIds = Array.from(this.currentDatasetsSections.keys());
			const roomIds = Array.from(this.currentDatasetsRooms.keys());

			return Promise.resolve([...sectionIds, ...roomIds]);
		} catch (err) {
			return Promise.reject(err);
		}
	}

	public async removeDataset(id: string): Promise<string> {
		if (id === "" || id.includes(" ") || id.includes("_")) {
			return Promise.reject(new InsightError());
		}
		const index = this.currentDatasetsAll.findIndex((dataset) => dataset.id === id);
		if (index !== -1) {
			this.currentDatasetsAll.splice(index, 1);
			// duplicate IDs are not allowed, even between dataset types, so this implementation should be fine
			this.currentDatasetsSections.delete(id);
			this.currentDatasetsRooms.delete(id);

			await this.removeDatasetFromDisk(id);
			return Promise.resolve(id);
		} else {
			return Promise.reject(new NotFoundError());
		}
	}


	public performQuery(query: unknown): Promise<InsightResult[]> {
		let queryEngine = new QueryEngine();

		if (!queryEngine.getValidator().isQueryType(query)) {
			return Promise.reject(new InsightError("invalid query"));
		}

		const key = queryEngine.getValidator().getKeyValidator().getIDString();

		const data = this.currentDatasetsSections.get(key);

		if (data === undefined) {
			const data1 = this.currentDatasetsRooms.get(key);
			if (data1 === undefined) {
				throw new InsightError("dataset does not exist");
			} else {
				try {
					return Promise.resolve(queryEngine.performQuery(query, data1));
				} catch (err) {
					return Promise.reject(err);
				}
			}
		} else {
			try {
				return Promise.resolve(queryEngine.performQuery(query, data));
			} catch (err) {
				return Promise.reject(err);
			}
		}
	}

	public listDatasets(): Promise<InsightDataset[]> {
		// console.log(this.currentDatasetsAll);
		return Promise.resolve(this.currentDatasetsAll);
	}

	public isInsightResult(input: unknown): input is InsightResult[] {
		return true;
	}

	/**
	 * Save a dataset to disk.
	 *
	 * @param id      The ID of the dataset.
	 * @param dataset The dataset to save.
	 */

	public async saveDatasetToDisk(id: string, dataset: Dataset) {
		try {
			const datasetDir = `${persistDir}/${id}`;
			fs.ensureDirSync(datasetDir); // Ensure that the dataset directory exists

			// SAVE SECTIONS FILE
			const sectionsToSave = [];
			for (const course of dataset.courses) {
				for (const section of course.sections) {
					sectionsToSave.push(section);
				}
			}
			const sectionsPath = `${datasetDir}/${id}_sections.json`;
			const sectionsContent = JSON.stringify(sectionsToSave, null, 2);

			// add the dataset to the map
			if (sectionsToSave.length !== 0) {
				this.currentDatasetsSections.set(dataset.id, sectionsToSave);
			}

			fs.writeFileSync(sectionsPath, sectionsContent);

			// SAVE ROOMS FILE
			const roomsToSave = [];
			for (const building of dataset.buildings) {
				for (const room of building.rooms) {
					roomsToSave.push(room);
				}
			}

			const roomsPath = `${datasetDir}/${id}_rooms.json`;
			const roomsContent = JSON.stringify(roomsToSave, null, 2);

			// add the dataset to the map
			if (roomsToSave.length !== 0) {
				if (this.isInsightResult(roomsToSave)) {
					let rooms = roomsToSave as InsightResult[];
					this.currentDatasetsRooms.set(dataset.id, rooms);
				}
			}

			fs.writeFileSync(roomsPath, roomsContent);
		} catch (err) {
			// Handle the error as needed
		}
	}

	/**
	 * Remove a dataset file from disk.
	 *
	 * @param id The ID of the dataset to remove.
	 */
	public async removeDatasetFromDisk(id: string) {
		try {
			await fs.remove(`${persistDir}/${id}`);
		} catch (err) {
			// console.error(`Error removing dataset ${id} from disk:`, err);
		}
	}
}
