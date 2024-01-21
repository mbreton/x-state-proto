import {
  Actor,
  createActor,
  EventObject,
  MachineSnapshot,
  StateMachine,
} from "xstate";

export abstract class DomainModel<
  TMachine extends SimplifiedStateMachine<TCommand>,
  TCommand extends EventObject,
  TModel,
> {
  protected constructor(protected _stateMachine: TMachine) {}

  protected abstract toSnapshot(): ReturnType<TMachine["resolveState"]>;

  protected abstract fromSnapshot(
    snapshot: ReturnType<TMachine["resolveState"]>,
  ): TModel;

  protected abstract toStateMachineId(): TMachine["id"];

  unlock() {
    const actor = createActor(this._stateMachine, {
      id: this.toStateMachineId(),
      snapshot: this.toSnapshot(),
    }).start() as ExtendedActor<TMachine, TCommand, TModel>;

    const bindDispatchFn =
      (that: ExtendedActor<TMachine, TCommand, TModel>) =>
      (event: TCommand, strict = true) => {
        const snapshot = that.getSnapshot() as SimplifiedMachineSnapshot;
        const willTransition = snapshot.can(event);
        if (strict && !willTransition) {
          throw new NoTransitionError(snapshot.context.id, snapshot.value);
        }
        /* TODO: Dirty, but I don't get the diff between EventObject and EventFromLogic<TLogic>
         * + I already protect the method signature with the TCommand
         */
        that.send(event as unknown as any);
        return that;
      };

    const bindCollectFn =
      (that: ExtendedActor<TMachine, TCommand, TModel>) => (): TModel =>
        this.fromSnapshot(that.getSnapshot());

    // find a way extends the basic actor more elegantly
    actor.dispatch = bindDispatchFn(actor);
    actor.collect = bindCollectFn(actor);

    return actor;
  }
}

interface ExtendedActor<
  TMachine extends SimplifiedStateMachine<TCommand>,
  TCommand extends EventObject,
  TModel,
> extends Actor<TMachine> {
  dispatch: (
    event: TCommand,
    strict?: boolean,
  ) => ExtendedActor<TMachine, TCommand, TModel>;
  collect: () => TModel;
}

type SimplifiedStateMachine<TCommand extends EventObject> = StateMachine<
  any,
  TCommand,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any
>;

type SimplifiedMachineSnapshot = MachineSnapshot<any, any, any, any, any, any>;

export class NoTransitionError extends Error {
  constructor(entityId: string, state: string) {
    super(
      `Unable to apply the requested change on the entity "${entityId}" because it's in ${state} state`,
    );
  }
}
