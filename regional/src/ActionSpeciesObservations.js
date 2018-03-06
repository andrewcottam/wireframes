import * as React from 'react';
import { Step, Stepper, StepLabel } from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import FontAwesome from 'react-fontawesome';

class ActionSpeciesObservations extends React.Component {
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
        <div>There are a number of ways to contribute species observations:</div>
        <ul>
          <li>By using an online data capture tool (e.g. eBird)</li>
          <li>By using the Integrated Publishing Toolkit from <a href="https://www.gbif.org/" target="_blank">GBIF</a></li>
          <li>By uploading a spreadsheet of species observations (below)</li>
        </ul>
        <Stepper activeStep={stepIndex}>
          <Step>
            <StepLabel>Select your spreadsheet</StepLabel>
          </Step>
          <Step>
            <StepLabel>Validate</StepLabel>
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

export default ActionSpeciesObservations;
