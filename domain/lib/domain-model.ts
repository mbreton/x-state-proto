import {Actor, createActor, EventObject, MachineSnapshot, StateMachine,} from "xstate";

/**
 * This abstract class must be used to build a Domain Model dealing with states (so lot of them)
 */
export abstract class DomainModel<
  TMachine extends SimplifiedStateMachine<TCommand>, // Generic Type of the StateMachine which will protect the model
  TCommand extends EventObject, // Generic Type of the commands taking as input of the model
  TModel, // Generic Type of the type itself
> {
  protected _actor?: ExtendedActor<TMachine, TCommand, TModel>;

  /**
   * @param _stateMachine A declaration of the StateMachine which will protect the model
   * @protected
   */
  protected constructor(protected _stateMachine: TMachine) {}

  /**
   * This method will map the basic model to a StateMachine Snapshot
   * and must be implemented by the sub-class model
   * @protected
   */
  protected abstract toSnapshot(): ReturnType<TMachine["resolveState"]>;

  protected abstract fromSnapshot(
    snapshot: ReturnType<TMachine["resolveState"]>,
  ): TModel;

  /**
   * This method will map a StateMachine Snapshot to a basic model
   * and must be implemented by the sub-class model
   * @protected
   */
  protected abstract toStateMachineId(): TMachine["id"];

  /**
   * Unseal is used to get access to the "Actor" acting the StateMachine, this is
   * the only way to make changes on the model. The Actor plays the role of guardian
   * which guarantee to never break the state machine and limit actions according to
   * the current state
   * @return ExtendedActor is an enhanced Actor of the XState lib with two more methods "dispatch" and "collect"
   */
  unseal() {
    /**
     *  We will first create and start an actor from the snapshot mapper defined by the sub-class.
     *  The snapshot is data handled by the actor at a point of time.
     */
    if (this._actor) {
      return this._actor;
    }
    this._actor = createActor(this._stateMachine, {
      id: this.toStateMachineId(),
      snapshot: this.toSnapshot(),
    }).start() as ExtendedActor<TMachine, TCommand, TModel>;

    /**
     * The two following functions are bit hacky, but they're useful and pretty safe regarding
     * the typing to add the "dispatch" and "collect" methods on the actors.
     *
     * In a nutshell, "dispatch" is an extended "send" method of actor which can check if a transition is possible
     * else throws an Error. "collect" returns the model updated by the changes made in the actor.
     *
     */
    const bindDispatchFn =
      (that: ExtendedActor<TMachine, TCommand, TModel>) =>
      (event: TCommand, strict = true) => {
        const snapshot = that.getSnapshot() as SimplifiedMachineSnapshot;
        const willTransition = snapshot.can(event);
        if (strict && !willTransition) {
          throw new NoTransitionError(snapshot.context.id, snapshot.value);
        }
        that.send(event as unknown as any); // dirty, but ok because the event is already typed
        return that;
      };

    const bindCollectFn =
      (that: ExtendedActor<TMachine, TCommand, TModel>) => (): TModel =>
        this.fromSnapshot(that.getSnapshot());

    // bind the two methods to the actor
    this._actor.dispatch = bindDispatchFn(this._actor);
    this._actor.collect = bindCollectFn(this._actor);

    return this._actor;
  }
}

/**
 * ExtendedActor defines the type of the enhanced actor with the two new methods
 */
export interface ExtendedActor<
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

/**
 * Just a type alias to reduce the length of the StateMachine type signature
 */
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

/**
 * Just a type alias to reduce the length of the StateMachine Snapshot type signature
 */
type SimplifiedMachineSnapshot = MachineSnapshot<any, any, any, any, any, any>;

export class NoTransitionError extends Error {
  constructor(entityId: string, state: string) {
    super(
      `Unable to apply the requested change on the entity "${entityId}" because it's in ${state} state`,
    );
  }
}
