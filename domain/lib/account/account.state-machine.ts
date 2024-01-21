import { assign, setup } from "xstate";
import { AccountCommand } from "./account.command";
import { AccountCountry } from "./account-model";

export const accountStateMachine = setup({
  types: {} as {
    context: { id?: number; name?: string; country?: AccountCountry };
    events: AccountCommand;
  },
}).createMachine({
  id: `account`,
  initial: "open",
  states: {
    open: {
      on: {
        CLOSE: { target: "closing" },
        SUSPEND: { target: "suspended" },
        SET_PROPS: {
          actions: assign(({ event }) => {
            return {
              ...event.params,
            };
          }),
        },
      },
    },
    closing: {
      on: {
        NO_MORE_MONEY_ON_ACCOUNT: { target: "closed" },
        REOPEN: { target: "open" },
      },
    },
    closed: {
      on: {
        REOPEN: { target: "open" },
      },
    },
    suspended: {
      on: {
        REOPEN: { target: "open" },
        CLOSE: { target: "closing" },
        SET_PROPS: {
          actions: assign(({ event }) => {
            return {
              ...event.params,
            };
          }),
        },
      },
    },
  },
});
export type AccountStateMachine = typeof accountStateMachine;
