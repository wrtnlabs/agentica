import { AgenticaTokenUsage } from "@agentica/core";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React from "react";


export interface IProps {
  usage: AgenticaTokenUsage;
}

export const AgenticaChatTokenUsageSideMovie = (
  props: IProps,
) => {
  const price: IPrice = compute(props.usage);
  return (
    <React.Fragment>
      <Typography variant="h5"> Token Usage </Typography>
      <hr />
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Type</TableCell>
            <TableCell>Token Usage</TableCell>
            <TableCell>Price</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>Total</TableCell>
            <TableCell>
              {props.usage.aggregate.total.toLocaleString()}
            </TableCell>
            <TableCell>${price.total.toLocaleString()}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Input</TableCell>
            <TableCell>
              {props.usage.aggregate.input.total.toLocaleString()}
            </TableCell>
            <TableCell>${price.prompt.toLocaleString()}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Output</TableCell>
            <TableCell>
              {props.usage.aggregate.output.total.toLocaleString()}
            </TableCell>
            <TableCell>${price.completion.toLocaleString()}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </React.Fragment>
  );
};

interface IPrice {
  total: number;
  prompt: number;
  completion: number;
}

const compute = (usage: AgenticaTokenUsage): IPrice => {
  const prompt: number =
    (usage.aggregate.input.total - usage.aggregate.input.cached) *
      (2.5 / 1_000_000) +
    usage.aggregate.input.cached * (1.25 / 1_000_000);
  const completion: number = usage.aggregate.output.total * (10.0 / 1_000_000);
  return {
    total: prompt + completion,
    prompt,
    completion,
  };
};
