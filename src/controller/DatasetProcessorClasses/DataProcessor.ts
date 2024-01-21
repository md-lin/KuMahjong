
// should return an array of insight results
import {InsightResult} from "../IInsightFacade";
import {Result} from "../queryEngine/DatasetInterface";

export class DataProcessor {
	public static processData(data: InsightResult[], inputID: string) {
		let results: InsightResult[] = [];
		for (const section of data) {
			let result = new Result();
			const id = inputID;
			for (const key of Object.keys(section)) {
				const value = section[key];
				switch (key) {
					case "id":
						result[id + "_uuid"] = value;
						break;
					case "Course":
						result[id + "_id"] = value;
						break;
					case "Title":
						result[id + "_title"] = value;
						break;
					case "Professor":
						result[id + "_instructor"] = value;
						break;
					case "Subject":
						result[id + "_dept"] = value;
						break;
					case "Year":
						result[id + "_year"] = value;
						break;
					case "Avg":
						result[id + "_avg"] = value;
						break;
					case "Pass":
						result[id + "_pass"] = value;
						break;
					case "Fail":
						result[id + "_fail"] = value;
						break;
					case "Audit":
						result[id + "_audit"] = value;
						break;
					default:
						result[id + "_" + key] = value;
						break;
				}
			}
			results.push(result);
		}
		return results;
	}
}
