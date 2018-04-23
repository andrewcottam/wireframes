import React from 'react';
import axios, { post } from 'axios';
import FontAwesome from 'react-fontawesome';

//From AshikNesin https://gist.github.com/AshikNesin/e44b1950f6a24cfcd85330ffc1713513

class FileUpload extends React.Component {

    constructor(props) {
        super(props);
        this.state = { value: { name: props.marxanfile }, loading: false };
        this.onChange = this.onChange.bind(this);
        this.fileUpload = this.fileUpload.bind(this);
    }

    onChange(e) {
        if (e.target.files.length) {
            this.setState({ value: e.target.files[0] });
            this.fileUpload(e.target.files[0]);
        }
    }

    fileUpload(value) {
        this.setState({ loading: true });
        this.props.fileUploaded(false);
        const url = "https://db-server-blishten.c9users.io/marxan/webAPI/postFile";
        const formData = new FormData();
        formData.append('value', value);
        formData.append('filename', value['name']);
        formData.append('marxanfile', this.props.marxanfile);
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        };
        post(url, formData, config).then((response) => this.finishedLoading(response));
    }

    finishedLoading(response) {
        if (response.data == 'Complete') {
            this.setState({ loading: false });
            this.props.fileUploaded(true);
        }
    }
    render() {
        let id = "upload" + this.props.marxanfile;
        return (
            <form className='FileUploadForm'>
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <div style={{'width':'180px'}}>{this.props.label}</div>
                            </td>
                            <td className='uploadFileTD'>
                                <div className='uploadFileField'>
                                    <div className='uploadFileFieldIcon'>
                                        <label htmlFor={id}><FontAwesome name='file' title='Click to upload a file' style={{'cursor':'pointer'}}/></label>
                                        <input type="file" onChange={this.onChange} accept=".dat" style={{'display':'none', 'width':'10px'}} id={id}/>
                                    </div>
                                    <div className='uploadFileFieldLabel'>{this.state.value && this.state.value.name}</div>
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
