export default class Option {
  $name = "noname";
  $aliases: string[] = [];
  $type = "string";
  $description = "No description.";
  $required = false;
  $default: unknown;

  constructor(
    optstr: string,
    description?: string,
    $default?: unknown,
  ) {
    if (!/^(\-{1,2}\w+\,)*\-\-\w+(\:\w+)?$/.test(optstr)) {
      throw new Error("Option Defination Error: " + optstr);
    }
    const [name, ...aliases] = (optstr.match(/(?<=\-)\w+/g) as string[])
      .reverse();
    const type = optstr.split(/\:/).reverse()[0];
    this.$name = name;
    this.$aliases = aliases;
    this.$type = type || this.$type;
    this.$description = description || this.$description;
    this.$default = $default || this.$default;
  }
}
