import {Request, Response} from "express";
import InsightFacade from "../controller/InsightFacade";

export class Post {
	private insightFacade: InsightFacade;

	constructor(insightFacade: InsightFacade) {
		this.insightFacade = insightFacade;
	}

	public async post(req: Request, res: Response) {
		try {
			// console.log(req.body);
			// const query = JSON.parse(req.body);
			// const query = JSON.parse(req.params.query);
			const query = req.body;
			const response = await this.insightFacade.performQuery(query);
			res.status(200).json({result: response});
		} catch (err) {
			// console.log(err);
			res.status(400).json({error: "err"});
		}
	}
}
