import * as React from 'react'; class MapToolbar extends React.Component{ render() { return (
<div id="card-style-map-controls" class="toolbar">
    <div class="grid">
        <div class="col">
            <div style={{display: 'block'}}>
                <div class="flex-parent w-full" aria-describedby="tooltip-18">
                    <button type="button" class="border-r border--darken50 round-l btn btn--lighten75 color-text btn--pill w-full flex-parent flex-parent--center-main flex-parent--center-cross px3 py3">
                                    <svg role="presentation" focusable="false" class="events-none icon" style={{width: '18px',height: '18px'}}>
                                        <svg id="icon-plus" viewBox="0 0 18 18" width="100%" height="100%"><path d="M9 4c-.6 0-1 .4-1 1v3H5c-.6 0-1 .4-1 1s.4 1 1 1h3v3c0 .6.4 1 1 1s1-.4 1-1v-3h3c.6 0 1-.4 1-1s-.4-1-1-1h-3V5c0-.6-.4-1-1-1z"></path></svg>
                                    </svg>
                                </button>
                </div>
                <div class="hide-visually" id="tooltip-18" role="tooltip">
                    <div>
                        Zoom in
                        <div class="inline-block ml6">
                            <span>
                                        <span class="txt-kbd txt-kbd--dark txt-s">+</span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col">
            <div style={{display: 'block'}}>
                <div class="flex-parent w-full" aria-describedby="tooltip-19">
                    <button type="button" class="border-r border--darken50 unround btn btn--lighten75 color-text btn--pill w-full flex-parent flex-parent--center-main flex-parent--center-cross px3 py3">
                                <svg role="presentation" focusable="false" class="events-none icon" style={{width: '18px',height: '18px'}}>
                                    <svg id="icon-minus" viewBox="0 0 18 18" width="100%" height="100%"><path d="M5 8c-.6 0-1 .4-1 1s.4 1 1 1h8c.6 0 1-.4 1-1s-.4-1-1-1H5z"></path></svg>
                                </svg>
                            </button>
                </div>
                <div class="hide-visually" role="tooltip" id="tooltip-19">
                    <div>
                        Zoom out
                        <div class="inline-block ml6">
                            <span>
                                    <span class="txt-kbd txt-kbd--dark txt-s">_</span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col">
            <div style={{display: 'block'}}>
                <button type="button" class="btn border-r border--darken50 unround btn btn--lighten75 color-text btn--pill w-full flex-parent flex-parent--center-main flex-parent--center-cross px3 py3" aria-describedby="tooltip-20">
                    <svg role="presentation" focusable="false" class="events-none icon" style={{width: '18px',height: '18px'}}>
                        <svg id="icon-street" viewBox="0 0 18 18" width="100%" height="100%"><path d="M13 4.1L12 3H6L5 4.1l-2 9.8L4 15h10l1-1.1-2-9.8zM10 13H8v-3h2v3zm0-5H8V5h2v3z"></path></svg>
                    </svg>
                </button>
                <div class="hide-visually" role="tooltip" id="tooltip-20">Reset pitch</div>
            </div>
        </div>
        <div class="col">
            <div style={{display: 'block'}}>
                <button class=" border-r border--darken50 unround btn btn--lighten75 color-text btn--pill w-full flex-parent flex-parent--center-main flex-parent--center-cross px3 py3" aria-describedby="tooltip-21">
                                <span class="block" style={{transform: 'rotate(0deg)'}}>
                                    <svg role="presentation" focusable="false" class="events-none icon" style={{width: '18px',height: '18px'}}>
                                        <svg id="icon-compass" viewBox="0 0 18 18" width="100%" height="100%"><path d="M5.5 14.2c-.9.8-1.9 0-1.5-1l4-9c.2-.4.6-.8 1-.8s.8.4 1 .8l4 9c.4 1-.6 1.8-1.5 1l-3.5-3-3.5 3z"></path></svg>
                                    </svg>
                                </span>
                            </button>
                <div class="hide-visually" role="tooltip" id="tooltip-21">Reset north</div>
            </div>
        </div>
        <div class="col">
            <div style={{display: 'block'}}>
                <div class="flex-parent w-full" aria-describedby="tooltip-22">
                    <button type="button" class="round-r btn btn--lighten75 color-text btn--pill w-full flex-parent flex-parent--center-main flex-parent--center-cross px3 py3 ">
                                    <svg role="presentation" focusable="false" class="events-none icon" style={{width: '18px', height: '18px'}}>
                                        <svg id="icon-fullscreen" viewBox="0 0 18 18" width="100%" height="100%"><path d="M4 3c-.5 0-1 .5-1 1v4h.5l1.3-1.7c1 .8 2 1.7 3.1 2.7-1.1 1.1-2.1 2-3.1 2.7L3.5 10H3v4c0 .5.5 1 1 1h4v-.5l-1.7-1.3c.8-1 1.7-2.1 2.7-3.1 1.1 1.1 2 2.1 2.7 3.2L10 14.5v.5h4c.5 0 1-.5 1-1v-4h-.5l-1.3 1.7c-1-.8-2.1-1.7-3.2-2.7 1.1-1 2.2-1.9 3.2-2.7L14.5 8h.5V4c0-.5-.5-1-1-1h-4v.5l1.7 1.3c-.8 1-1.7 2.1-2.7 3.1-1-1.1-1.9-2.1-2.7-3.1L8 3.5V3H4z"></path></svg>
                                    </svg>
                                </button>
                </div>
                <div class="hide-visually" role="tooltip" id="tooltip-22">
                    <div>
                        Fullscreen
                        <div class="inline-block ml6"><span><span class="txt-kbd txt-kbd--dark txt-s">f</span></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div> ); } } export default MapToolbar;
