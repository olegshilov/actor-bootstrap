/*
 * Copyright (C) 2015-2016 Actor LLC. <https://actor.im>
 */

import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';

let oldUrl;

class Photo extends Component {
  static propTypes = {
    content: PropTypes.object.isRequired,
    className: PropTypes.string,
    loadedClassName: PropTypes.string
  };

  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.content.fileUrl !== null) oldUrl = this.props.content.fileUrl
  }

  render() {
    const { content, className } = this.props;

    const MAX_WIDTH = 600;
    const MAX_HEIGHT = 400;
    let width = content.w;
    let height = content.h;

    if (width > height) {
      if (width > MAX_WIDTH) {
        height *= MAX_WIDTH / width;
        width = MAX_WIDTH;
      }
    } else {
      if (height > MAX_HEIGHT) {
        width *= MAX_HEIGHT / height;
        height = MAX_HEIGHT;
      }
    }

    return (
      <div className={'message__content message__content--photo message__content--photo--loaded'} style={{width, height}}>
        {
          oldUrl
            ? <img className="photo photo--original"
                   style={{zIndex: 1000, cursor: 'default'}}
                   height={content.h}
                   src={oldUrl}
                   width={content.w}/>
            : null
        }
        {
          content.fileUrl
            ? <img className="photo photo--original"
                   style={{zIndex: 1100, cursor: 'default'}}
                   height={content.h}
                   src={content.fileUrl}
                   width={content.w}/>
            : null
        }
      </div>
    );
  }
}

export default Photo;
