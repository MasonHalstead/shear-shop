import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import Footer from 'components/common/footer/Footer';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import { Drawer, List, Divider, Tooltip } from '@material-ui/core';
import { setHamburger as setHamburgerAction } from 'ducks/actions';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { routes } from 'layout/routes';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { styles } from './styles';
import cn from './PrivateLayout.module.scss';

const { PUBLIC_URL, REACT_APP_VERSION } = process.env;

export class PrivateLayoutWrapper extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object,
    history: PropTypes.object,
    children: PropTypes.any,
    setHamburger: PropTypes.func,
  };

  state = {
    open: false,
  };

  handleDrawerOpen = () => {
    const { open } = this.state;
    const { setHamburger } = this.props;
    this.setState({ open: !open }, () => {
      setHamburger({ open: !open });
    });
  };

  render() {
    const { open } = this.state;
    const { classes, history } = this.props;
    const id = 1;

    return (
      <div className={cn.cognBody}>
        <Drawer
          className={clsx(classes.drawer, {
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          })}
          classes={{
            paper: clsx({
              [classes.drawerOpen]: open,
              [classes.drawerClose]: !open,
            }),
          }}
          variant="permanent"
          anchor="left"
          open={open}
        >
          <div className={classes.drawerHeader}>
            <img
              className={open ? cn.imageMdBig : cn.imageMd}
              src={`${PUBLIC_URL}/${
                open ? 'logo-light.svg' : 'brain-light.svg'
              }`}
              alt="Andromeda"
            />
          </div>
          <Divider />
          <List>
            <ListItem
              button
              key="Projects"
              onClick={() => {
                history.push(`/projects`);
              }}
            >
              <Tooltip title="Projects">
                <ListItemIcon>
                  <FontAwesomeIcon
                    icon="folder-open"
                    color="white"
                    className={cn.fontIconAlign}
                  />
                </ListItemIcon>
              </Tooltip>
              <ListItemText
                primary="Projects"
                classes={{ primary: cn.rootColor, root: cn.textRoot }}
              />
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem
              button
              key="Jobs"
              onClick={() => {
                history.push(`/projects/${id}/jobs/24`);
              }}
            >
              <Tooltip title="Jobs">
                <ListItemIcon>
                  <FontAwesomeIcon
                    icon="cog"
                    color="white"
                    className={cn.fontIconAlign}
                  />
                </ListItemIcon>
              </Tooltip>
              <ListItemText
                primary="Jobs"
                classes={{ primary: cn.rootColor, root: cn.textRoot }}
              />
            </ListItem>
            {open && (
              <div className={cn.deepMenuItems}>
                <ListItem
                  classes={{ root: cn.rootColor }}

                  button
                  onClick={() => {
                    history.push(`/projects/${id}/jobs/24`);
                  }}
                >
                  Last 24 Hours
                </ListItem>
                <ListItem
                  classes={{ root: cn.rootColor }}

                  button
                  onClick={() => {
                    history.push(`/projects/${id}/jobs/7`);
                  }}
                >
                  Last 7 Days
                </ListItem>
                <ListItem
                  classes={{ root: cn.rootColor }}

                  button
                  onClick={() => {
                    history.push(`/projects/${id}/jobs/queued`);
                  }}
                >
                  Queued
                </ListItem>
                <ListItem
                  classes={{ root: cn.rootColor }}

                  button
                  onClick={() => {
                    history.push(`/projects/${id}/jobs/starting`);
                  }}
                >
                  Starting
                </ListItem>
                <ListItem
                  classes={{ root: cn.rootColor }}

                  button
                  onClick={() => {
                    history.push(`/projects/${id}/jobs/running`);
                  }}
                >
                  Running
                </ListItem>
                <ListItem
                  classes={{ root: cn.rootColor }}

                  button
                  onClick={() => {
                    history.push(`/projects/${id}/jobs/complete`);
                  }}
                >
                  Complete
                </ListItem>
                <ListItem
                  classes={{ root: cn.rootColor }}

                  button
                  onClick={() => {
                    history.push(`/projects/${id}/jobs/stopped`);
                  }}
                >
                  Stopped
                </ListItem>
                <ListItem
                  classes={{ root: cn.rootColor }}

                  button
                  onClick={() => {
                    history.push(`/projects/${id}/jobs/failed`);
                  }}
                >
                  Failed
                </ListItem>
              </div>
            )}
          </List>
          <Divider />
          <List>
            <ListItem
              button
              key="Job Definitions"
              onClick={() => {
                history.push(`/projects/${id}/definitions/unarchived`);
              }}
            >
              <Tooltip title="Job Definitions">
                <ListItemIcon>
                  <FontAwesomeIcon
                    icon="sliders-h"
                    color="white"
                    className={cn.fontIconAlign}
                  />
                </ListItemIcon>
              </Tooltip>
              <ListItemText
                primary="Job Definitions"
                classes={{ primary: cn.rootColor, root: cn.textRoot }}
              />
            </ListItem>
            {open && (
              <div className={cn.deepMenuItems}>
                <ListItem
                  classes={{ root: cn.rootColor }}

                  button
                  onClick={() => {
                    history.push(`/projects/${id}/definitions/unarchived`);
                  }}
                >
                  Unarchived
                </ListItem>
                <ListItem
                  classes={{ root: cn.rootColor }}

                  button
                  onClick={() => {
                    history.push(`/projects/${id}/definitions/archived`);
                  }}
                >
                  Archived
                </ListItem>
              </div>
            )}
          </List>
          <Divider />
          {!open && (
            <List>
              <ListItem button key="Chevron" onClick={this.handleDrawerOpen}>
                <ListItemIcon>
                  <FontAwesomeIcon
                    icon="chevron-right"
                    color="white"
                    className={cn.fontIconAlignChevron}
                  />
                </ListItemIcon>
              </ListItem>
            </List>
          )}
          <div className={cn.versionSmall}>{REACT_APP_VERSION}</div>
          {open && (
            <div className={cn.version} onClick={this.handleDrawerOpen}>
              {REACT_APP_VERSION}
              <div className={cn.closeButton}>
                <ListItem button key="Close">
                  <ListItemIcon>
                    <FontAwesomeIcon
                      icon="times"
                      color="white"
                      className={cn.fontIconAlignChevron}
                    />
                  </ListItemIcon>
                </ListItem>
              </div>
            </div>
          )}
          <Divider />
        </Drawer>
        <main
          className={classNames(
            open ? classes.content : classes.contentClosed,
            {
              [classes.contentShift]: open,
            },
          )}
        >
          <div className={cn.cognViews}>
            {this.props.children}
          </div>
        </main>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  hamburger: state.hamburger,
});

const mapDispatchToProps = {
  setHamburger: setHamburgerAction,
};

export const StyledPrivateLayout = withStyles(styles, { withTheme: true })(
  PrivateLayoutWrapper,
);

const PrivateLayout = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(StyledPrivateLayout),
);
export default PrivateLayout;
