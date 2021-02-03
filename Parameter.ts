export default class Parameter {
  $name = "noname";
  $required = false;

  constructor(parastr: string) {
    if (!/(^\<\w+\>$)|(^\[\w+\]$)/.test(parastr)) {
      throw new Error("Parameter Defination Error: " + parastr);
    }
    this.$name = parastr.slice(1, -1);
    this.$required = parastr[0] === "<";
  }
}
