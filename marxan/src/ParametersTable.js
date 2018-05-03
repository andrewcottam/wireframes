import React from 'react';
import ReactTable from "react-table";

class ParametersTable extends React.Component {
    render() {
        // let c = this.props.runParams && this.props.runParams.map((param) => {
        //     return (<TableRow displayBorder={false}><TableRowColumn style={{height:'12px'}}>{param.key}</TableRowColumn><TableRowColumn><TextField id={param.key + "_value"} style={{height:'12px'}} inputStyle={{height:'12px'}} value={param.value}/></TableRowColumn></TableRow>);
        // });
        return (
            <div id="paramsTable">
                <ReactTable
                showPagination={false}
                className={'summary_infoTable'}
                minRows={0}
                pageSize={200}
                noDataText=''
                data={this.props.runParams}
                columns={[{
                   Header: 'Parameter', 
                   accessor: 'key',
                   width:100,
                   headerStyle:{'textAlign':'left'}                             
                },{
                   Header: 'Value',
                   accessor: 'value',
                   width:140,
                  headerStyle:{'textAlign':'left'}
                }]}
              />
          </div>
        );
    }
}
export default ParametersTable;
