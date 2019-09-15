import { promises as fs } from "fs";

import { GITHUB_EVENT_PATH } from "./constants";

const eventDetails = async () => JSON.parse(await fs.readFile(GITHUB_EVENT_PATH as string, { encoding: "utf8" }));

export default eventDetails;
