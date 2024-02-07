import {assign, setup} from "xstate";
import {AccountCommand} from "./account.command";
import {AccountCountry} from "./account-model";

/**
 * Account State machine definition, properly seperated from the Account Model.
 * It defines the states, the actions possible in this state, and types in this State machine.
 */
export const accountStateMachine = setup({
  /**
   * Here, we define the data types managed by the State Machine and the commands accepted
   */
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
/**
 * Types alias for convenience
 */
export type AccountStateMachine = typeof accountStateMachine;
export type StateMachineSnapshot = ReturnType<
  AccountStateMachine["resolveState"]
>;
