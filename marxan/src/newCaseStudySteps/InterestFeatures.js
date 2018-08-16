import React, { Component } from 'react';
import { List, ListItem, makeSelectable } from 'material-ui/List';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import { grey400 } from 'material-ui/styles/colors';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';

let SelectableList = makeSelectable(List);

function wrapState(ComposedComponent) {
    return class SelectableList extends Component {
        static propTypes = {
            children: PropTypes.node.isRequired,
            defaultValue: PropTypes.number.isRequired,
        };

        componentWillMount() {
            this.setState({
                selectedIndex: this.props.defaultValue,
            });
        }

        handleRequestChange = (event, index) => {
            this.setState({
                selectedIndex: index,
            });
            this.props.changeFeature(event, index);
        };

        render() {
            return (
                <ComposedComponent
                  value={this.state.selectedIndex}
                  onChange={this.handleRequestChange}
                  style={{'height':'235px','overflow':'auto'}}
                >
          {this.props.children}
        </ComposedComponent>
            );
        }
    };
}

SelectableList = wrapState(SelectableList);

class InterestFeatures extends React.Component {
    constructor(props) {
        super(props);
        this.state = { selectedFeature: undefined };
    }
    componentDidMount() {
        this.props.getInterestFeatures();
    }
    changeFeature(event, feature) {
        this.setState({ selectedFeature: feature });
    }

    render() {
        const iconButtonElement = (
            <IconButton
                touch={true}
                tooltip="more"
                tooltipPosition="bottom-left"
            >
            <MoreVertIcon color={grey400} />
            </IconButton>
        );
        
        const rightIconMenu = (
            <IconMenu iconButtonElement={iconButtonElement}>
            <MenuItem>Info</MenuItem>
            <MenuItem>View</MenuItem>
            <MenuItem>Prioritise</MenuItem>
        </IconMenu>
        );
        
        return (
            <React.Fragment>
                <div className={'newPUDialogPane'}>
                    <SelectableList defaultValue ={0} changeFeature={this.changeFeature.bind(this)}>
                        {this.props.interestFeatures.map((item)=>{return <ListItem rightIconButton={rightIconMenu} primaryText={item} secondaryText="Something groovy" key={item} value={item}/>})}
                    </SelectableList>
                    <RaisedButton label="Delete" primary={true} className="scenariosBtn" disabled={!this.state.selectedFeature}/>
                    <RaisedButton label="New" primary={true} className="scenariosBtn" onClick={this.props.openNewInterestFeatureDialog}/>
                </div>
            </React.Fragment>
        );
    }
}

export default InterestFeatures;
