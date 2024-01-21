import {Request, Response} from "express";
import InsightFacade from "../../src/controller/InsightFacade";
import {InsightDatasetKind, InsightError, NotFoundError} from "../controller/IInsightFacade";

export class Delete {
	private insightFacade: InsightFacade;

	constructor(insightFacade: InsightFacade) {
		this.insightFacade = insightFacade;
	}

	public async handleDeleteDataset(req: Request, res: Response) {
		try {
			const id: string = req.params.id;
			const result = await this.insightFacade.removeDataset(id);
			res.status(200).json({result: result});
		} catch (error) {
			if (error instanceof NotFoundError) {
				res.status(404).json({error: "(error as Error).message"});
			} else {
				res.status(400).json({error: "(error as Error).message"});
			}
		}
	}
}
