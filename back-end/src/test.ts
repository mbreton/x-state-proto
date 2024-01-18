// @ts-nocheck
import { accountStateMachine } from './domain/account/account';
import { createBrowserInspector } from '@statelyai/inspect';
import { createActor } from 'xstate';

// const account = createNewAccount('Mon super compte', 'FRA');
//
// const actor = account.wrap();
//
// actor.dispatch({ type: 'SET_PROPS', params: { name: 'Ultra chaud' } });
//
// console.log(actor.unwrap());

const inspector = createBrowserInspector();

const actor = createActor(accountStateMachine, {
  inspect: inspector.inspect,
});

actor.start();
