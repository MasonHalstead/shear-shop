import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logoutUser, setLoading } from 'ducks/actions';
import {
  getJobDefinition as getJobDefinitionAction,
  editDefinition as editDefinitionProps,
} from 'ducks/operators/job_definition';
import {
  editParameters as editParametersProps,
  saveParameters as saveParametersProps,
} from 'ducks/operators/parameters';
import { handleError } from 'ducks/operators/settings';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as Sentry from '@sentry/browser';
import { Toolbar, Breadcrumbs } from '@material-ui/core';
import { CustomAppBar } from 'components/app-bar/AppBar';
import uuid from 'uuid';
import { DefinitionBlock } from './DefinitionBlock';
import { DefinitionTabs } from './DefinitionTabs';
import { ConfigTab } from './ConfigTab';
import { InputsTab } from './InputsTab';
import { OutputsTab } from './OutputsTab';
import cn from './Definition.module.scss';

class DefinitionPage extends PureComponent {
  static propTypes = {
    getJobDefinition: PropTypes.func,
    setLoadingAction: PropTypes.func,
    editDefinition: PropTypes.func,
    handleErrorProps: PropTypes.func,
    editParameters: PropTypes.func,
    saveParameters: PropTypes.func,
    logoutUserProps: PropTypes.func,
    hamburger: PropTypes.object,
    job_definition: PropTypes.object,
    parameters: PropTypes.array,
    locations: PropTypes.array,
    history: PropTypes.object,
    location: PropTypes.object,
  };

  state = {
    description: '',
    cpu: '',
    timeout: '',
    location_id: 'empty',
    max_retries: '',
    gpu: '',
    memory_gb: '',
    region: 'empty',
    stdout_success_text: '',
    tab: 0,
    result_method_id: '',
    project_id: null,
    changes: false,
    parameters: [],
    callbacks: {
      saveName: (value, id) => this.saveName(value, id),
      changeRequired: id => this.changeRequired(id),
      saveDefault: (value, id) => this.saveDefault(value, id),
      saveDescription: (value, id) => this.saveDescription(value, id),
      handleReference: (value, id) => this.handleReference(value, id),
      deleteRow: id => this.deleteRow(id),
      handleMethod: (item, id) => this.handleMethod(item, id),
    },
  };

  static getDerivedStateFromProps(props, state) {
    const { job_definition, parameters } = props;
    const { job_definition_id } = state;
    if (job_definition.job_definition_id !== job_definition_id) {
      return {
        ...job_definition,
        parameters: [
          ...parameters,
          {
            parameter_name: '',
            description: '',
            parameter_direction_id: 1,
            parameter_method_id: 1,
            modified: false,
            saved: false,
            uuid: uuid.v1(),
          },
          {
            parameter_name: '',
            description: '',
            parameter_direction_id: 2,
            parameter_method_id: 1,
            modified: false,
            saved: false,
            uuid: uuid.v1(),
          },
        ],
      };
    }
    return null;
  }

  componentDidMount() {
    this.setInitialData();
  }

  componentWillUnmount() {
    this.setState({
      changes: false,
    });
  }

  handleChangeTab = (e, value) => {
    this.setState({ tab: value });
  };

  handleDefinitionBlock = input => {
    this.setState({ ...input, changes: true });
  };

  handleDefinitionTabs = input => {
    this.setState({ ...input, changes: true });
  };

  saveName = (name, id) => {
    const { parameters } = this.state;
    const index = parameters.findIndex(parameter => parameter.uuid === id);
    parameters[index] = {
      ...parameters[index],
      parameter_name: name,
      modified: true,
    };
    this.setState(
      {
        parameters: [...parameters],
        changes: true,
      },
      () => this.handleRowManagement(),
    );
  };

  changeRequired = id => {
    const { parameters } = this.state;
    const index = parameters.findIndex(parameter => parameter.uuid === id);
    parameters[index] = {
      ...parameters[index],
      is_required: !parameters[index].is_required,
      modified: true,
    };
    this.setState(
      {
        parameters: [...parameters],
        changes: true,
      },
      () => this.handleRowManagement(),
    );
  };

