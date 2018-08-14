import React from 'react';
import Dialog from 'material-ui/Dialog';
import { Step, Stepper, StepLabel } from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Metadata from './newCaseStudySteps/Metadata';
import PlanningUnits from './newCaseStudySteps/PlanningUnits';
import InterestFeatures from './newCaseStudySteps/InterestFeatures';
import Costs from './newCaseStudySteps/Costs';

class NewCaseStudyDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            steps: ['Metadata', 'Planning Units', 'Interest features', 'Costs'],
            finished: false,
            stepIndex: 0,
            name: '',
            description: '',
            pu:''
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
    createNewScenario() {
        if (this.state.name === '') {
            this.setState({ validName: false });
        }
        else {
            this.props.createNewScenario({ name: this.state.name, description: this.state.description });
            this.closeNewCaseStudyDialog();
        }
    }
    closeNewCaseStudyDialog() {
        this.setState({ validName: undefined });
        this.props.closeNewCaseStudyDialog();
    }
    setName(value) {
        this.setState({ name: value });
    }
    setDescription(value) {
        this.setState({ description: value });
    }
    getPlanningUnits(){
        this.props.getPlanningUnits();
    }
    changePU(value){
        this.setState({pu:value});
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
                        <RaisedButton label={stepIndex === (this.state.steps.length-1) ? 'Finish' : 'Next'} onClick={stepIndex === (this.state.steps.length-1) ? this.closeNewCaseStudyDialog.bind(this) : this.handleNext} primary={true} />
                    </div>
                </div>
            </div>
        ];
        let c = <div>
                    {stepIndex === 0 ? <Metadata name={this.state.name} description={this.state.description} setName={this.setName.bind(this)} setDescription={this.setDescription.bind(this)}/> : null}
                    {stepIndex === 1 ? <PlanningUnits getPlanningUnits={this.getPlanningUnits.bind(this)} planningUnits={this.props.planningUnits} changeItem={this.changePU.bind(this)} pu={this.state.pu} openNewPlanningUnitDialog={this.props.openNewPlanningUnitDialog} /> : null}
                    {stepIndex === 2 ? <InterestFeatures/> : null}
                    {stepIndex === 3 ? <Costs/> : null}
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
