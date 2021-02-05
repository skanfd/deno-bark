export default class Parameter {
  $parastr: string;
  $name: string;
  $required: boolean;

  constructor(parastr: string) {
    if (!/(^\<\w+\>$)|(^\[\w+\]$)/.test(parastr)) {
      throw new Error("Parameter Defination Error: " + parastr);
    }
    this.$parastr = parastr;
    this.$name = parastr.slice(1, -1);
    this.$required = parastr[0] === "<";
  }
}
