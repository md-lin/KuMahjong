import express, {Application, Request, Response} from "express";
// import cors from "cors";
import * as http from "http";
import {Echo} from "./Echo";
import {Get} from "./Get";
// import cors from "cors";
import {GameLogic} from "../controller/gameLogic";

export default class Server {
	private readonly port: number;
	private express: Application;
	private server: http.Server | undefined;
	private get: Get;
	private gameLogic: GameLogic;

	constructor(port: number) {
		console.info(`Server::<init>( ${port} )`);
		this.port = port;
		this.express = express();

		// CHANGED LINES
		this.gameLogic = new GameLogic(["0", "1", "2", "3"]);
		this.get = new Get(this.gameLogic);


		// this.registerMiddleware();
		this.registerRoutes();

		// NOTE: you can serve static frontend files in from your express server
		// by uncommenting the line below. This makes files in ./frontend/public
		// accessible at http://localhost:<port>/
		this.express.use(express.static("./my-app/src"));
	}

	/**
	 * Starts the server. Returns a promise that resolves if success. Promises are used
	 * here because starting the server takes some time and we want to know when it
	 * is done (and if it worked).
	 *
	 * @returns {Promise<void>}
	 */
	public start(): Promise<void> {
		return new Promise((resolve, reject) => {
			console.info("Server::start() - start");
			if (this.server !== undefined) {
				console.error("Server::start() - server already listening");
				reject();
			} else {
				this.server = this.express.listen(this.port, () => {
					console.info(`Server::start() - server listening on port: ${this.port}`);
					resolve();
				}).on("error", (err: Error) => {
					// catches errors in server start
					console.error(`Server::start() - server ERROR: ${err.message}`);
					reject(err);
				});
			}
		});
	}

	/**
	 * Stops the server. Again returns a promise so we know when the connections have
	 * actually been fully closed and the port has been released.
	 *
	 * @returns {Promise<void>}
	 */
	public stop(): Promise<void> {
		console.info("Server::stop()");
		return new Promise((resolve, reject) => {
			if (this.server === undefined) {
				console.error("Server::stop() - ERROR: server not started");
				reject();
			} else {
				this.server.close(() => {
					console.info("Server::stop() - server closed");
					resolve();
				});
			}
		});
	}

	// Registers middleware to parse request before passing them to request handlers
	private registerMiddleware() {
		// JSON parser must be place before raw parser because of wildcard matching done by raw parser below
		this.express.use(express.json());
		this.express.use(express.raw({type: "application/*", limit: "10mb"}));

		const corsOptions = {
			origin: "http://localhost:3000", // Add the origin of your frontend
			methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
			credentials: true,
			optionsSuccessStatus: 204,
		};

		// this.express.use(cors(corsOptions));

		// this.express.use(cors({origin: "http://localhost:4321"}));
		// this.express.options("*", cors());
		// enable cors in request headers to allow cross-origin HTTP requests
		// this.express.use(cors());
	}

	// Registers all request handlers to routes
	private registerRoutes() {
		// This is an example endpoint this you can invoke by accessing this URL in your browser:
		// http://localhost:4321/echo/hello
		this.express.get("/echo/:msg", Echo.echo);

		// this.express.options("/", cors());
		this.express.get("/hello", this.get.handleResult.bind(this.get));
		this.express.get("/discard/:id", this.get.handleDiscard.bind(this.get));

	}


}
