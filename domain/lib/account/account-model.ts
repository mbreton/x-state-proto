import { DomainModel } from "../domain-model";
import {
  accountStateMachine,
  AccountStateMachine,
  StateMachineSnapshot,
} from "./account.state-machine";
import { AccountCommand } from "./account.command";

export function createNewAccount(name: string, country: AccountCountry) {
  return new Account({
    name,
    country,
  });
}

export class Account extends DomainModel<
  AccountStateMachine,
  AccountCommand,
  Account
> {
  public readonly id?: number;
  public readonly name?: string;
  public readonly country?: AccountCountry;
  public readonly status: AccountStatus;

  constructor({ id, name, country, status = "open" }: Partial<Account>) {
    super(accountStateMachine);
    this.id = id;
    this.name = name;
    this.country = country;
    this.status = status;
  }

  protected toSnapshot(): StateMachineSnapshot {
    return this._stateMachine.resolveState({
      value: this.status,
      context: {
        id: this.id!,
        name: this.name!,
        country: this.country!,
      },
    });
  }

  protected fromSnapshot(snapshot: StateMachineSnapshot): Account {
    return new Account({
      ...snapshot.context,
      status: snapshot.value,
    });
  }

  protected toStateMachineId(): AccountStateMachine["id"] {
    return this.id ? `acccount-${this.id}` : `account-new`;
  }

  public close() {
    return this.unseal().dispatch({ type: "CLOSE" });
  }

  public set(params: Pick<Account, "name" | "country">) {
    return this.unseal().dispatch({ type: "SET_PROPS", params }, false);
  }
}

export const accountCountries = ["FRA", "DEU", "ESP", "NLD"] as const;
export type AccountCountry = (typeof accountCountries)[number];
export type AccountStatus = "open" | "closing" | "closed" | "suspended";
