import * as React from 'react';
import { Step, Stepper, StepLabel } from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import FontAwesome from 'react-fontawesome';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

class ActionSDM extends React.Component {
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
  render() {
    const { stepIndex } = this.state;
    const contentStyle = { margin: '0 16px' };

    return (
      <div style={{width: '100%', maxWidth: 700, margin: 'auto',textAlign:'center'}}>
        <Stepper activeStep={stepIndex}>
          <Step>
            <StepLabel>Select your species dataset</StepLabel>
          </Step>
          <Step>
            <StepLabel>Select your SDM model</StepLabel>
          </Step>
        </Stepper>
        <div style={contentStyle}>
          {stepIndex === 0 ? <DropDownMenu value={1}>
          <MenuItem value={1} primaryText="Big turtle" />
          <MenuItem value={2} primaryText="Bigger turtle" />
          <MenuItem value={3} primaryText="Really big turtle" />
        </DropDownMenu> : null}
          {stepIndex === 1 ? <DropDownMenu value={1}>
          <MenuItem value={1} primaryText="MaxEnt" />
          <MenuItem value={2} primaryText="Bayesian" />
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

export default ActionSDM;
