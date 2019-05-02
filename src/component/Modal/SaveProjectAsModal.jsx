import React from "react";
import PropTypes from "prop-types";
import AbstractForm from "component/AbstractForm";
import { Form, Modal, Button } from "antd";
import BrowseDirectory from "component/Global/BrowseDirectory";
import ErrorBoundary from "component/ErrorBoundary";
import { A_FORM_ITEM_ERROR, A_FORM_ITEM_SUCCESS } from "constant";
import * as classes from "./classes";

const connectForm = Form.create();

@connectForm
export class SaveProjectAsModal extends AbstractForm {


  static propTypes = {
    action:  PropTypes.shape({
      updateApp: PropTypes.func.isRequired,
      copyProjectTo: PropTypes.func.isRequired
    }),
    isVisible: PropTypes.bool.isRequired,
    projectDirectory: PropTypes.string.isRequired
  }

  state = {
    locked: false,
    browseDirectoryValidateStatus: "",
    browseDirectoryValidateMessage: "",
    selectedDirectory: ""
  }

  onClickCancel = ( e ) => {
    e.preventDefault();
    this.props.action.updateApp({ saveProjectAsModal: false });
  }

  onClickOk = async ( e ) => {
    const { updateApp, copyProjectTo } = this.props.action,
          projectDirectory = this.state.selectedDirectory || this.props.projectDirectory;

    e.preventDefault();
    if ( !this.isBrowseDirectoryValid() ) {
      return;
    }
    await copyProjectTo( projectDirectory );
    updateApp({ saveProjectAsModal: false });
  }

  isBrowseDirectoryValid() {
    if ( !this.state.selectedDirectory ) {
      this.setState({ locked: true,  browseDirectoryValidateStatus: A_FORM_ITEM_ERROR });
      return false;
    }

    this.setState({ locked: false,  browseDirectoryValidateStatus: A_FORM_ITEM_SUCCESS });
    return true;
  }

  getSelectedDirectory = ( selectedDirectory ) => {
    this.setState({ selectedDirectory, locked: false });
  }


  render() {
    const { isVisible } = this.props;

    return (
      <ErrorBoundary>
        <Modal
          title="Open Project"
          visible={ isVisible }
          closable
          onCancel={this.onClickCancel}
          onOk={this.onClickOk}
          footer={[
            ( <Button
              className={ classes.BTN_CANCEL }
              key="back"
              onClick={this.onClickCancel}>Cancel</Button> ),
            ( <Button
              className={ classes.BTN_OK }
              key="submit"
              type="primary"
              autoFocus={ true }
              disabled={ this.state.locked }
              onClick={this.onClickOk}>
              Save
            </Button> )
          ]}
        >
          <Form>
            <BrowseDirectory
              defaultDirectory={ this.state.projectDirectory }
              validateStatus={ this.state.browseDirectoryValidateStatus }
              validateMessage={ this.state.browseDirectoryValidateMessage }
              getSelectedDirectory={ this.getSelectedDirectory }
              label="Project new location" />

          </Form>
        </Modal>
      </ErrorBoundary>
    );
  }
}