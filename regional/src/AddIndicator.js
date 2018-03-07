import * as React from 'react';
import { Step, Stepper, StepLabel } from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

class AddIndicator extends React.Component {
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
            <StepLabel>Select your policy</StepLabel>
          </Step>
          <Step>
            <StepLabel>Select your target</StepLabel>
          </Step>
          <Step>
            <StepLabel>Describe your indicator</StepLabel>
          </Step>
        </Stepper>
        <div style={contentStyle}>
          {stepIndex === 0 ? <DropDownMenu value={1}>
          <MenuItem value={1} primaryText="Convention on Biological Diversity" />
          <MenuItem value={2} primaryText="Sustainable Development Goals" />
          <MenuItem value={3} primaryText="Framework for Nature Conservation and Protected Areas in the Pacific Islands Region" />
          <MenuItem value={4} primaryText="Fiji National Biodiversity Strategy and Action Plan" />
          <MenuItem value={5} primaryText="Solomon Islands National Biodiversity Strategy and Action Plan" />
        </DropDownMenu> : null}
          {stepIndex === 1 ? <DropDownMenu value={1}>
          <MenuItem value={1} primaryText="CBD Target 11" />
          <MenuItem value={2} primaryText="CBD Target 12" />
          <MenuItem value={3} primaryText="CBD Target 13" />
        </DropDownMenu> : null}
          {stepIndex === 2 ? <React.Fragment>
            <TextField hintText="Enter a title here"/>
            <TextField hintText="Type description here"/>
        </React.Fragment>: null}
          <div style={{marginTop: 12}}>
            <FlatButton label="Back" disabled={stepIndex === 0} onClick={this.handlePrev} />
            <RaisedButton label={stepIndex === 2 ? 'Finish' : 'Next'} onClick={stepIndex === 2 ? this.props.closeDialog : this.handleNext} primary={true} />
          </div>
        </div>
      </div>
    );
  }
}

export default AddIndicator;
