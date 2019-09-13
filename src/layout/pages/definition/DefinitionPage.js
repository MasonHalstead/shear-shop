import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Toolbar,
  Breadcrumbs,
  Paper,
  Tabs,
  Tab,
  FormControl,
  NativeSelect,
  Dialog,
  DialogContent,
  Button,
  DialogActions,
} from '@material-ui/core';
import { CustomAppBar } from 'components/app-bar/AppBar';
import { logoutUser } from 'ducks/actions';
import {
  CustomInput,
  CustomInputTextArea,
  CustomInputBack,
} from 'components/material-input/CustomInput';
import {
  BootstrapInput,
  BootstrapInputDisabled,
} from 'components/bootsrap-input/BootstrapInput';
import { TableContainer } from 'components/table-view/TableContainer';
import { TableContent } from 'components/table-view/TableContent';
import classNames from 'classnames';
import cn from './Definition.module.scss';
import { configureColumns } from './columns';
import { configureColumnsOutput } from './outputColumns';

class DefinitionPage extends PureComponent {
  static propTypes = {
    getProjects: PropTypes.func,
    hamburger: PropTypes.object,
    projects: PropTypes.array,
    lookups: PropTypes.object,
    history: PropTypes.object,
    location: PropTypes.object,
  };

  static getDerivedStateFromProps(props, state) {
    const filter = props.location.pathname.split('/');
    const label = filter[4].charAt(0).toUpperCase() + filter[4].slice(1);

    if (state.label !== label) {
      return { label };
    }

    return state;
  }

  options = {
    filterType: 'textField',
    selectableRows: 'none',
    search: false,
    pagination: false,
    filter: false,
    download: false,
    viewColumns: false,
    print: false,
  };

  state = {
    label: 'Unarchived',
    definitionName: '',
    dockerImage: '',
    startupCommand: '',
    description: '',
    cpu: '',
    timeout: '',
    location: 'empty',
    retries: '',
    gpu: '',
    memory: '',
    method: '',
    region: 'empty',
    success: '',
    tab: 0,
    open: false,
    index: '',
    project: '',
    parameter: '',
    params: [
      {
        value: '',
        description: '',
      },
    ],
    data: [
      {
        name: '',
        reference_parameter: '',
        required: false,
        method: '',
        reference: '',
        default: '',
        description: '',
        id: 1,
      },
    ],
    changes: false,
  };

  componentDidMount() {
    // const { getProjects } = this.props;
    // try {
    //   getProjects();
    // } catch (err) {
    //   // Only fires if the server is off line or the body isnt set correctly
    //   Sentry.captureException(err);
    // }
  }

  componentWillUnmount() {
    this.setState({ changes: false });
  }

  handleChangeTab = (event, newValue) => {
    this.setState({ tab: newValue });
  };

  changeName = (value, index) => {
    const { params } = this.state;
    if (params.length === index + 1) {
      this.addMoreParameters();
    }
    this.setState(prevState => {
      const newItems = [...prevState.params];
      newItems[index].value = value;
      return { params: newItems, changes: true };
    });
  };

  changeDescription = (description, index) => {
    this.setState(prevState => {
      const newItems = [...prevState.params];
      newItems[index].description = description;
      return { params: newItems, changes: true };
    });
  };

  deleteOutputRow = index => {
    const { params } = this.state;
    const result = params.filter((item, indexNew) => indexNew !== index);
    this.setState({ params: result, changes: true });
  };

  deleteInputRow = index => {
    const { data } = this.state;
    const result = data.filter((item, indexNew) => indexNew !== index);
    this.setState({ data: result, changes: true });
  };

  changeReferenceParameter = referenceParameter => {
    this.setState(prevState => {
      const newItems = [...prevState.data];
      newItems[this.state.index].reference_parameter = referenceParameter;
      return { data: newItems, parameter: referenceParameter, changes: true };
    });
  };

  handleClickOpen = index => {
    this.setState({ open: true, index });
  };

  addMoreParameters = () => {
    this.setState(prevState => {
      const newItems = [...prevState.params];
      newItems.push({
        value: '',
        description: '',
      });
      return { params: newItems, changes: true };
    });
  };

  addMNewRow = () => {
    this.setState(prevState => {
      const newItems = [...prevState.data];
      newItems.push({
        name: '',
        required: false,
        method: '',
        reference: '',
        default: '',
        description: '',
        id: newItems.length + 1,
      });
      return { data: newItems, changes: true };
    });
  };

