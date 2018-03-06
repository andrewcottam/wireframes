import * as React from 'react';
import { Step, Stepper, StepLabel } from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import FontAwesome from 'react-fontawesome';

class ActionProtectedAreaBoundaries extends React.Component {
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
    const contentStyle = { margin: '0 16px',textAlign:'center' };

    return (
      <div style={{width: '100%', maxWidth: 700, margin: 'auto',textAlign:'left'}}>
        <div>There are a number of ways to contribute protected area boundaries:</div>
        <ul>
          <li>For official protected areas - by contacting UNEP-WCMC or your regional observatory</li>
          <li>For other protected areas - by uploading the shapefile or digitising features on-screen (below)</li>
        </ul>
        <Stepper activeStep={stepIndex}>
          <Step>
            <StepLabel>Select your shapefile or</StepLabel>
          </Step>
          <Step>
            <StepLabel>Digitise on-screen</StepLabel>
          </Step>
          <Step>
            <StepLabel>Publish</StepLabel>
          </Step>
        </Stepper>
        <div style={contentStyle}>
          {stepIndex === 0 ? <div style={{textAlign:'left'}}>
            <FontAwesome name='upload' size='2x'/>
          </div> : null}
              <div style={{marginTop: 12}}>
                <FlatButton label="Back" disabled={stepIndex === 0} onClick={this.handlePrev} />
                <RaisedButton label={stepIndex === 2 ? 'Finish' : 'Next'} onClick={stepIndex === 2 ? this.props.closeDialog : this.handleNext} primary={true} />
            </div>
        </div>
      </div>
    );
  }
}

export default ActionProtectedAreaBoundaries;
