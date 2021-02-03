# deno-bark

```typescript
import { program } from "https://deno.land/x/bark@v0.3.0/mod.ts";

// father
program
  .name("Lovely")
  .version("1.0.0")
  .description("I like my app.")
  // Option Defination: -alias,-alias,--name:type, default type is string
  // Subcommand inherits it's father command's option.
  .option("-d,--debug:boolean", "Debug my app.");
  // Only string and boolean works!

// child
program
  // Command Defination: name|alias|alias <required_parameter> [optional_parameter]
  .command("new|n <name> [where]", "Have a new lovely.")
  // Set current command as default command.
  .defaultCommand()
  // "red" is the default value for "--color" if not specified.
  .option("--color:string", "What color do you like?", "red")
  // requiredOption must be specified so that it doesn't have a default value.
  .requiredOption("--confirm:boolean", "Are you sure?")
  // define the callback function which takes a all-in-one object.
  .action((args) => {
    console.log("Here you are the lovely!");
    console.log(args);
  });

// run!
program
  .parse();
```