  handleMethod = (item, id) => {
    const { parameters } = this.state;
    const index = parameters.findIndex(parameter => parameter.uuid === id);
    parameters[index] = {
      ...parameters[index],
      parameter_method_id: item.parameter_method_id,
      parameter_method_name: item.parameter_method_name,
      command_line_assignment_char: item.command_line_assignment_char,
      command_line_escaped: item.command_line_escaped,
      command_line_ignore_name: item.command_line_ignore_name,
      command_line_prefix: item.command_line_prefix,
      is_encrypted: item.is_encrypted,
      modified: true,
    };
    this.setState(
      {
        parameters: [...parameters],
        changes: true,
      },
      () => this.handleRowManagement(),
    );
  };

  handleReference = (item, id) => {
    const { parameters } = this.state;
    const index = parameters.findIndex(parameter => parameter.uuid === id);

    parameters[index] = {
      ...parameters[index],
      reference_id: item.reference_id,
      reference_parameter_name: item.reference_parameter_name,
      reference: item.reference,
      modified: true,
    };
    this.setState(
      {
        parameters: [...parameters],
        changes: true,
      },
      () => this.handleRowManagement(),
    );
  };

  saveDefault = (value, id) => {
    const { parameters } = this.state;
    const index = parameters.findIndex(parameter => parameter.uuid === id);
    parameters[index] = {
      ...parameters[index],
      parameter_value: value,
      modified: true,
    };
    this.setState(
      {
        parameters: [...parameters],
        changes: true,
      },
      () => this.handleRowManagement(),
    );
  };

  saveDescription = (value, id) => {
    const { parameters } = this.state;
    const index = parameters.findIndex(parameter => parameter.uuid === id);
    parameters[index] = {
      ...parameters[index],
      description: value,
      modified: true,
    };
    this.setState(
      {
        parameters: [...parameters],
        changes: true,
      },
      () => this.handleRowManagement(),
    );
  };

  deleteRow = id => {
    const { parameters } = this.state;
    const index = parameters.findIndex(parameter => parameter.uuid === id);
    parameters.splice(index, 1);
    this.setState(
      {
        parameters: [...parameters],
        changes: true,
      },
      () => this.handleRowManagement(),
    );
  };

  handleRowManagement = () => {
    const { parameters } = this.state;

    const inputs = parameters.filter(
      p => p.parameter_direction_id === 1 && p.modified === false,
    );
    const outputs = parameters.filter(
      p => p.parameter_direction_id === 2 && p.modified === false,
    );

    if (inputs.length === 0) {
      this.configNewRow(1);
    }
    if (outputs.length === 0) {
      this.configNewRow(2);
    }
  };

  configNewRow = direction_id => {
    const { parameters } = this.state;
    const new_row = {
      parameter_name: '',
      description: '',
      parameter_direction_id: direction_id,
      modified: false,
      uuid: uuid.v1(),
    };
    parameters.push(new_row);
    this.setState({
      parameters: [...parameters],
    });
  };

  setInitialData = async () => {
    const { getJobDefinition, setLoadingAction, location } = this.props;
    const [, , , , definition_id] = location.pathname.split('/');

    try {
      await setLoadingAction(true);
      await getJobDefinition(definition_id);
    } catch (err) {
      // Only fires if the server is off line or the body isnt set correctly
      Sentry.captureException(err);
    }
    setLoadingAction(false);
  };

  saveDefinition = async () => {
    const {
      job_definition_name,
      description,
      docker_image,
      result_method_id,
      startup_command,
      timeout,
      stdout_success_text,
      region,
      cpu,
      gpu,
      max_retries,
      memory_gb,
      data,
      parameters,
      location_id,
    } = this.state;
    const {
      editDefinition,
      getJobDefinition,
      setLoadingAction,
      handleErrorProps,
      job_definition,
      locations,
      saveParameters,
      editParameters,
    } = this.props;

    const { job_definition_id } = job_definition;
    const timeOut = timeout.split(':');

    const post_data = {
      job_definition_name,
      description,
      docker_image,
      result_method_id,
      startup_command,
      timeout_seconds: Number(timeOut[0]) * 3600 + Number(timeOut[1] * 60),
      stdout_success_text,
      region_endpoint_hint:
        region !== 'empty'
          ? locations.filter(filter => filter.location_id === Number(region))[0]
              .location_name
          : 'empty',
      location_id: location_id === 'empty' ? null : location_id,
      cpu,
      gpu,
      max_retries,
      memory_gb,
    };

    try {
      await setLoadingAction(true);
      await editParameters(parameters, job_definition_id);
      await saveParameters(parameters, job_definition_id);
      await editDefinition(post_data, job_definition_id);
      await getJobDefinition(job_definition_id);
    } catch (err) {
      handleErrorProps(err, data);
    }
    setLoadingAction(false);
  };

