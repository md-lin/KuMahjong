export class Room {
	private _fullname: string; // building
	private _shortname: string; // building
	private _number: string;
	private _name: string;
	private _address: string; // building
	private _lat: number; // building
	private _lon: number; // building
	private _seats: number;
	private _type: string;
	private _furniture: string;
	private _href: string;

	constructor() {
		this._fullname = "";
		this._shortname = "";
		this._number = "";
		this._name = "";
		this._address = "";
		this._lat = 0;
		this._lon = 0;
		this._seats = 0;
		this._type = "";
		this._furniture = "";
		this._href = "";
	}

	public getRoomInfo(childNode: any) {
		for (const tdNode of childNode.childNodes || []) {
			if (tdNode.nodeName === "td") {
				for (const attr of tdNode.attrs) {
					if (attr.name === "class" && attr.value) {
						let roomInfo: string = attr.value;
						if (roomInfo.endsWith("room-capacity")) {
							if (tdNode.childNodes) {
								for (const tdChildNode of tdNode.childNodes) {
									if (tdChildNode.nodeName === "#text" && tdChildNode.value) {
										this.seats = tdChildNode.value.trim(); // seats
									}
								}
							}
						} else if (roomInfo.endsWith("room-number")) {
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
											this.number = child2.value.trim(); // number
											break;
										}
									}
									break;
								}
							}
						} else if (roomInfo.endsWith("room-furniture")) {
							for (const child2 of tdNode.childNodes) {
								if (child2.nodeName === "#text") {
									this.furniture = child2.value.trim(); // furniture
									break;
								}
							}
						} else if (roomInfo.endsWith("room-type")) {
							this.roomTypeInfo(tdNode);
						}
					}
				}
			}
		}
	}

	public roomTypeInfo(tdNode: any){
		for (const child2 of tdNode.childNodes) {
			if (child2.nodeName === "#text") {
				this.type = child2.value.trim(); // type
				break;
			}
		}
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

	public get number(): string {
		return this._number;
	}

	public set number(value: string) {
		this._number = value;
	}

	public get name(): string {
		return this._name;
	}

	public set name(value: string) {
		this._name = value;
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

	public get seats(): number {
		return this._seats;
	}

	public set seats(value: number | string) {
		if (typeof value === "string") {
			this._seats = Number(value);
		} else {
			this._seats = value as number;
		}
	}


	public get type(): string {
		return this._type;
	}

	public set type(value: string) {
		this._type = value;
	}

	public get furniture(): string {
		return this._furniture;
	}

	public set furniture(value: string) {
		this._furniture = value;
	}

	public get href(): string {
		return this._href;
	}

	public set href(value: string) {
		this._href = value;
	}
}
