import commander from "commander";

const program = new commander.Command();

export default () => {
    program.version("1.0.0");
    program.description("Compares two configuration files and shows a difference.");
    program.parse(process.argv);
};
