import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import { withTranslation } from 'react-i18next';

class StatisticsEditor extends PureComponent {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    value: PropTypes.instanceOf(Array).isRequired,
    t: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      currentStatistic: {
        icon: '',
        name: '',
        value: '',
      },
    };
  }

  handleOnChange = (e) => {
    e.persist();
    this.setState(prevState => ({
      currentStatistic: { ...prevState.currentStatistic, [e.target.name]: e.target.value.toString() },
    }));
  };

  handleOnAdd = () => {
    const {
      currentStatistic,
    } = this.state;

    const {
      value, onChange,
    } = this.props;

    if (currentStatistic.icon && currentStatistic.name && currentStatistic.value) {
      onChange([...value, currentStatistic]);
      this.setState({ currentStatistic: { icon: '', name: '', value: '' } });
    }
  };

  handleOnRemove = (e) => {
    const { value, onChange } = this.props;
    const { index } = e.target.dataset;

    onChange([...value.slice(0, index), ...value.slice(index + 1)]);
  };

  render() {
    // State
    const {
      currentStatistic,
    } = this.state;

    const {
      value, t,
    } = this.props;

    return (
      <div className="form__form-group">
        <span className="form__form-group-label text-capitalize">{t('Statistics')}</span>
        <div className="form__form-group-field">
          <input
            className="mr-3"
            name="icon"
            placeholder="Icon"
            onChange={this.handleOnChange}
            value={currentStatistic.icon}
          />
          <input
            className="mr-3"
            name="name"
            placeholder={t('Name')}
            onChange={this.handleOnChange}
            value={currentStatistic.name}
          />
          <input
            className="mr-3"
            name="value"
            placeholder={t('Value')}
            onChange={this.handleOnChange}
            value={currentStatistic.value}
          />
          <Button
            style={{ height: 40, width: 200 }}
            onClick={this.handleOnAdd}
          >
            {t('Add')}
          </Button>
        </div>

        {/* Rendered statistics */}
        <div className="workshop__statistic__item-wrapper mt-3">
          {value && value.map((statistic, index) => (
            <div
              className="workshop__statistic mr-3 mb-2"
              key={`${statistic.icon}-${statistic.name}-${statistic.value}`}
            >
              <h4>
                <i className={`fal fa-fw fa-${statistic.icon} mr-2`} />
                {statistic.name}: {statistic.value}
                <i
                  className="fal fa-fw fa-times ml-3 remove"
                  role="presentation"
                  onClick={this.handleOnRemove}
                  data-index={index}
                />
              </h4>
            </div>
          ))}
        </div>

        {/* Error message */ }
        {''}
      </div>
    );
  }
}

export default withTranslation()(props => (
  <StatisticsEditor {...props.input} />
));
