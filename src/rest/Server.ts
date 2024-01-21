import express, {Application, Request, Response} from "express";
import cors from "cors";
import * as http from "http";
import {Echo} from "./Echo";
import {Post} from "./Post";
import {Put} from "./Put";
import InsightFacade from "../../src/controller/InsightFacade";
import {Delete} from "./Delete";
import {Get} from "./Get";
// import cors from "cors";

export default class Server {
	private readonly port: number;
	private express: Application;
	private server: http.Server | undefined;
	private insightFacade: InsightFacade;
	private put: Put;
	private post: Post;
	private delete: Delete;
	private get: Get;

	constructor(port: number) {
		console.info(`Server::<init>( ${port} )`);
		this.port = port;
		this.express = express();
		this.insightFacade = new InsightFacade();
		this.put = new Put(this.insightFacade);
		this.post = new Post(this.insightFacade);
		this.delete = new Delete(this.insightFacade);
		this.get = new Get(this.insightFacade);


		this.registerMiddleware();
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

		this.express.use(cors(corsOptions));

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

		this.express.put("/dataset/:id/:kind", this.put.handlePutDataset.bind(this.put));
		this.express.post("/query", this.post.post.bind(this.post));
		this.express.get("/datasets", this.get.handleGetDataset.bind(this.get));
		this.express.delete("/dataset/:id", this.delete.handleDeleteDataset.bind(this.delete));
		this.express.options("/", cors());
		this.express.get("/hello", this.get.handleResult.bind(this.get));

	}


}