  secondTab = () => (
    <TableContainer style={cn.tableContainerWrapper}>
      <TableContent
        tableData={this.state.data}
        tableOptions={this.options}
        columns={this.createColumns()}
        styles={{
          MuiTableCell: {
            root: {
              border: '1px solid #dde3ee',
              borderBottom: '1px solid #dde3ee',
            },
            body: {
              fontSize: '13px',
              fontWeight: 300,
              lineHeight: '1',
              padding: '5px !important',
              '&:nth-child(2)': {
                width: 139,
              },
              '&:nth-child(4)': {
                width: 79,
              },
              '&:nth-child(6)': {
                width: 79,
              },
              '&:nth-child(8)': {
                width: 139,
              },
              '&:nth-child(10)': {
                width: 139,
              },
              '&:nth-child(14)': {
                width: 29,
              },
            },
            head: {
              fontSize: '1rem',
            },
          },
        }}
      />
    </TableContainer>
  );

  saveName = (name, index) => {
    const { data } = this.state;
    if (data.length === index + 1) {
      this.addMNewRow();
    }
    this.setState(prevState => {
      const newItems = [...prevState.data];
      newItems[index].name = name;
      return { data: newItems, changes: true };
    });
  };

  saveDefault = (defaultValue, index) => {
    this.setState(prevState => {
      const newItems = [...prevState.data];
      newItems[index].default = defaultValue;
      return { data: newItems, changes: true };
    });
  };

  saveDescription = (description, index) => {
    this.setState(prevState => {
      const newItems = [...prevState.data];
      newItems[index].description = description;
      return { data: newItems, changes: true };
    });
  };

  changeRequired = index => {
    this.setState(prevState => {
      const newItems = [...prevState.data];
      newItems[index].required = !newItems[index].required;
      return { data: newItems, changes: true };
    });
  };

  thirdTab = () => (
    <TableContainer style={cn.tableContainerWrapper}>
      <TableContent
        tableData={this.state.params}
        tableOptions={this.options}
        columns={this.createColumnsOutput()}

        styles={{
          MuiTableCell: {
            root: {
              border: '1px solid #dde3ee',
              borderBottom: '1px solid #dde3ee',
            },
            body: {
              fontSize: '13px',
              fontWeight: 300,
              lineHeight: '1',
              padding: '5px !important',
              '&:nth-child(2)': {
                width: 189,
              },
              '&:nth-child(6)': {
                width: 29,
              },
            },
            head: {
              fontSize: '1rem',
            },
          },
        }}
      />
    </TableContainer>
  );

  createColumns = () =>
    configureColumns(
      this.saveName,
      this.changeRequired,
      this.saveDefault,
      this.saveDescription,
      this.handleClickOpen,
      this.deleteInputRow,
    );

  createColumnsOutput = () =>
    configureColumnsOutput(
      this.changeName,
      this.changeDescription,
      this.deleteOutputRow,
    );

