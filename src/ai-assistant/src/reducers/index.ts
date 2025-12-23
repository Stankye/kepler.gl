// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {UnknownAction} from 'redux';
import {
  UPDATE_AI_ASSISTANT_CONFIG,
  UPDATE_AI_ASSISTANT_MESSAGES,
  SET_START_SCREEN_CAPTURE,
  SET_SCREEN_CAPTURED,
  SET_MAP_BOUNDARY
} from '../actions';
import {MessageModel} from '@openassistant/core';
import {PROVIDER_DEFAULT_BASE_URLS} from '../config/models';

export type AiAssistantConfig = {
  isReady: boolean;
  provider: string;
  model: string;
  apiKey: string;
  baseUrl?: string;
  temperature: number;
  topP: number;
  mapboxToken?: string;
};

// Initial state for the reducer
const initialConfig: AiAssistantConfig = {
  isReady: false,
  provider: 'openai',
  model: 'gpt-4o',
  apiKey: '',
  baseUrl: PROVIDER_DEFAULT_BASE_URLS['openai'],
  temperature: 0.0,
  topP: 1.0
};

export type AiAssistantState = {
  config: AiAssistantConfig;
  messages: MessageModel[];
  screenshotToAsk: {
    startScreenCapture: boolean;
    screenCaptured: string;
  };
  keplerGl?: {
    mapBoundary?: {
      nw: [number, number];
      se: [number, number];
    };
  };
};

const initialState: AiAssistantState = {
  config: initialConfig,
  messages: [],
  screenshotToAsk: {
    startScreenCapture: false,
    screenCaptured: ''
  }
};

type PayloadAction<T> = UnknownAction & { payload: T };

const actionHandler = {
  [UPDATE_AI_ASSISTANT_CONFIG]: updateAiAssistantConfigHandler,
  [UPDATE_AI_ASSISTANT_MESSAGES]: updateAiAssistantMessagesHandler,
  [SET_START_SCREEN_CAPTURE]: setStartScreenCaptureHandler,
  [SET_SCREEN_CAPTURED]: setScreenCapturedHandler,
  [SET_MAP_BOUNDARY]: setMapBoundaryHandler
};

export function aiAssistantReducer(
  state: AiAssistantState = initialState,
  action: UnknownAction
): AiAssistantState {
  const handler = actionHandler[action.type as string];
  return handler ? handler(state, action) : state;
}

function updateAiAssistantConfigHandler(
  state: AiAssistantState,
  action: PayloadAction<AiAssistantConfig>
) {
  return {
    ...state,
    config: {...state.config, ...action.payload}
  };
}

function updateAiAssistantMessagesHandler(state: AiAssistantState, action: PayloadAction<MessageModel[]>) {
  return {
    ...state,
    messages: action.payload
  };
}

function setStartScreenCaptureHandler(state: AiAssistantState, action: PayloadAction<boolean>) {
  return {
    ...state,
    screenshotToAsk: {startScreenCapture: action.payload, screenCaptured: ''}
  };
}

function setScreenCapturedHandler(state: AiAssistantState, action: PayloadAction<string>) {
  return {
    ...state,
    screenshotToAsk: {...state.screenshotToAsk, screenCaptured: action.payload}
  };
}

function setMapBoundaryHandler(
  state: AiAssistantState,
  action: PayloadAction<{nw: [number, number]; se: [number, number]}>
) {
  return {
    ...state,
    keplerGl: {
      ...state.keplerGl,
      mapBoundary: action.payload
    }
  };
}
