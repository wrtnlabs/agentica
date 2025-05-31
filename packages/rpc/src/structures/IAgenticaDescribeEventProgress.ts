export interface IAgenticaDescribeEventProgress {
  type: "describeMessageProgress";
  sequence: number;
  text: string;
  done: boolean;
}
