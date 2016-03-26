
/*
 * Copyright (C) 2015 Actor LLC. <https://actor.im>
 */

import { ActorSDK, ActorSDKDelegate } from 'actor-sdk';
import MessageItem from './components/MessageItem.react';

const components = {
  dialog: {
    messages: {
      message: MessageItem
    }
  }
};
const actions = {};
const l18n = {}

const config = {
  // endpoints: [
  //   'wss://front1-ws-mtproto-api-rev2.actor.im',
  //   'wss://front2-ws-mtproto-api-rev2.actor.im'
  // ],
  // isExperimental: true,
  // rootElement: 'actor-web-app',
  // forceLocale: 'en-US',
  // twitter: 'actorapp',
  // homePage: 'http://actor.im',
  // appName: 'Actor',
  delegate: new ActorSDKDelegate(components, actions, l18n)
};

const app = new ActorSDK({...config});
app.startApp();
