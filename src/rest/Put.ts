import {Request, Response} from "express";
import InsightFacade from "../../src/controller/InsightFacade";
import {InsightDatasetKind} from "../controller/IInsightFacade";

export class Put {
	private insightFacade: InsightFacade;

	constructor(insightFacade: InsightFacade) {
		this.insightFacade = insightFacade;
	}

	public async handlePutDataset(req: Request, res: Response) {
		try {
			const id: string = req.params.id;
			const kind: string = req.params.kind;
			let convertedKind: InsightDatasetKind;
			if (kind.toLowerCase() === "sections") {
				convertedKind = InsightDatasetKind.Sections;
			} else if (kind.toLowerCase() === "rooms") {
				convertedKind = InsightDatasetKind.Rooms;
			} else {
				throw new Error("Invalid dataset kind");
			}
			const content: Buffer = req.body;
			const converted64Content: string = content.toString("base64");

			const result = await this.insightFacade.addDataset(id, converted64Content, convertedKind);
			res.status(200).json({result: result});
		} catch (error) {
			res.status(400).json({error: "error"});
		}
	}
}
