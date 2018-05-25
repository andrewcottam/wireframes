import * as React from 'react';
import Divider from 'material-ui/Divider';
import { Sparklines, SparklinesLine, SparklinesSpots, SparklinesReferenceLine } from 'react-sparklines';
import FontAwesome from 'react-fontawesome';

class IndicatorSummary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { favorited: false };
    }
    onClick(e) {
        window.open(
            window.basepath.replace("acp", "regional") + "indicator/" + this.props.id + "/" + this.props.iso3, '_blank'
        );
    }
    favorite(e) {
        e.preventDefault();
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        this.setState({ favorited: !this.state.favorited });
    }
    render() {
        let data = this.props.data;
        let sparkline = (data.length ?
            <Sparklines data={data}>
                <SparklinesLine /> 
                <SparklinesSpots />
            </Sparklines> :
                <div style={{fontSize:'12px'}}><i className="fas fa-exclamation-circle" style={{color:'red',padding:'0px 5px'}}></i>No trend data available</div>);
        return (
            <div className="IndicatorSummary" onClick={this.onClick.bind(this)} title="Click to view the indicator">
                <div className="IndicatorSummaryTitle">{this.props.title}</div>
                <Divider/>
                <div className="sparklineDiv">
                    {sparkline}
                </div>
                <div className="favorite" title={"Click to " + ((this.state.favorited) ? 'remove from ' : 'add to ') + "Favorites"} onClick={this.favorite.bind(this)}>
                    {(this.state.favorited) ?  <FontAwesome name='star' style={{ color:'#FAB800' }}/> : <FontAwesome name='star' />}
                </div>
            </div>
        );
    }
}

export default IndicatorSummary;
