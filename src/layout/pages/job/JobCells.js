import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import cn from './Job.module.scss';

export const ParameterNameCell = ({ row }) => (
  <p className={cn.cell}>{row.parameter_name}</p>
);
ParameterNameCell.propTypes = {
  row: PropTypes.object,
};

export const ParameterValueCell = ({ row }) => (
  <p className={cn.cell}>{row.default_value}</p>
);
ParameterValueCell.propTypes = {
  row: PropTypes.object,
};

export const ParameterDescriptionCell = ({ row }) => (
  <p className={cn.cell}>{row.description}</p>
);
ParameterDescriptionCell.propTypes = {
  row: PropTypes.object,
};

export const HistoryStateCell = ({ row }) => (
  <p className={cn.cell}>
    <FontAwesomeIcon title="Job State" icon="circle" className={cn.stateIcon} />
    {row.state}
  </p>
);
HistoryStateCell.propTypes = {
  row: PropTypes.object,
};

export const HistoryTimestampCell = ({ row }) => (
  <p className={classNames(cn.cell, cn.textCenter)}>{row.timestamp}</p>
);
HistoryTimestampCell.propTypes = {
  row: PropTypes.object,
};
