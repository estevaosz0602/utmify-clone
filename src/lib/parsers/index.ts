import { ParseResult } from "@/types/webhook";
import { parseHotmart } from "./hotmart";
import { parseKiwify } from "./kiwify";
import { parseEduzz } from "./eduzz";
import { parseTicto } from "./ticto";
import { parsePerfectPay } from "./perfectpay";

export type PlatformParser = (
  payload: Record<string, unknown>,
  rawBody: string,
  secret: string,
  headersOrQuery: Record<string, string>
) => ParseResult;

export const PARSERS: Record<string, PlatformParser> = {
  hotmart: parseHotmart,
  kiwify: (payload, rawBody, secret, q) =>
    parseKiwify(payload, rawBody, secret, q["signature"] || ""),
  eduzz: (payload, rawBody, secret) => parseEduzz(payload, rawBody, secret),
  ticto: parseTicto,
  perfectpay: (payload, rawBody, secret) =>
    parsePerfectPay(payload, rawBody, secret),
};
