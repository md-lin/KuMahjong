import {Request, Response} from "express";
import InsightFacade from "../../src/controller/InsightFacade";
import {InsightDatasetKind} from "../controller/IInsightFacade";

export class Get {
	private insightFacade: InsightFacade;

	constructor(insightFacade: InsightFacade) {
		this.insightFacade = insightFacade;
	}

	public async handleGetDataset(req: Request, res: Response) {
		try {
			const result = await this.insightFacade.listDatasets();
			res.status(200).json({result: result});
		} catch (error) {
			// this should never reject
			res.status(200).json({error: "(error as Error).message"});
		}
	}

	public async handleResult(req: Request, res: Response) {
		try {
			const result = {hello: "yer"};
			res.status(200).json({result: result});
		} catch (error) {
			// this should never reject
			res.status(200).json({error: "(error as Error).message"});
		}
	}
}
