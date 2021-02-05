import Parameter from "./Parameter.ts";
import Option from "./Option.ts";
import { parse } from "../deps.ts";

export default class Command {
  $father?: Command;
  $cmdstr: string;
  $name: string;
  $aliases: string[];
  $version: string;
  $description: string;
  $parameters: Parameter[];
  $options: Option[];
  $subcommands: Command[];
  $action: (args: Record<string, unknown>) => void;

  constructor(cmdstr: string, description?: string) {
    if (!/^\w+(\|\w+)*(\s\<\w+\>)*(\s\[\w+\])*$/.test(cmdstr)) {
      throw new Error("Command Defination Error: " + cmdstr);
    }
    this.$cmdstr = cmdstr;
    const [names, ...paras] = cmdstr.split(/\s/g);
    const [name, ...aliases] = names.split(/\|/g);
    this.$name = name;
    this.$aliases = aliases;
    this.$version = "0.0.0";
    this.$description = description || "No description.";
    this.$parameters = paras.map((para) => new Parameter(para));
    this.$options = [];
    this.$subcommands = [];
    this.$action = (args: Record<string, unknown>) => {
      console.log(args);
    };
  }

  public name(name: string): Command {
    this.$name = name;
    return this;
  }

  public version(version: string): Command {
    this.$version = version;
    return this;
  }

  public description(description: string): Command {
    this.$description = description;
    return this;
  }

  public action(action: (args: Record<string, unknown>) => void): Command {
    this.$action = action;
    return this;
  }

  public command(cmdstr: string, description?: string): Command {
    const cmd = new Command(cmdstr, description);
    cmd.$father = this;
    cmd.$version = this.$version;
    this.$options.forEach((opt) => {
      cmd.$options.push(opt);
    });
    this.$subcommands.push(cmd);
    return cmd;
  }

  public option(
    optstr: string,
    description?: string,
    $default?: unknown,
  ): Command {
    const opt = new Option(optstr, description, $default);
    this.$options.push(opt);
    return this;
  }

  public requiredOption(
    optstr: string,
    description?: string,
  ): Command {
    const opt = new Option(optstr, description);
    opt.$required = true;
    this.$options.push(opt);
    return this;
  }

  public defaultCommand(): Command {
    if (this.$father) {
      this.$father.action(() => {
        this.parse();
      });
    }
    return this;
  }

  public parse(source = Deno.args): void {
    const name: string = source[0];
    for (const cmd of this.$subcommands) {
      if (cmd.$name === name) return cmd.parse(source.slice(1));
      for (const alias of cmd.$aliases) {
        if (alias === name) return cmd.parse(source.slice(1));
      }
    }

    const flagOptions: {
      "--": boolean;
      alias: Record<string, string[]>;
      boolean: string[];
      string: string[];
      default: Record<string, unknown>;
    } = {
      "--": true,
      alias: {},
      boolean: [],
      string: [],
      default: {},
    };

    for (const opt of this.$options) {
      if (opt.$type === "string") flagOptions.string.push(opt.$name);
      if (opt.$type === "boolean") flagOptions.boolean.push(opt.$name);
      flagOptions.alias[opt.$name] = opt.$aliases;
      flagOptions.default[opt.$name] = opt.$default;
    }

    const parsed = parse(source, flagOptions);

    for (const key in this.$parameters) {
      parsed[this.$parameters[key].$name] = parsed._[key];
    }

    parsed._ = parsed._.slice(this.$parameters.length);

    this.$parameters.forEach((para) => {
      if (!parsed[para.$name] && para.$required) {
        throw new Error("Parameter " + para.$name + " is required.");
      }
    });

    this.$options.forEach((opt) => {
      if (!parsed[opt.$name] && opt.$required) {
        throw new Error("Option --" + opt.$name + " is required.");
      }
    });

    this.$action(parsed);
  }
}
