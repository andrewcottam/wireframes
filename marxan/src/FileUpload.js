import React from 'react';
import axios, { post } from 'axios';
import FontAwesome from 'react-fontawesome';

//From AshikNesin https://gist.github.com/AshikNesin/e44b1950f6a24cfcd85330ffc1713513

class FileUpload extends React.Component {

    constructor(props) {
        super(props);
        this.state = { loading: false };
        this.onChange = this.onChange.bind(this);
        this.fileUpload = this.fileUpload.bind(this);
    }

    onChange(e) {
        if (e.target.files.length) {
            this.fileUpload(e.target.files[0]);
        }
    }

    fileUpload(value) {
        this.props.fileUploaded(false, '');
        this.setState({ loading: true });
        const url = "https://db-server-blishten.c9users.io/marxan/webAPI2/postFile";
        const formData = new FormData();
        formData.append('value', value);
        formData.append('filename', value['name']);
        formData.append('parameter', this.props.parameter);
        formData.append('user', this.props.user);
        formData.append('scenario', this.props.scenario);
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        };
        post(url, formData, config).then((response) => this.finishedLoading(response));
    }

    finishedLoading(response) {
        if (response.error === undefined) {
            this.setState({ loading: false });
            this.props.fileUploaded(true, this.props.parameter,response.data.file); 
        }
    }
    render() {
        let id = "upload" + this.props.parameter;
        return (
            <form className='FileUploadForm'>
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <div style={{'width':'180px'}}>{this.props.label}</div>
                            </td>
                            <td className='uploadFileTD'> 
                                <div className='uploadFileField' style={{backgroundColor: (this.props.value  === '' && this.props.mandatory) ? 'rgba(193, 66, 66, 0.2)' : 'rgba(0, 0, 0, 0)'}}>
                                    <div className='uploadFileFieldIcon'>
                                        <label htmlFor={id}><FontAwesome name='file' title='Click to upload a file' style={{'cursor':'pointer'}}/></label>
                                        <input type="file" onChange={this.onChange} accept=".dat" style={{'display':'none', 'width':'10px'}} id={id} />
                                    </div>
                                    <div className='uploadFileFieldLabel'>{this.props.value}</div>
                                </div>
                            </td>
                            <td><FontAwesome name='sync' spin style={{'display': (this.state.loading ? 'block' : 'none'), 'marginLeft':'6px'}}/></td>
                        </tr>
                    </tbody>
                </table>
            </form>
        );
    }
}

export default FileUpload;
