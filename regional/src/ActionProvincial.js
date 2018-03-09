import * as React from 'react';
import { Step, Stepper, StepLabel } from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

class ActionProvincial extends React.Component {
  state = {
    finished: false,
    stepIndex: 0,
  };
  handleNext = () => {
    const { stepIndex } = this.state;
    this.setState({
      stepIndex: stepIndex + 1
    });
  };
  handlePrev = () => {
    const { stepIndex } = this.state;
    if (stepIndex > 0) {
      this.setState({ stepIndex: stepIndex - 1 });
    }
  };
  selectPhoto(){
    console.log("wibble");
  }
  render() {
    const { stepIndex } = this.state;
    const contentStyle = { margin: '0 16px' };

    return (
      <div style={{width: '100%', maxWidth: 700, margin: 'auto',textAlign:'center'}}>
        <Stepper activeStep={stepIndex}>
          <Step>
            <StepLabel>Select the provincial body</StepLabel>
          </Step>
          <Step>
            <StepLabel>Click to send an email</StepLabel>
          </Step>
        </Stepper>
        <div style={contentStyle}>
          {stepIndex === 0 ? <DropDownMenu value={1}>
          <MenuItem value={1} primaryText="person1@conservation.gov" />
          <MenuItem value={2} primaryText="person2@conservation.gov" />
        </DropDownMenu> : null}
              <div style={{marginTop: 12}}>
                <FlatButton label="Back" disabled={stepIndex === 0} onClick={this.handlePrev} />
                <RaisedButton label={stepIndex === 1 ? 'Finish' : 'Next'} onClick={stepIndex === 1 ? this.props.closeDialog : this.handleNext} primary={true} />
            </div>
        </div>
      </div>
    );
  }
}

export default ActionProvincial;