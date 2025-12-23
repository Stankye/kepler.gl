// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {UnknownAction, Reducer} from 'redux';

/**
 * Type for an action handler function
 */
export type ActionHandler<S, A = UnknownAction> = (state: S, action: A) => S;

/**
 * Type for a map of action types to handlers
 */
export type ActionHandlerMap<S> = {
  [actionType: string]: ActionHandler<S, any>;
};

/**
 * A Redux 5 compatible replacement for redux-actions handleActions.
 * This function creates a reducer from a map of action types to handler functions.
 *
 * @param handlers - A map of action types to handler functions
 * @param defaultState - The default state for the reducer
 * @returns A reducer function
 *
 * @example
 * const actionHandler = {
 *   [ActionTypes.ADD_LAYER]: addLayerUpdater,
 *   [ActionTypes.REMOVE_LAYER]: removeLayerUpdater,
 * };
 *
 * const reducer = handleActions(actionHandler, initialState);
 */
export function handleActions<S>(
  handlers: ActionHandlerMap<S>,
  defaultState: S
): Reducer<S, UnknownAction> {
  return (state: S | undefined = defaultState, action: UnknownAction): S => {
    // If no action type or action type not in handlers, return current state
    if (!action || !action.type || typeof action.type !== 'string') {
      return state;
    }

    const handler = handlers[action.type];
    if (handler) {
      return handler(state, action);
    }

    return state;
  };
}

export default handleActions;
