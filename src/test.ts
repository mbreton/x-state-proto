import { createNewAccount } from './domain/account/account';

const account = createNewAccount('Mon super compte', 'FRA');

const actor = account.wrap();

actor.dispatch({ type: 'SET_PROPS', params: { name: 'Ultra chaud' } });

console.log(actor.unwrap());
