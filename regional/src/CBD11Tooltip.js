import * as React from 'react';
import Chip from 'material-ui/Chip';

class CBD11Tooltip extends React.Component {
    render() {
        if (this.props.active) {
            return (
                <div>
                    <Chip backgroundColor='#00BCD4' labelColor='white'>
                        {this.props.label}
                    </Chip>
                </div>
            );
        }
        return null;
    }
}

export default CBD11Tooltip;
