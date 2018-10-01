import React from 'react';
import Dialog from 'material-ui/Dialog';
import { Line } from 'rc-progress';
import FontAwesome from 'react-fontawesome';

class ProgressDialog extends React.Component {
    render() {
        let percent = ((this.props.runsCompleted / this.props.numReps) * 100);
        let c = <div>
                    <div className="runLabel">Number of runs completed</div>
                    <span className='runs'>0</span><Line style={{width:'200px'}} percent={percent} strokeWidth="4" strokeColor="#00BCD4" trailWidth="4"/><span className='runs'>{this.props.numReps}</span>
                    <div id="spinner"><FontAwesome spin name='sync' style={{'display': (this.props.open ? 'inline-block' : 'none')}} className={'progressSpinner'}/></div>
                </div>;
        return (
            <Dialog title="Running" children={c} open={this.props.open} contentStyle={{width:'308px'}} titleClassName={'dialogTitleStyle'}/>
        );
    }
}

export default ProgressDialog;
