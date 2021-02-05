export default class Option {
  $optstr: string;
  $name: string;
  $aliases: string[];
  $type: string;
  $description: string;
  $required: boolean;
  $default: unknown;

  constructor(
    optstr: string,
    desciption?: string,
    $default?: unknown,
  ) {
    if (!/^(\-{1,2}\w+\,)*\-\-\w+(\:\w+)?$/.test(optstr)) {
      throw new Error("Option Defination Error: " + optstr);
    }
    this.$optstr = optstr;
    const [name, ...aliases] = (optstr.match(/(?<=\-)\w+/g) as string[])
      .reverse();
    this.$name = name;
    this.$aliases = aliases;
    this.$type = optstr.split(/\:/).reverse()[0] || "string";
    this.$description = desciption || "No description.";
    this.$required = false;
    this.$default = $default;
  }
}
