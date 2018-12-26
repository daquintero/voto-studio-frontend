import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

export default class ProfileActivity extends PureComponent {
  static propTypes = {
    date: PropTypes.string,
    img: PropTypes.string,
    icn: PropTypes.string,
    name: PropTypes.string,
    children: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.arrayOf(PropTypes.element),
    ]).isRequired,
  };

  static defaultProps = {
    date: '',
    img: '',
    icn: '',
    name: '',
  };

  render() {
    const { img, icn } = this.props;
    return (
      <div className="profile__activity">
        <div className={`profile__activity-avatar ${icn && 'text-center'}`}>
          {img && (<img src={img} alt="" />)}
          {icn && (<i className={`fal fa-4x ${icn}`} />)}
        </div>
        <div>
          <p className="profile__activity-name">{this.props.name}
            <span className="profile__activity-date"> {this.props.date}</span>
          </p>
          {this.props.children}
        </div>
      </div>
    );
  }
}
