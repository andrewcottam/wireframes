import * as React from 'react';
class MapToolbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            color: props.initialColor
        };
    }
    zoomIn(){
        this.props.map.zoomIn();
    }
    render() {
        return (
            <div class="toolbar">
            <div class="grid">
                <button type="button" class="btn" onClick={this.zoomIn.bind(this)}>
                    <svg role="presentation" focusable="false" class="events-none icon" style={{width: '18px',height: '18px'}}>
                        <svg id="icon-plus" viewBox="0 0 18 18" width="100%" height="100%"><path d="M9 4c-.6 0-1 .4-1 1v3H5c-.6 0-1 .4-1 1s.4 1 1 1h3v3c0 .6.4 1 1 1s1-.4 1-1v-3h3c.6 0 1-.4 1-1s-.4-1-1-1h-3V5c0-.6-.4-1-1-1z"></path></svg>
                    </svg>
                </button>
                <button type="button" class="btn">
                    <svg role="presentation" focusable="false" class="events-none icon" style={{width: '18px',height: '18px'}}>
                        <svg id="icon-minus" viewBox="0 0 18 18" width="100%" height="100%">
                            <path d="M5 8c-.6 0-1 .4-1 1s.4 1 1 1h8c.6 0 1-.4 1-1s-.4-1-1-1H5z"></path>
                        </svg>
                    </svg>
                </button>
                <button type="button" class="btn">
                    <svg role="presentation" focusable="false" class="events-none icon" style={{width: '18px',height: '18px'}}>
                        <svg id="icon-street" viewBox="0 0 18 18" width="100%" height="100%">
                            <path d="M13 4.1L12 3H6L5 4.1l-2 9.8L4 15h10l1-1.1-2-9.8zM10 13H8v-3h2v3zm0-5H8V5h2v3z"></path>
                        </svg>
                    </svg>
                    </button>
                <button type="button" class="btn">
                    <span class="block" style={{transform: 'rotate(0deg)'}}>
                        <svg role="presentation" focusable="false" class="events-none icon" style={{width: '18px',height: '18px'}}>
                            <svg id="icon-compass" viewBox="0 0 18 18" width="100%" height="100%">
                                <path d="M5.5 14.2c-.9.8-1.9 0-1.5-1l4-9c.2-.4.6-.8 1-.8s.8.4 1 .8l4 9c.4 1-.6 1.8-1.5 1l-3.5-3-3.5 3z"></path></svg>
                        </svg>
                    </span>
                </button>
                <button type="button" class="btn" style={{borderRightWidth: '0px'}}>
                    <svg role="presentation" focusable="false" class="events-none icon" style={{width: '18px', height: '18px'}}>
                        <svg id="icon-fullscreen" viewBox="0 0 18 18" width="100%" height="100%">
                            <path d="M4 3c-.5 0-1 .5-1 1v4h.5l1.3-1.7c1 .8 2 1.7 3.1 2.7-1.1 1.1-2.1 2-3.1 2.7L3.5 10H3v4c0 .5.5 1 1 1h4v-.5l-1.7-1.3c.8-1 1.7-2.1 2.7-3.1 1.1 1.1 2 2.1 2.7 3.2L10 14.5v.5h4c.5 0 1-.5 1-1v-4h-.5l-1.3 1.7c-1-.8-2.1-1.7-3.2-2.7 1.1-1 2.2-1.9 3.2-2.7L14.5 8h.5V4c0-.5-.5-1-1-1h-4v.5l1.7 1.3c-.8 1-1.7 2.1-2.7 3.1-1-1.1-1.9-2.1-2.7-3.1L8 3.5V3H4z"></path>
                        </svg>
                    </svg>
                </button>
            </div>
        </div>);
    }
}

export default MapToolbar;
