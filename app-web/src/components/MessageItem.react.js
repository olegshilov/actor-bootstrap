/*
 * Copyright (C) 2015-2016 Actor LLC. <https://actor.im>
 */

import { escape } from 'lodash';
import React, { Component, PropTypes } from 'react';
import { Container } from 'flux/utils';
import classnames from 'classnames';
import { escapeWithEmoji } from 'actor-sdk/build/utils/EmojiUtils';
import PeerUtils from 'actor-sdk/build/utils/PeerUtils';
import { MessageContentTypes } from 'actor-sdk/build/constants/ActorAppConstants';

import DialogActionCreators from 'actor-sdk/build/actions/DialogActionCreators';
import ActivityActionCreators from 'actor-sdk/build/actions/ActivityActionCreators';
import DropdownActionCreators from 'actor-sdk/build/actions/DropdownActionCreators';

import DropdownStore from 'actor-sdk/build/stores/DropdownStore';

import SvgIcon from 'actor-sdk/build/components/common/SvgIcon.react';
import AvatarItem from 'actor-sdk/build/components/common/AvatarItem.react';
import State from 'actor-sdk/build/components/dialog/messages/State.react';
import Reactions from 'actor-sdk/build/components/dialog/messages/Reactions.react';

// Default message content components
import DefaultService from 'actor-sdk/build/components/dialog/messages/Service.react';
import DefaultText from 'actor-sdk/build/components/dialog/messages/Text.react';
import DefaultPhoto from './PhotoMessage.react.js';
import DefaultDocument from 'actor-sdk/build/components/dialog/messages/Document.react';
import DefaultVoice from 'actor-sdk/build/components/dialog/messages/Voice.react';
import DefaultContact from 'actor-sdk/build/components/dialog/messages/Contact.react';
import DefaultLocation from 'actor-sdk/build/components/dialog/messages/Location.react.js';
import DefaultModern from 'actor-sdk/build/components/dialog/messages/Modern.react.js';
import DefaultSticker from 'actor-sdk/build/components/dialog/messages/Sticker.react.js';

class MessageItem extends Component {
  static getStores() {
    return [DropdownStore];
  }

  static calculateState(prevState, props) {
    return {
      isHighlighted: props && props.message ? DropdownStore.isMessageDropdownOpen(props.message.rid) : false
    }
  }

  static propTypes = {
    peer: PropTypes.object.isRequired,
    message: PropTypes.object.isRequired,
    isShort: PropTypes.bool.isRequired,
    isSelected: PropTypes.bool,
    onSelect: PropTypes.func
  };

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.message !== nextProps.message ||
           this.props.isShort !== nextProps.isShort;
  }

  onClick = () => {
    const { message, peer } = this.props;

    if (PeerUtils.equals(peer, message.sender.peer)) {
      ActivityActionCreators.show();
    } else {
      DialogActionCreators.selectDialogPeerUser(message.sender.peer.id);
    }
  };

  showActions = (event) => {
    const { message } = this.props;
    DropdownActionCreators.openMessageActions(event.target.getBoundingClientRect(), message);
  };

  render() {
    const { message, peer, isShort, isSelected } = this.props;
    const { isHighlighted } = this.state;

    const Service = DefaultService;
    const Text = DefaultText;
    const Modern = DefaultModern;
    const Photo = DefaultPhoto;
    const Document = DefaultDocument;
    const Voice = DefaultVoice;
    const Contact = DefaultContact;
    const Location = DefaultLocation;
    const Sticker = DefaultSticker;

    let header = null,
        messageContent = null,
        leftBlock = null;

    const messageSender = escapeWithEmoji(message.sender.title);

    const messageClassName = classnames('message row', {
      'message--same-sender': isShort,
      'message--active': isHighlighted,
      'message--selected': isSelected
    });
    const messageActionsMenuClassName = classnames('message__actions__menu', {
      'message__actions__menu--opened': isHighlighted
    });

    if (isShort) {
      leftBlock = (
        <div className="message__info text-right">
          <time className="message__timestamp">{message.date}</time>
          <State message={message}/>
        </div>
      );
    } else {
      leftBlock = (
        <div className="message__info message__info--avatar">
          <a onClick={this.onClick}>
            <AvatarItem image={message.sender.avatar}
                        placeholder={message.sender.placeholder}
                        title={message.sender.title}/>
          </a>
        </div>
      );
      header = (
        <header className="message__header">
          <h3 className="message__sender">
            <a onClick={this.onClick}>
              {
                message.sender.title
                  ? <span className="message__sender__name" dangerouslySetInnerHTML={{__html: messageSender}}/>
                  : null
              }
              {
                message.sender.userName
                  ? <span className="message__sender__nick">@{message.sender.userName}</span>
                  : null
              }
            </a>
          </h3>
          <time className="message__timestamp">{message.date}</time>
          <State message={message}/>
        </header>
      );
    }

    switch (message.content.content) {
      case MessageContentTypes.SERVICE:
        messageContent = <Service {...message.content} className="message__content message__content--service"/>;
        break;
      case MessageContentTypes.TEXT:
        messageContent = <Text {...message.content} className="message__content message__content--text"/>;
        break;
      case MessageContentTypes.PHOTO:
        messageContent = (<Photo content={message.content} className="message__content message__content--photo"
                                loadedClassName="message__content--photo--loaded"/>);
        break;
      case MessageContentTypes.DOCUMENT:
        messageContent = <Document content={message.content} className="message__content message__content--document"/>;
        break;
      case MessageContentTypes.VOICE:
        messageContent = <Voice content={message.content} className="message__content message__content--voice"/>;
        break;
      case MessageContentTypes.CONTACT:
        messageContent = <Contact {...message.content} className="message__content message__content--contact"/>;
        break;
      case MessageContentTypes.LOCATION:
        messageContent = <Location content={message.content} className="message__content message__content--location"/>;
        break;
      case MessageContentTypes.TEXT_MODERN:
        messageContent = <Modern {...message.content} className="message__content message__content--modern"/>;
        break;
      case MessageContentTypes.STICKER:
        messageContent = <Sticker {...message.content} className="message__content message__content--sticker"/>;
        break;
      default:
    }

    return (
      <div className={messageClassName}>
        {leftBlock}
        <div className="message__body col-xs">
          {header}
          {messageContent}
        </div>
        <div className="message__actions">
          <Reactions peer={peer} message={message}/>

          <div className={messageActionsMenuClassName} onClick={this.showActions}>
            <SvgIcon className="icon icon--dropdown" glyph="cog" />
          </div>

        </div>
      </div>
    );
  }
}

export default Container.create(MessageItem, {withProps: true});
