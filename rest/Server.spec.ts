// import Server from "../../src/rest/Server";
// import InsightFacade from "../../src/controller/InsightFacade";
//
// import {expect} from "chai";
// import request, {Response} from "supertest";
// import {getContentFromArchives, clearDisk} from "../resources/archives/TestUtil";
// import fs from "fs-extra";
//
// const SERVER_URL: string = "http://localhost:4321";
//
// const someCoursesPath = "test/resources/archives/2ValidCourses.zip";
// const someCourses = fs.readFileSync(someCoursesPath);
//
// const allRooms = fs.readFileSync("test/resources/archives/campus.zip");
//
// describe("Facade D3", function () {
// 	let server: Server;
//
// 	before(function () {
// 		clearDisk();
// 		server = new Server(4321);
// 		// start server here once and handle errors properly
// 		return server.start().then(() => {
// 			console.info("App::initServer() - started");
// 		}).catch((err: Error) => {
// 			console.error(`App::initServer() - ERROR: ${err.message}`);
// 		});
// 	});
//
// 	after(function () {
// 		// stop server here once!
// 		return server.stop().then(() => {
// 			console.info("server stopped");
// 		}).catch((err: Error) => {
// 			console.error(`ERROR: ${err.message}`);
// 		});
// 	});
//
// 	beforeEach(function () {
// 		// might want to add some process logging here to keep track of what is going on
// 	});
//
// 	afterEach(function () {
// 		// might want to add some process logging here to keep track of what is going on
// 	});
//
// 	// Sample on how to format PUT requests
// 	/*
// 	it("PUT test for courses dataset", function () {
// 		try {
// 			return request(SERVER_URL)
// 				.put(ENDPOINT_URL)
// 				.send(ZIP_FILE_DATA)
// 				.set("Content-Type", "application/x-zip-compressed")
// 				.then(function (res: Response) {
// 					// some logging here please!
// 					expect(res.status).to.be.equal(200);
// 				})
// 				.catch(function (err) {
// 					// some logging here please!
// 					expect.fail();
// 				});
// 		} catch (err) {
// 			// and some more logging here!
// 		}
// 	});
// 	*/
//
// 	// jasmine's PUT test
// 	it("PUT test for small courses dataset", async function () {
// 		const zipFilePath = "test/resources/archives/2ValidCourses.zip";
// 		const zipFileContent = fs.readFileSync(zipFilePath);
// 		try {
// 			const res = await request("http://localhost:4321")
// 				.put("/dataset/smallSections/Sections")
// 				.send(zipFileContent)
// 				.set("Content-Type", "application/x-zip-compressed");
// 			console.log(res.status);
//
// 			expect(res.status).to.be.equal(200);
// 		} catch (err) {
// 			console.log("caught in the try catch: " + err);
// 			expect.fail();
// 		}
// 	});
//
// 	// above example in use
// 	it("PUT test for courses dataset", function () {
// 		const zipFilePath = "test/resources/archives/pair.zip";
// 		const zipFileContent = fs.readFileSync(zipFilePath);
// 		try {
// 			return request("http://localhost:4321")
// 				.put("/dataset/sections/Sections")
// 				.send(zipFileContent)
// 				.set("Content-Type", "application/x-zip-compressed")
// 				.then(function (res: Response) {
// 					// some logging here please!
// 					console.log(res.status);
// 					console.log(res.body.result);
// 					expect(res.status).to.be.equal(200);
// 					// expect(res.body.result).to.deep.equal("sections");
// 				})
// 				.catch(function (err) {
// 					// some logging here please!
// 					console.log("catching the promise: (PUT test for courses dataset) " + err);
// 					expect.fail();
// 				});
// 		} catch (err) {
// 			// and some more logging here!
// 			console.log("caught in the try catch: " + err);
// 		}
// 	});
//
//
// 	it("PUT test for rooms dataset", function () {
// 		const queryRooms = fs.readFileSync("test/resources/archives/campus.zip");
// 		let result: Response;
// 		try {
// 			return request("http://localhost:4321")
// 				.put("/dataset/rooms/Rooms")
// 				.send(queryRooms)
// 				.set("Content-Type", "application/x-zip-compressed")
// 				.then(function (res: Response) {
// 					// some logging here please!
// 					console.log(res.status);
// 					console.log(res.body.result);
// 					expect(res.status).to.be.equal(200);
// 					// TODO: add a verification that the result is the array returned by addDataset
// 					// expect(res.body).to.
// 				})
// 				.catch(function (err) {
// 					// some logging here please!
// 					console.log("catching the promise: (PUT test for rooms dataset) " + err);
// 					expect.fail();
// 				});
// 		} catch (err) {
// 			// and some more logging here!
// 			console.log("caught in the try catch: " + err);
// 		}
// 	});
//
// 	it("PUT test invalid ID - duplicate ID", function () {
// 		const queryRooms = fs.readFileSync("test/resources/archives/campus.zip");
// 		let result: Response;
// 		try {
// 			return request("http://localhost:4321")
// 				.put("/dataset/rooms/Rooms")
// 				.send(queryRooms)
// 				.set("Content-Type", "application/x-zip-compressed")
// 				.then(function (res: Response) {
// 					// some logging here please!
// 					console.log(res.status);
// 					expect(res.status).to.be.equal(400);
// 					// TODO: add a verification that the result is the array returned by addDataset
// 					// expect(res.body).to.
// 				})
// 				.catch(function (err) {
// 					// some logging here please!
// 					console.log("catching the promise: (PUT test for rooms dataset) " + err);
// 					expect.fail();
// 				});
// 		} catch (err) {
// 			// and some more logging here!
// 			console.log("caught in the try catch: " + err);
// 		}
// 	});
//
// 	it("PUT test invalid ID - underscore", function () {
// 		const queryRooms = fs.readFileSync("test/resources/archives/campus.zip");
// 		let result: Response;
// 		try {
// 			return request("http://localhost:4321")
// 				.put("/dataset/rooms_/Rooms")
// 				.send(queryRooms)
// 				.set("Content-Type", "application/x-zip-compressed")
// 				.then(function (res: Response) {
// 					// some logging here please!
// 					console.log(res.status);
// 					expect(res.status).to.be.equal(400);
// 					// TODO: add a verification that the result is the array returned by addDataset
// 					// expect(res.body).to.
// 				})
// 				.catch(function (err) {
// 					// some logging here please!
// 					console.log("catching the promise: (PUT test for rooms dataset) " + err);
// 					expect.fail();
// 				});
// 		} catch (err) {
// 			// and some more logging here!
// 			console.log("caught in the try catch: " + err);
// 		}
// 	});
//
// 	it("DELETE test for sections dataset success", function () {
// 		// NOTE: requires a dataset to have already been added
// 		try {
// 			return request("http://localhost:4321")
// 				.delete("/dataset/sections")
// 				.then(function (res: Response) {
// 					// some logging here please!
// 					console.log(res.status);
// 					expect(res.status).to.be.equal(200);
// 					// TODO: add a verification that the result is the array returned by deleteDataset
// 					expect(res.body.result).to.deep.equal("sections");
// 				})
// 				.catch(function (err) {
// 					// some logging here please!
// 					console.log("catching the promise: (DELETE test for sections dataset success)" + err);
// 					expect.fail();
// 				});
// 		} catch (err) {
// 			// and some more logging here!
// 			console.log("caught in the try catch: " + err);
// 		}
// 	});
//
// 	it("DELETE test for sections dataset not found error", function () {
// 		// NOTE: requires a dataset to have already been added
// 		try {
// 			return request("http://localhost:4321")
// 				.delete("/dataset/sections")
// 				.then(function (res: Response) {
// 					// some logging here please!
// 					console.log(res.status);
// 					expect(res.status).to.be.equal(404);
// 				})
// 				.catch(function (err) {
// 					// some logging here please!
// 					console.log("catching the promise: (DELETE test for sections dataset not found) " + err);
// 					expect.fail();
// 				});
// 		} catch (err) {
// 			// and some more logging here!
// 			console.log("caught in the try catch: " + err);
// 		}
// 	});
//
// 	it("DELETE test for sections dataset insight error (invalid id)", function () {
// 		// NOTE: requires a dataset to have already been added
// 		try {
// 			return request("http://localhost:4321")
// 				.delete("/dataset/sections_")
// 				.then(function (res: Response) {
// 					// some logging here please!
// 					console.log(res.status);
// 					expect(res.status).to.be.equal(400);
// 				})
// 				.catch(function (err) {
// 					// some logging here please!
// 					console.log("catching the promise: (DELETE test for sections insight error (invalid id)) " + err);
// 					expect.fail();
// 				});
// 		} catch (err) {
// 			// and some more logging here!
// 			console.log("caught in the try catch: " + err);
// 		}
// 	});
//
// 	it("GET test for courses dataset", function () {
// 		try {
// 			return request("http://localhost:4321")
// 				.get("/datasets")
// 				.then(function (res: Response) {
// 					// some logging here please!
// 					console.log(res.status);
// 					expect(res.status).to.be.equal(200);
// 					// TODO: add a verification that the result is the array returned by listDataset
// 					// expect(res.body.result).to.
// 				})
// 				.catch(function (err) {
// 					// some logging here please!
// 					console.log("catching the promise: (GET test for courses) " + err);
// 					expect.fail();
// 				});
// 		} catch (err) {
// 			// and some more logging here!
// 			console.log("caught in the try catch: " + err);
// 		}
// 	});
//
// 	// The other endpoints work similarly. You should be able to find all instructions at the supertest documentation
// 	it("POST test for courses dataset", function () {
// 		const expectedResult = [
// 			{
// 				sections_instructor: "watai, fumiko",
// 				sections_uuid: "33",
// 				sections_title: "begin japn i"
// 			}
// 		];
// 		const payload = {
// 			WHERE: {
// 				IS: {
// 					sections_uuid: "33"
// 				}
// 			},
// 			OPTIONS: {
// 				COLUMNS: [
// 					"sections_instructor",
// 					"sections_uuid",
// 					"sections_title"
// 				],
// 				ORDER: "sections_instructor"
// 			}
// 		};
// 		try {
// 			return request("http://localhost:4321")
// 				.post("/query")
// 				.send(payload)
// 				.set("Content-Type", "application/json")
// 				.then(function (res: Response) {
// 					// some logging here please!
// 					console.log(res.status);
// 					console.log(res.body.result);
// 					expect(res.status).to.be.equal(200);
// 					// not sure if this is correct lol
// 					// expect(res.body.result).to.have.deep.members(expectedResult);
// 				})
// 				.catch(function (err) {
// 					// some logging here please!
// 					console.log("catching the promise: (POST test)" + err);
// 					expect.fail();
// 				});
// 		} catch (err) {
// 			// and some more logging here!
// 			console.log("caught in the try catch: " + err);
// 		}
// 	});
//
// 	it("POST test for small courses dataset", function () {
// 		try {
// 			const payload = {
// 				WHERE: {
// 					IS: {
// 						sections_uuid: "12218"
// 					}
// 				},
// 				OPTIONS: {
// 					COLUMNS: [
// 						"smallSections_instructor",
// 						"smallSections_uuid",
// 						"smallSections_title"
// 					],
// 					ORDER: "smallSections_instructor"
// 				}
// 			};
// 			return request("http://localhost:4321")
// 				.post("/query")
// 				.send(payload)
// 				.set("Content-Type", "application/json")
// 				.then(function (res: Response) {
// 					// some logging here please!
// 					console.log(res.status);
// 					expect(res.status).to.be.equal(200);
// 					// expect(res.body.result).to.have.deep.members(expectedResult);
// 				})
// 				.catch(function (err) {
// 					// some logging here please!
// 					console.log("catching the promise: (POST test)" + err);
// 					expect.fail();
// 				});
// 		} catch (err) {
// 			// and some more logging here!
// 			console.log("caught in the try catch: " + err);
// 		}
// 	});
//
// 	// TODO: double check the single quotes vs double quotes
// 	// this test might run forever -> check
// 	it("POST test - invalid query: IS uuid does not have quotation marks", function () {
// 		const expectedResult = [
// 			{
// 				sections_instructor: "watai, fumiko",
// 				sections_uuid: "33",
// 				sections_title: "begin japn i"
// 			}
// 		];
// 		const payload = {
// 			WHERE: {
// 				IS: {
// 					sections_uuid: 33
// 				}
// 			},
// 			OPTIONS: {
// 				COLUMNS: [
// 					"sections_instructor",
// 					"sections_uuid",
// 					"sections_title"
// 				],
// 				ORDER: "sections_instructor"
// 			}
// 		};
// 		try {
// 			return request("http://localhost:4321")
// 				.post("/query")
// 				.send(payload)
// 				.set("Content-Type", "application/json")
// 				.then(function (res: Response) {
// 					// some logging here please!
// 					console.log(res.status);
// 					expect(res.status).to.be.equal(400);
// 					// expect(res.body.result).to.have.deep.members(expectedResult);
// 				})
// 				.catch(function (err) {
// 					// some logging here please!
// 					console.log("catching the promise: (POST test)" + err);
// 					expect.fail();
// 				});
// 		} catch (err) {
// 			// and some more logging here!
// 			console.log("caught in the try catch: " + err);
// 		}
// 	});
//
// 	it("POST test - invalid query: eq lowercase", function () {
// 		const expectedResult = [
// 			{
// 				sections_instructor: "watai, fumiko",
// 				sections_uuid: "33",
// 				sections_title: "begin japn i"
// 			}
// 		];
// 		const query = {
// 			WHERE: {
// 				eq: {
// 					sections_avg: 99
// 				}
// 			},
// 			OPTIONS: {
// 				COLUMNS: [
// 					"sections_title",
// 					"sections_id",
// 					"sections_avg"
// 				]
// 			}
// 		};
// 		try {
// 			return request("http://localhost:4321")
// 				.post("/query")
// 				.send(query)
// 				.set("Content-Type", "application/json")
// 				.then(function (res: Response) {
// 					// some logging here please!
// 					console.log(res.status);
// 					expect(res.status).to.be.equal(400);
// 					// expect(res.body.result).to.have.deep.members(expectedResult);
// 				})
// 				.catch(function (err) {
// 					// some logging here please!
// 					console.log("catching the promise: (POST test)" + err);
// 					expect.fail();
// 				});
// 		} catch (err) {
// 			// and some more logging here!
// 			console.log("caught in the try catch: " + err);
// 		}
// 	});
// });
//
// describe("testing remove from map", function () {
// 	let server: Server;
//
// 	before(function () {
// 		clearDisk();
// 		server = new Server(4321);
// 		// start server here once and handle errors properly
// 		return server.start().then(() => {
// 			console.info("App::initServer() - started");
// 		}).catch((err: Error) => {
// 			console.error(`App::initServer() - ERROR: ${err.message}`);
// 		});
// 	});
//
// 	after(function () {
// 		// stop server here once!
// 		return server.stop().then(() => {
// 			console.info("server stopped");
// 		}).catch((err: Error) => {
// 			console.error(`ERROR: ${err.message}`);
// 		});
// 	});
//
// 	beforeEach(function () {
// 		// might want to add some process logging here to keep track of what is going on
// 	});
//
// 	afterEach(function () {
// 		// might want to add some process logging here to keep track of what is going on
// 	});
//
// // Sample on how to format PUT requests
// 	it("PUT test for courses dataset", function () {
// 		try {
// 			return request(SERVER_URL)
// 				.put("/dataset/rooms/Rooms")
// 				.send(allRooms)
// 				.set("Content-Type", "application/x-zip-compressed")
// 				.then(function (res: Response) {
//                     // some logging here please!
// 					expect(res.status).to.be.equal(200);
// 				})
// 				.catch(function (err) {
//                     // some logging here please!
// 					expect.fail();
// 				});
// 		} catch (err) {
//             // and some more logging here!
// 		}
// 	});
//
// 	// try to query rooms here
//
// 	it("PUT test for courses dataset", function () {
// 		try {
// 			return request(SERVER_URL)
// 				.put("/dataset/sections/Sections")
// 				.send(someCourses)
// 				.set("Content-Type", "application/x-zip-compressed")
// 				.then(function (res: Response) {
// 					// some logging here please!
// 					expect(res.status).to.be.equal(200);
// 				})
// 				.catch(function (err) {
// 					// some logging here please!
// 					expect.fail();
// 				});
// 		} catch (err) {
// 			// and some more logging here!
// 		}
// 	});
//
// 	// try to query courses here
//
// 	// then remove courses
//
// 	// try to query courses (should fail)
//
// 	// try to query rooms
//
// 	// remove rooms
//
// 	// try to query rooms (should fail)
//
// });
