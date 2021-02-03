import { program } from "./mod.ts";

program
  .name("Lovely")
  .version("1.0.0")
  .description("I like my app.")
  .option("-d,--debug:boolean", "Debug my app.");

program
  .command("new|n <name> [where]", "Have a new lovely.")
  .defaultCommand()
  .option("--color:string", "What color do you like?", "red")
  .requiredOption("--confirm:boolean", "Are you sure?")
  .action((args) => {
    console.log("Here you are the lovely!");
    console.log(args);
  });

program
  .parse();
