import * as React from 'react';
import { List, ListItem } from 'material-ui/List';

class ActionShowRecentImagery extends React.Component {
    constructor(props) {
        super(props);
        this.state = { visibility: false };
    }
    addImagery() {
        if (this.props.map.getLayer('Imagery')) {
            var newProp = (this.props.map.getLayoutProperty("Imagery", 'visibility') === 'visible') ? 'none' : 'visible';
            this.props.map.setLayoutProperty("Imagery", 'visibility', newProp); //toggle the imagery
            this.setState({ visibility: newProp });
        }
        else {
            this.props.map.addLayer({
                'id': 'Imagery',
                'type': 'raster',
                'source': {
                    'type': 'raster',
                    'tiles': [
                        'https://a.tiles.mapbox.com/v4/digitalglobe.nal0g75k/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZGlnaXRhbGdsb2JlIiwiYSI6ImIzMWY3NDA3NjlhYThlNjdiMTA2MGMxNzU0ZDE2YzY4In0.8jtWjgDsAwqFouTWzSnkJw',
                    ],
                    'tileSize': 256
                },
                'maxzoom': 19,
                'layout': {
                    'visibility': 'visible'
                },
                'paint': {}
            }, this.props.map.style.stylesheet.layers[1].id); //used to be Landuse -National park
            this.setState({ visibility: 'visible' });
        }
    }

    render() {
        return (
            <List>
                <ListItem primaryText={(this.state.visibility==='visible' ? "Hide " : "Show ") + "recent imagery"} onClick={this.addImagery.bind(this)}/>
            </List>
        );
    }
}

export default ActionShowRecentImagery;
