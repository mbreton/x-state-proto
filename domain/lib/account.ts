import {Actor, assign, createActor, setup} from "xstate";

/**
 * TODO:
 * - Mettre une entité liée au account
 *   pour voir comment ça pourrait fonctionner
 *   avec notamment sur l'actor
 * - Avoir un endpoint ou des fichiers
 *   avec le schéma de statemachine
 */

export function createNewAccount(name: string, country: AccountCountry) {
  return new Account({
    name,
    country,
  });
}

export class Account {
  public readonly id?: number;
  public readonly name?: string;
  public readonly country?: AccountCountry;
  public readonly status: AccountStatus;

  constructor({ id, name, country, status = "open" }: Partial<Account>) {
    this.id = id;
    this.name = name;
    this.country = country;
    this.status = status;
  }

  wrap() {
    const actor = createActor(AccountStateMachine, {
      id: this.id ? `acccount-${this.id}` : `account-new`,
      snapshot: AccountStateMachine.resolveState({
        value: this.status,
        context: {
          id: this.id!,
          name: this.name!,
          country: this.country!,
        },
      }),
    }).start();
    // find a way extends the basic actor more elegantly
    // @ts-ignore
    actor["dispatch"] = dispatch(actor);
    // @ts-ignore
    actor["unwrap"] = unwrap(actor);

    type AccountActor = typeof actor & {
      dispatch: (event: AccountCommands, strict?: boolean) => AccountActor;
      unwrap: () => Account;
    };

    return actor as AccountActor;
  }
}

export const accountCountries = ["FRA", "DEU", "ESP", "NLD"] as const;
export type AccountCountry = (typeof accountCountries)[number];
export type AccountStatus = "open" | "closing" | "closed" | "suspended";

const unwrap = (that: Actor<typeof AccountStateMachine>) => (): Account => {
  return new Account({
    ...that.getSnapshot().context,
    status: that.getSnapshot().value,
  });
};
const dispatch =
  (that: Actor<typeof AccountStateMachine>) =>
  (event: AccountCommands, strict = true) => {
    const snapshot = that.getSnapshot();
    const willTransition = snapshot.can(event);
    if (strict && !willTransition) {
      throw new Error(
        `Account ${snapshot.context.id} cannot be closed because it's in ${snapshot.value} state`,
      );
    }
    that.send(event);
    return this;
  };

export const AccountStateMachine = setup({
  types: {} as {
    context: Omit<Account, "status" | "wrap">;
    events: AccountCommands;
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

type AccountCommands =
  | { type: "CLOSE" }
  | { type: "SUSPEND" }
  | { type: "REOPEN" }
  | { type: "NO_MORE_MONEY_ON_ACCOUNT" }
  | { type: "SET_PROPS"; params: Partial<Pick<Account, "name" | "country">> };
