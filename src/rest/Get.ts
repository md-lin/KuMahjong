import {Request, Response} from "express";
import InsightFacade from "../../src/controller/InsightFacade";
import {InsightDatasetKind} from "../controller/IInsightFacade";
import {GameLogic} from "../controller/gameLogic";

export class Get {
	private insightFacade: InsightFacade;
	private gameLogic: GameLogic;

	constructor(insightFacade: InsightFacade, gameLogic: GameLogic) {
		this.insightFacade = insightFacade;
		this.gameLogic = gameLogic;
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

	public async handleDiscard(req: Request, res: Response) {
		try {
			const id: string = req.params.id;
			const result = this.gameLogic.discard(id);
			res.status(200).json({result: result});
		} catch (error) {
			// this should never reject
			res.status(200).json({error: "(error as Error).message"});
		}
	}
}
