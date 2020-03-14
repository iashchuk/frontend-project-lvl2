import commander from "commander";
import fs from "fs";
import path from "path";
import process from "process";
import _ from "lodash";

const program = new commander.Command();

const compareData = (data1, data2) => {
    const keys = _.union(Object.keys(data1), Object.keys(data2));

    const process = key => {
        const firstValue = data1[key];
        const secondValue = data2[key];

        const info = { key, values: [firstValue, secondValue] };

        if (_.has(data1, key) && !_.has(data2, key)) {
            return { type: "removed", ...info };
        }
        if (!_.has(data1, key) && _.has(data2, key)) {
            return { type: "added", ...info };
        }
        if (firstValue !== secondValue) {
            return { type: "changed", ...info };
        }
        return { type: "unchanged", ...info };
    };

    return keys.map(process);
};

const renderDiff = element => {
    const [firstValue, secondValue] = element.values;

    switch (element.type) {
        case "removed":
            return `- ${element.key}: ${firstValue}`;

        case "added":
            return `+ ${element.key}: ${secondValue}`;

        case "changed":
            return `- ${element.key}: ${firstValue}\n+ ${element.key}: ${secondValue}`;

        case "unchanged":
            return `${element.key}: ${firstValue}`;

        default:
            return new Error("Nonexistent type");
    }
};

const getData = config => {
    const filepath = path.resolve(config);
    const data = fs.readFileSync(config);
    return JSON.parse(data);
};

const genDiff = (pathToFile1, pathToFile2) => {
    const before = getData(pathToFile1);
    const after = getData(pathToFile2);
    const diff = compareData(before, after);
    return diff.map(renderDiff).join("\n");
};

export default () => {
    program.version("1.0.0");
    program.description("Compares two configuration files and shows a difference.");
    program.option("-f, --format [type]", "output format");
    program.arguments("<firstConfig> <secondConfig>");
    program.action((firstConfig, secondConfig) => {
        const diff = genDiff(firstConfig, secondConfig);
        console.log(diff);
    });
    program.parse(process.argv);
};
