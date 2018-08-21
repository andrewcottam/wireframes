import React from 'react';
import Dialog from 'material-ui/Dialog';
import { Step, Stepper, StepLabel } from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Metadata from './newCaseStudySteps/Metadata';
import PlanningUnits from './newCaseStudySteps/PlanningUnits';
import SelectInterestFeatures from './newCaseStudySteps/SelectInterestFeatures';
import SelectCostFeatures from './newCaseStudySteps/SelectCostFeatures';
import Options from './newCaseStudySteps/Options';

class NewCaseStudyDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            steps: ['Info', 'Planning Units', 'Features', 'Costs', 'Options'],
            finished: false,
            stepIndex: 0,
            name: '',
            description: '',
            pu: '',
            selectedInterestFeatures: [] //an array of ids
        };
    }
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
    createNewScenarioFromWizard() {
        this.props.createNewScenarioFromWizard({ name: this.state.name, description: this.state.description, planning_grid_name: this.state.pu });
        this.closeNewCaseStudyDialog();
    }
    closeNewCaseStudyDialog() {
        this.props.closeNewCaseStudyDialog();
    }
    setName(value) {
        this.setState({ name: value });
    }
    setDescription(value) {
        this.setState({ description: value });
    }
    changePU(value) {
        this.setState({ pu: value });
    }
    render() {
        const { stepIndex } = this.state;
        const contentStyle = { margin: '0 16px' };
        const actions = [
            <div style={{width: '100%', maxWidth: 700, margin: 'auto',textAlign:'center'}}>
                {/*dynamically create the stepper */}
                <Stepper activeStep={stepIndex}>
                    {this.state.steps.map((item) => {return <Step key={item}><StepLabel>{item}</StepLabel></Step>})}
                </Stepper>
                <div style={contentStyle}>
                    <div style={{marginTop: 12}}>
                        <FlatButton label="Back" disabled={stepIndex === 0} onClick={this.handlePrev} />
                        <RaisedButton label={stepIndex === (this.state.steps.length-1) ? 'Finish' : 'Next'} onClick={stepIndex === (this.state.steps.length-1) ? this.createNewScenarioFromWizard.bind(this) : this.handleNext} primary={true} />
                    </div>
                </div>
            </div>
        ];
        let c = <div>
                    {stepIndex === 0 ? <Metadata name={this.state.name} description={this.state.description} setName={this.setName.bind(this)} setDescription={this.setDescription.bind(this)}/> : null}
                    {stepIndex === 1 ? <PlanningUnits getPlanningUnits={this.props.getPlanningUnits} planningUnits={this.props.planningUnits} changeItem={this.changePU.bind(this)} pu={this.state.pu} openNewPlanningUnitDialog={this.props.openNewPlanningUnitDialog} /> : null}
                    {stepIndex === 2 ? <SelectInterestFeatures 
                        openAllInterestFeaturesDialog={this.props.openAllInterestFeaturesDialog} 
                        selectedInterestFeatures={this.props.selectedInterestFeatures}
                        updateTargetValue={this.props.updateTargetValue}
                    /> : null}
                    {stepIndex === 3 ? <SelectCostFeatures
                        openAllCostsDialog={this.props.openAllCostsDialog}
                        selectedCosts={this.props.selectedCosts}
                    /> : null}
                    {stepIndex === 4 ? <Options/> : null}
                </div>;
        return (
            <Dialog title="New Case Study" 
                children={c} 
                actions={actions} 
                open={this.props.open} 
                onRequestClose={this.props.closeNewCaseStudyDialog} 
                contentStyle={{width:'700px'}} 
            />
        );
    }
}

export default NewCaseStudyDialog;
