import React from 'react';
import 'react-table/react-table.css';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import ReactTable from "react-table";
import FontAwesome from 'react-fontawesome';

class ParametersDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = { data: [], updateEnabled: false };
        this.renderEditable = this.renderEditable.bind(this);
    }
    componentDidUpdate(prevProps) {
        if (prevProps.runParams !== this.props.runParams) {
            this.setState({ data: this.props.runParams });
        }
    }
    //posts the results back to the server
    updateRunParams() {
        //ui feedback
        this.setState({updateEnabled: false});
        try {
            console.log("Need to do some validation of parameters here!");
        }
        //any errors will not create a new user
        catch (err) {
            return;
        }
        this.props.updateRunParams(this.state.data);
    }
    setUpdateEnabled(){
        this.setState({updateEnabled: true});
    }
    renderEditable(cellInfo) {
        return (
            <div
                style={{ backgroundColor: "#fafafa" }}
                contentEditable
                suppressContentEditableWarning
                onFocus={this.setUpdateEnabled.bind(this)}
                onBlur={e => {
                  const data = [...this.state.data];
                  data[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
                  this.setState({ data });
                }}
                dangerouslySetInnerHTML={{
                    __html: this.state.data[cellInfo.index]["value"]
                }}
              />
        );
    }
    render() { 
        const actions = [
            <RaisedButton label="Close" primary={true} onClick={this.props.closeParametersDialog} className="scenariosBtn"/>,
            <RaisedButton label="Save" primary={true} onClick={this.updateRunParams.bind(this)} className="scenariosBtn" disabled={!this.state.updateEnabled}/>,
        ];
        let c = 
        <React.Fragment>
            <div id="paramsTable">
                <ReactTable 
                    showPagination={false} 
                    className={'summary_infoTable'}
                    minRows={0}
                    pageSize={200}
                    data={this.state.data}
                    noDataText=''
                    columns={[{
                       Header: 'Parameter', 
                       accessor: 'key',
                       width:100,
                       headerStyle:{'textAlign':'left'},
                    },{
                       Header: 'Value',
                       accessor: 'value',
                       width:140,
                       headerStyle:{'textAlign':'left'},
                       Cell: this.renderEditable
                    }]}
              />
            </div>
            <div id="spinner"><FontAwesome spin name='sync' style={{'display': (this.props.updatingRunParameters ? 'inline-block' : 'none')}} className={'runParametersSpinner'}/></div>
        </React.Fragment>;

        return (
            <Dialog 
            overlayStyle={{display:'none'}} 
            className={'dialog'} 
            title="Run parameters" 
            children={c} 
            actions={actions} 
            open={this.props.open} 
            onRequestClose={this.props.closeParametersDialog} 
            contentStyle={{width:'382px'}}
            titleClassName={'dialogTitleStyle'}
            />
        );
    }
}

export default ParametersDialog;
