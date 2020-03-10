import commander from "commander";

const program = new commander.Command();

export default () => {
    program.version("1.0.0");
    program.description("Compares two configuration files and shows a difference.");
    program.option("-f, --format [type]", "output format");
    program.arguments("<firstConfig> <secondConfig>");
    program.action((firstConfig, secondConfig) => {
        console.log(firstConfig, secondConfig);
    });
    program.parse(process.argv);
};