  logout = () => {
    const { logoutUserProps, history } = this.props;
    logoutUserProps();
    localStorage.clear();
    history.push('/login');
  };

  render() {
    const { hamburger, history } = this.props;
    const {
      changes,
      job_definition_name,
      docker_image,
      startup_command,
      description,
      cpu,
      timeout,
      max_retries,
      gpu,
      stdout_success_text,
      location_id,
      result_method_id,
      region,
      memory_gb,
      parameters,
      callbacks,
      tab,
      project_id,
    } = this.state;

    return (
      <>
        <CustomAppBar hamburger={hamburger.open}>
          <Toolbar className={cn.toolbar}>
            <Breadcrumbs
              separator={
                <FontAwesomeIcon icon="chevron-right" color="#818fa3" />
              }
              aria-label="breadcrumb"
              classes={{ separator: cn.separator, root: cn.text }}
            >
              <div
                className={cn.text}
                onClick={() => {
                  history.push(`/projects`);
                }}
              >
                Lynx (Prod)
              </div>
              <div
                className={cn.text}
                onClick={() => {
                  history.push(
                    `/projects/${project_id}/definitions/unarchived`,
                  );
                }}
              >
                Job Definitions
              </div>
              <div>{job_definition_name}</div>
            </Breadcrumbs>
            <div className={cn.flex} />
            <div className={cn.iconContainer} onClick={this.saveDefinition}>
              <FontAwesomeIcon
                icon={['far', 'save']}
                color={changes ? 'orange' : '#818fa3'}
              />
            </div>
            <div className={cn.logout} onClick={this.logout}>
              <FontAwesomeIcon icon="sign-out-alt" color="#818fa3" />
            </div>
          </Toolbar>
        </CustomAppBar>
        <DefinitionBlock
          job_definition_name={job_definition_name}
          docker_image={docker_image}
          startup_command={startup_command}
          description={description}
          handleDefinitionBlock={this.handleDefinitionBlock}
        />
        <DefinitionTabs
          job_definition={this.state}
          handleChangeTab={this.handleChangeTab}
          tab={tab}
          handleDefinitionTabs={this.handleDefinitionTabs}
        >
          {tab === 0 && (
            <ConfigTab
              cpu={cpu}
              timeout={timeout}
              max_retries={max_retries}
              gpu={gpu}
              stdout_success_text={stdout_success_text}
              location={location_id}
              result_method_id={result_method_id}
              region={region}
              memory_gb={memory_gb}
              handleDefinitionTabs={this.handleDefinitionTabs}
            />
          )}
          {tab === 1 && (
            <InputsTab
              callbacks={callbacks}
              parameters={parameters.filter(
                parameter => parameter.parameter_direction_id === 1,
              )}
            />
          )}
          {tab === 2 && (
            <OutputsTab
              callbacks={callbacks}
              parameters={parameters.filter(
                parameter => parameter.parameter_direction_id === 2,
              )}
            />
          )}
        </DefinitionTabs>
      </>
    );
  }
}

const mapStateToProps = state => ({
  hamburger: state.hamburger,
  locations: state.lookups.locations,
  parameters: state.parameters,
  job_definition: state.job_definition,
});

const mapDispatchToProps = {
  getJobDefinition: getJobDefinitionAction,
  editDefinition: editDefinitionProps,
  editParameters: editParametersProps,
  saveParameters: saveParametersProps,
  logoutUserProps: logoutUser,
  setLoadingAction: setLoading,
  handleErrorProps: handleError,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DefinitionPage);
