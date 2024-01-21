import { AccountCountry } from "./account-model";

export type AccountCommand =
  | { type: "CLOSE" }
  | { type: "SUSPEND" }
  | { type: "REOPEN" }
  | { type: "NO_MORE_MONEY_ON_ACCOUNT" }
  | { type: "SET_PROPS"; params: { name?: string; country?: AccountCountry } };
