import React from 'react';
import 'react-table/react-table.css';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import RendererSelector from './RendererSelector.js';
import { BarChart, ReferenceLine, Bar, XAxis, YAxis, CartesianGrid,Tooltip,Legend } from 'recharts';

let RENDERERS = ["equal_interval", "jenks", "std_deviation", "quantile"];
let COLORCODES = ["opacity", "OrRd", "PuBu", "BuPu", "Oranges", "BuGn", "YlOrBr", "YlGn", "Reds", "RdPu", "Greens", "YlGnBu", "Purples", "GnBu", "Greys", "YlOrRd", "PuRd", "Blues", "PuBuGn", "Spectral", "RdYlGn", "RdBu", "PiYG", "PRGn", "RdYlBu", "BrBG", "RdGy", "PuOr", "Set2", "Accent", "Set1", "Set3", "Dark2", "Paired", "Pastel2", "Pastel1"];
let NUMCLASSES = ["3", "4", "5", "6", "7", "8", "9"];
let TOPCLASSES = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

class ClassificationDialog extends React.Component {
    render() {
        const actions = [
            <RaisedButton label="Close" primary={true} onClick={this.props.closeClassificationDialog} className="scenariosBtn"/>
        ];
        let breaks = this.props.dataBreaks.map((item,index)=>{return <ReferenceLine x={item} key={index} stroke="green" />});
        let c = <div>
                    <BarChart width={350} height={250} data={this.props.summaryStats}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="number" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#8884d8" />
                      {breaks}
                    </BarChart>
                  <RendererSelector values={COLORCODES} changeValue={this.props.changeColorCode} property={this.props.renderer.COLORCODE} floatingLabelText={"Colour scheme"}/>
                  <RendererSelector values={RENDERERS} changeValue={this.props.changeRenderer} property={this.props.renderer.CLASSIFICATION} floatingLabelText={"Classification"}/>
                  <RendererSelector values={NUMCLASSES} changeValue={this.props.changeNumClasses} property={this.props.renderer.NUMCLASSES} floatingLabelText={"Number of classes"}/>
                  <RendererSelector values={TOPCLASSES} changeValue={this.props.changeShowTopClasses} property={this.props.renderer.TOPCLASSES} floatingLabelText={"Show top n classes"}/>
                </div>;
        return (
            <Dialog overlayStyle={{display:'none'}} style={{'marginLeft':'73px','width':'500px'}} title="Classification" children={c} actions={actions} open={this.props.open} onRequestClose={this.props.closeClassificationDialog} contentStyle={{width:'500px'}}/>
        );
    }
}

export default ClassificationDialog;
