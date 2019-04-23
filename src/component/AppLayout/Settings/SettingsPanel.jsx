import React from "react";
import PropTypes from "prop-types";
import { Tabs, Icon } from "antd";
import { GitPane } from "./Git/GitPane";
import ErrorBoundary from "component/ErrorBoundary";

const TabPane = Tabs.TabPane;

export class SettingsPanel extends React.Component {

  static propTypes = {
    project: PropTypes.object.isRequired,
    action: PropTypes.shape({
      updateProjectPanes: PropTypes.func.isRequired
    })
  }

  onTabChange = ( targetKey ) => {
    this.props.action.updateApp({ loading: true });
    setTimeout(() => {
      this.props.action.updateProjectPanes( "settings", [ targetKey ] );
      this.props.action.updateApp({ loading: false });
    }, 10 );
  }

  render() {
   const { action, project } = this.props,
          panes = project.appPanels.settings.panes;

    let activeKey = "git";
    if ( panes.length ) {
      [ activeKey ] = panes;
    }

    return (
      <ErrorBoundary>
        <div id="cSettingsPanel">

          <Tabs
            activeKey={ activeKey }
            hideAdd={ true }
            animated={ false }
            onChange={ this.onTabChange }
          >
            <TabPane tab="GIT" key="git">
              <GitPane action={ action } git={ project.git } />
            </TabPane>

          </Tabs>

        </div>
      </ErrorBoundary>
    );
  }
}