import * as React from 'react'; class MapToolbar extends React.Component{ render() { return (
<div id="card-style-map-controls" class="mt12 w-full round shadow-darken10">
    <div class="grid">
        <div class="col">
            <div style={{display: 'block'}}>
                <div class="flex-parent w-full" aria-describedby="tooltip-18">
                    <button type="button" class="border-r border--darken50 round-l btn btn--lighten75 color-text btn--pill w-full flex-parent flex-parent--center-main flex-parent--center-cross px3 py3">
                                    <svg role="presentation" focusable="false" class="events-none icon" style={{width: '18px',height: '18px'}}>
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
