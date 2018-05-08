import React from 'react';
import ReactTable from "react-table";

class ParametersTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = { data: [] };
        this.renderEditable = this.renderEditable.bind(this);
    }
    componentDidUpdate(prevProps) {
        if (prevProps.runParams !== this.props.runParams) {
            this.setState({ data: this.props.runParams });
        }
    }
    renderEditable(cellInfo) {
        return (
            <div
                style={{ backgroundColor: "#fafafa" }}
                contentEditable
                suppressContentEditableWarning
                dangerouslySetInnerHTML={{
                    __html: this.state.data[cellInfo.index]["value"]
                }}
              />
        );
    }
    render() {
        const { data } = this.state;
        return (
            <div id="paramsTable">
                <ReactTable
                    showPagination={false} 
                    className={'summary_infoTable'}
                    minRows={0}
                    pageSize={200}
                    data={data}
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
        );
    }
}
export default ParametersTable;
