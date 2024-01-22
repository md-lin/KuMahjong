import {Request, Response} from "express";
import {GameLogic} from "../controller/gameLogic";

export class Get {
	private gameLogic: GameLogic;

	constructor(gameLogic: GameLogic) {
		this.gameLogic = gameLogic;
	}

	public async handleResult(req: Request, res: Response) {
		try {
			res.header("Access-Control-Allow-Origin", "*");
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
