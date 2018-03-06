import * as React from 'react';
import Card from 'material-ui/Card';
import IndicatorContent from './IndicatorContent.js';
import {Route } from "react-router-dom";

class IndicatorCard extends React.Component {
    render() {
        return (
            <Card style={{ position: 'absolute', left: '45px', width: '440px' }} containerStyle={{ boxShadow: "rgba(0, 0, 0, 0.25) 0px 14px 45px, rgba(0, 0, 0, 0.22) 0px 10px 18px" }}>
                <Route path={window.basepath + "indicator/:id"} render={props=><IndicatorContent {...props} map={this.props.map}/> }/>
            </Card>
        );
    }
}
export default IndicatorCard;
