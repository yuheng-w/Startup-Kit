import React from 'react';
import axios from 'axios';
import { Paper, TextField, Button } from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';

export default class MessageInput extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            userId:this.props.user,
            otherId:this.props.other,
            value:""
        }
        this.sendMessage = this.sendMessage.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    sendMessage(){
        axios.post("http://localhost:5000/messages/addMessage/" + this.state.value + 
        "/" + (window.localStorage.getItem("userId") ||"60deb4b6e4ecc906340671a6") 
        + "/" + window.localStorage.getItem("uid")).
        then().catch(
          () => {alert("Server Error please try again.")}
        );
        this.setState({value:""});
    }

    handleChange(event){
        this.setState({value:event.target.value});
    }

    render() {
        return (
            <Paper style={{ top: "10%", width: "90%", left: "5%", position: "relative" }}>
                <form noValidate autoComplete="off">
                    <div>
                        <TextField multiline id="outlined-basic" placeholder="Write your message here"
                          style={{ width: "90%", position: "relative" }}
                          onChange={this.handleChange} value={this.state.value}/>
                        <Button size="large" variant="contained"
                          style={{margin:"8px", right:"7px", position:"relative", float:"right"}}
                          onClick={this.sendMessage}>
                            <SendIcon />
                        </Button>
                    </div>
                </form>
            </Paper>
        );
    }
}