import {Room} from "./Room";
import http from "http";

export class Building {
	private _fullname: string;
	private _shortname: string;
	private _address: string;
	private _lat: number;
	private _lon: number;
	private _href: string;
	private _rooms: Room[];

	constructor() {
		this._fullname = "";
		this._shortname = "";
		this._address = "";
		this._lat = 0;
		this._lon = 0;
		this._href = "";
		this._rooms = [];
	}

	public getBuildingInfo(childNode: any){
		for (const tdNode of childNode.childNodes || []) {
			if (tdNode.nodeName === "td") {
				for (const attr of tdNode.attrs) {
					if (attr.name === "class" && attr.value) {
						let buildInfo: string = attr.value;
						if (buildInfo.endsWith("building-code")) {
							if (tdNode.childNodes){
								for (const tdChildNode of tdNode.childNodes){
									if (tdChildNode.nodeName === "#text" && tdChildNode.value){
										this.shortname = tdNode.childNodes[0].value.trim();
									}
								}

							}
						} else if (buildInfo.endsWith("title")) {
							for (const child of tdNode.childNodes || []) {
								if (child.nodeName === "a") {
									for (const childAttr of child.attrs) {
										if (childAttr.name === "href") {
											this.href = childAttr.value.trim(); // href
											break;
										}
									}
									for (const child2 of child.childNodes) {
										if (child2.nodeName === "#text") {
											this.fullname = child2.value.trim(); // fullness
											break;
										}
									}
									break;
								}
							}
						} else if (buildInfo.endsWith("building-address")) {
							for (const child2 of tdNode.childNodes) {
								if (child2.nodeName === "#text") {
									this.address = child2.value.trim(); // fullness
									break;
								}
							}
						}
					}
				}
			}
		}
	}

	public async getGeolocation() {
		const encodedAddress = encodeURI(this.address);
		const url = `http://cs310.students.cs.ubc.ca:11316/api/v1/project_team125/${encodedAddress}`;

		return new Promise<void>((resolve, reject) => {
			http.get(url, (response: any) => {
				let data = "";

				response.on("data", (chunk: any) => {
					data += chunk;
				});

				response.on("end", () => {
					try {
						const geoData = JSON.parse(data);

						if (geoData.lat && geoData.lon) {
							const latitude = geoData.lat;
							const longitude = geoData.lon;
							this.lat = latitude;
							this.lon = longitude;
							resolve();
						} else {
							const error = geoData.error;
							// console.error(`Error getting geolocation: ${error}`);
							reject(error);
						}
					} catch (error) {
						// console.error(`Error parsing geolocation data: ${error}`);
						reject(error);
					}
				});
			});
		});
	}

	public get fullname(): string {
		return this._fullname;
	}

	public set fullname(value: string) {
		this._fullname = value;
	}

	public get shortname(): string {
		return this._shortname;
	}

	public set shortname(value: string) {
		this._shortname = value;
	}

	public get address(): string {
		return this._address;
	}

	public set address(value: string) {
		this._address = value;
	}

	public get lat(): number {
		return this._lat;
	}

	public set lat(value: number) {
		this._lat = value;
	}

	public get lon(): number {
		return this._lon;
	}

	public set lon(value: number) {
		this._lon = value;
	}

	public get href(): string {
		return this._href;
	}

	public set href(value: string) {
		this._href = value;
	}

	public get rooms(): Room[] {
		return this._rooms;
	}

	public set rooms(value: Room[]) {
		this._rooms = value;
	}


}
