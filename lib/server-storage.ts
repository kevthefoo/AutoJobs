import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data.json");

interface DataStore {
    projects: any[];
    drafts: any[];
    ideas: any[];
    templates: any[];
    productions: any[];
}

const DEFAULT_DATA: DataStore = {
    projects: [],
    drafts: [],
    ideas: [],
    templates: [],
    productions: [],
};

export function readData(): DataStore {
    try {
        if (!fs.existsSync(DATA_FILE)) {
            fs.writeFileSync(DATA_FILE, JSON.stringify(DEFAULT_DATA, null, 2));
            return { ...DEFAULT_DATA };
        }
        const raw = fs.readFileSync(DATA_FILE, "utf-8");
        return JSON.parse(raw);
    } catch {
        return { ...DEFAULT_DATA };
    }
}

export function writeData(data: DataStore): void {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

export type EntityKey = keyof DataStore;