  firstTab = () => {
    const {
      cpu,
      timeout,
      retries,
      location,
      gpu,
      method,
      region,
      memory,
      success,
    } = this.state;
    const {
      lookups: { locations, result_methods },
    } = this.props;

    console.log(method);

    return (
      <>
        <div className={cn.containerRow}>
          <div className={cn.containerLeft}>
            <div className={cn.label}>CPU</div>
            <CustomInput
              className={cn.rowPadding}
              type="number"
              label="CPU"
              value={cpu}
              name="cpu"
              onChange={e =>
                this.setState({ cpu: e.target.value, changes: true })
              }
              inputStyles={{ input: cn.inputStyles }}
            />
          </div>
          <div className={cn.containerMiddle}>
            <div className={cn.label}>Timeout</div>
            <CustomInput
              type="time"
              className={cn.rowPadding}
              label="Timeout"
              value={timeout}
              name="dockerImage"
              onChange={e =>
                this.setState({ timeout: e.target.value, changes: true })
              }
              inputStyles={{ input: cn.inputStyles }}
            />
          </div>
          <div className={cn.containerRight}>
            <div className={cn.label}>Max Retries</div>
            <CustomInput
              className={cn.rowPadding}
              type="number"
              label="Max Retries"
              value={retries}
              name="retries"
              onChange={e =>
                this.setState({ retries: e.target.value, changes: true })
              }
              inputStyles={{ input: cn.inputStyles }}
            />
          </div>
        </div>
        <div className={cn.containerRow}>
          <div className={cn.containerLeft}>
            <div className={cn.label}>GPU</div>
            <CustomInput
              className={cn.rowPadding}
              label="GPU"
              type="number"
              value={gpu}
              name="gpu"
              onChange={e =>
                this.setState({ gpu: e.target.value, changes: true })
              }
              inputStyles={{ input: cn.inputStyles }}
            />
          </div>
          <FormControl className={cn.containerMiddle}>
            <div className={cn.label}>Location</div>
            <NativeSelect
              disabled={region !== 'empty'}
              value={location}
              onChange={e =>
                this.setState({ location: e.target.value, changes: true })
              }
              input={
                region !== 'empty' ? (
                  <BootstrapInputDisabled name="location" id="location" />
                ) : (
                  <BootstrapInput name="location" id="location" />
                )
              }
            >
              <option key="empty" value="empty" />
              {locations.map(item => (
                <option key={item.uuid} value={item.location_id}>
                  {item.location_name}
                </option>
              ))}
            </NativeSelect>
          </FormControl>
          <FormControl className={cn.containerRight}>
            <div className={cn.label}>Result Method</div>
            <NativeSelect
              value={method}
              onChange={e =>
                this.setState({ method: e.target.value, changes: true })
              }
              input={<BootstrapInput name="method" id="method" />}
            >
              <option key="empty" value="empty" />
              {result_methods.map(item => (
                <option key={item.uuid} value={item.result_method_id}>
                  {item.result_method_name}
                </option>
              ))}
            </NativeSelect>
          </FormControl>
        </div>
        <div className={cn.containerRow}>
          <div className={cn.containerLeft}>
            <div className={cn.label}>Memory GB</div>
            <CustomInput
              className={cn.rowPadding}
              label="Memory GB"
              type="number"
              value={memory}
              name="memory"
              onChange={e =>
                this.setState({ memory: e.target.value, changes: true })
              }
              inputStyles={{ input: cn.inputStyles }}
            />
          </div>
          <FormControl className={cn.containerMiddle}>
            <div className={cn.label}>Region Hint</div>
            <NativeSelect
              disabled={location !== 'empty'}
              value={region}
              onChange={e =>
                this.setState({ region: e.target.value, changes: true })
              }
              input={
                location !== 'empty' ? (
                  <BootstrapInputDisabled name="region" id="region" />
                ) : (
                  <BootstrapInput name="region" id="region" />
                )
              }
            >
              <option key="empty" value="empty" />
              {locations.map(item => (
                <option key={item.uuid} value={item.location_id}>
                  {item.location_name}
                </option>
              ))}
            </NativeSelect>
          </FormControl>
          <div className={cn.containerRight}>
            <div className={cn.label}>Success Text</div>
            {Number(method) === 2 ? (
              <CustomInput
                className={cn.rowPadding}
                label="Success Text"
                value={success}
                name="success"
                onChange={e =>
                  this.setState({ success: e.target.value, changes: true })
                }
                inputStyles={{
                  input: cn.inputStyles,
                }}
              />
            ) : (
              <CustomInputBack
                className={cn.rowPadding}
                label="Success Text"
                value={success}
                name="success"
                onChange={e =>
                  this.setState({ success: e.target.value, changes: true })
                }
                inputStyles={{
                  input: cn.inputStyles,
                }}
              />
            )}
          </div>
        </div>
      </>
    );
  };

