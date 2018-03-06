import * as React from 'react';
import { Step, Stepper, StepLabel } from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import FontAwesome from 'react-fontawesome';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

class ActionSpatialData extends React.Component {
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
            <StepLabel>Select your shapefile</StepLabel>
          </Step>
          <Step>
            <StepLabel>Select your indicator</StepLabel>
          </Step>
          <Step>
            <StepLabel>Describe the data</StepLabel>
          </Step>
        </Stepper>
        <div style={contentStyle}>
          {stepIndex === 0 ? <div style={{textAlign:'left'}}>
            <FontAwesome name='upload' size='2x'/>
          </div> : null}
          {stepIndex === 1 ? <DropDownMenu value={1}>
          <MenuItem value={1} primaryText="Terrestrial Protected Area Coverage" />
          <MenuItem value={2} primaryText="Marine Protected Area Coverage" />
        </DropDownMenu> : null}
          {stepIndex === 2 ? <TextField hintText="Please!"/> : null}
          <div style={{marginTop: 12}}>
            <FlatButton label="Back" disabled={stepIndex === 0} onClick={this.handlePrev} />
            <RaisedButton label={stepIndex === 2 ? 'Finish' : 'Next'} onClick={stepIndex === 2 ? this.props.closeDialog : this.handleNext} primary={true} />
          </div>
        </div>
      </div>
    );
  }
}

export default ActionSpatialData;