  handleChangeProject = reference => {
    this.setState(prevState => {
      const newItems = [...prevState.data];
      newItems[this.state.index].reference = 'Reference Added';
      return { data: newItems, project: reference, changes: true };
    });
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
      label,
      definitionName,
      dockerImage,
      startupCommand,
      description,
      tab,
      open,
      project,
      parameter,
      changes,
    } = this.state;
    const id = 1;
    let content = '';
    if (tab === 0) {
      content = this.firstTab();
    }
    if (tab === 1) {
      content = this.secondTab();
    }
    if (tab === 2) {
      content = this.thirdTab();
    }

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
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  history.push(`/projects`);
                }}
              >
                Lynx (Prod)
              </div>
              <div
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  history.push(`/projects/${id}/definitions/unarchived`);
                }}
              >
                Job Definitions
              </div>
              <div>{label}</div>
            </Breadcrumbs>
            <div className={cn.flex} />
            <div className={cn.iconContainer}>
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
        <Paper className={cn.contentAlign}>
          <div className={cn.containerRow}>
            <div className={classNames(cn.container, cn.inputSmall)}>
              <div className={cn.label}>Job Definition</div>
              <CustomInput
                label="Job Definition"
                value={definitionName}
                name="definitionName"
                onChange={e =>
                  this.setState({
                    definitionName: e.target.value,
                    changes: true,
                  })
                }
                inputStyles={{ input: cn.inputStyles }}
              />
            </div>
            <div className={classNames(cn.containerLast, cn.inputMedium)}>
              <div className={cn.label}>Docker Image</div>
              <CustomInput
                label="Docker Image"
                value={dockerImage}
                name="dockerImage"
                onChange={e =>
                  this.setState({ dockerImage: e.target.value, changes: true })
                }
                inputStyles={{ input: cn.inputStyles }}
              />
            </div>
          </div>
          <div className={cn.containerLast}>
            <div className={cn.label}>Startup Command</div>
            <CustomInputTextArea
              multiline
              label="Startup Command"
              value={startupCommand}
              name="startupCommand"
              onChange={e =>
                this.setState({ startupCommand: e.target.value, changes: true })
              }
              inputStyles={{ input: cn.inputStyles }}
              className={cn.top}
            />
          </div>
          <div className={classNames(cn.containerLast, cn.topItem)}>
            <div className={cn.label}>Description</div>
            <CustomInputTextArea
              multiline
              label="Description"
              value={description}
              name="description"
              onChange={e =>
                this.setState({ description: e.target.value, changes: true })
              }
              inputStyles={{ input: cn.inputStyles }}
              className={cn.top}
            />
          </div>
        </Paper>
        <Paper className={cn.contentAlignSecond}>
          <Tabs
            value={tab}
            indicatorColor="primary"
            textColor="primary"
            classes={{
              root: cn.tabsWrapper,
            }}
            onChange={this.handleChangeTab}
            TabIndicatorProps={{
              style: {
                backgroundColor: '#3e96ed',
              },
            }}
          >
            <Tab
              style={{
                width: '300px',
                fontSize: 14,
                fontWeight: 400,
                minHeight: 44,
                color: tab === 0 ? '#3e96ed' : '#62738d',
                textTransform: 'capitalize',
                borderBottom: '1px solid transparent',
                borderRight: '1px solid #cfd7e6',
              }}
              label="Configurations"
            />
            <Tab
              style={{
                width: '300px',
                fontSize: 14,
                fontWeight: 400,
                minHeight: 44,
                color: tab === 1 ? '#3e96ed' : '#62738d',
                textTransform: 'capitalize',
                borderBottom: '1px solid transparent',
                borderRight: '1px solid #cfd7e6',
              }}
              label="Inputs"
            />
            <Tab
              style={{
                width: '300px',
                color: tab === 2 ? '#3e96ed' : '#62738d',
                fontSize: 14,
                fontWeight: 400,
                minHeight: 44,
                textTransform: 'capitalize',
                borderBottom: '1px solid transparent',
                borderRight: '1px solid #cfd7e6',
              }}
              label="Outputs"
            />
          </Tabs>
          {tab === 0 && <div className={cn.tabValue}>{content}</div>}
          {tab !== 0 && <div className={cn.tabValueAlt}>{content}</div>}
        </Paper>
        <Dialog
          disableBackdropClick
          disableEscapeKeyDown
          open={open}
          onClose={() => this.setState({ open: false })}
        >
          <DialogContent style={{ padding: '20px' }}>
            <form>
              <div className={cn.label}>Region Hint</div>
              <NativeSelect
                style={{ width: '250px', marginBottom: '10px' }}
                value={project}
                onChange={e => this.handleChangeProject(e.target.value)}
                input={<BootstrapInput name="project" id="project" />}
              >
                <option value="" />
                <option value={10}>Ten</option>
                <option value={20}>Twenty</option>
                <option value={30}>Thirty</option>
              </NativeSelect>
              <CustomInput
                label="Parameter"
                value={parameter}
                name="referenceParameter"
                onChange={e => this.changeReferenceParameter(e.target.value)}
                inputStyles={{ input: cn.inputStyles }}
              />
            </form>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => this.setState({ open: false })}
              color="primary"
            >
              Cancel
            </Button>
            <Button
              onClick={() => this.setState({ open: false })}
              color="primary"
            >
              Ok
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
}

const mapStateToProps = state => ({
  hamburger: state.hamburger,
  lookups: state.lookups,
  // projects: state.projects,
});

const mapDispatchToProps = {
  // getProjects: getProjectsAction,
  logoutUserProps: logoutUser,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DefinitionPage);