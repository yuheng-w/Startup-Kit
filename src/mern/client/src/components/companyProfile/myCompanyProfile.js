import React, { Component } from "react";
// This will require to npm install axios
import axios from 'axios';  //this communicates with backend
import { Paper, Avatar, Typography, Container, Grid } from '@material-ui/core';
import { styled } from '@material-ui/core/styles';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import EditIcon from '@material-ui/icons/Edit';


let currentUserID= localStorage.getItem('userId');
export default class MyCompanyProfile extends Component{

    constructor(props){
        super(props);
        this.getCompanyProfle = this.getCompanyProfle.bind(this);

        this.state = {
            company_title: "",
            tagline: "", 
            description: "", 
            emailAddress: "",   
            logo: "",           //image to be uploaded
            links: [],          //to be developed (detacting the link)
            members: "",         //to (search feature needed)
        };
    }


    //get Company Profile
    getCompanyProfle(){
        axios.get("http://localhost:5000/company-profile/?_id:" + this.props.match.params.id)
        .then((response) => {
            const companyLists = response.data;
            const currentCompany = companyLists.find(person => person._id === this.props.match.params.id);

            this.setState({
            company_title: currentCompany.company_title,
            tagline: currentCompany.tagline,
            description: currentCompany.description,
            emailAddress: currentCompany.emailAddress,
            logo: currentCompany.logo,
            links: currentCompany.links,
            members: currentCompany.members,
            });
        })
        .catch(function (error) {
            console.log(error);
        });

    }


  // This will get the record based on the id from the database.
    componentDidMount() {
        this.getCompanyProfle();

    }
    


    render(){

        const Item = styled(Paper)(({ theme }) => ({
            ...theme.typography.body2,
            padding: theme.spacing(1),
            textAlign: 'left',
            color: theme.palette.text.secondary,
            padding: "20px",
        }));
        const imageContainer = {
            // position: 'relative',
            backgroundImage: 'url(https://upload.wikimedia.org/wikipedia/commons/2/21/Vincent_Willem_van_Gogh_-_Cafe_Terrace_at_Night_%28Yorck%29.jpg)',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            height: "400px",
        }
        const DefultContainer ={
            backgroundColor: 'white',
            border: '0px',
            margin: '0px',
        }

        return(
            <div style={DefultContainer}>
                <div className="banner-wrapper">
                    <div style={imageContainer} > </div>
                    
                </div>
                {/* Profile Content */}
                <Container  maxWidth="md">
                    <Item className="block-group">
                        <Typography gutterBottom>
                            <div id="logo-grid" className="grid-wrapper">
                                <Grid container spacing={2} xs={12}> 
                                    <Grid item xs={3}> <Avatar sx={{ width: "10rem", height: "10rem" }} > {this.state.company_title} </Avatar> </Grid>
                                    <Grid item xs={9} style={{marginTop: "30px"}}> 
                                        <Typography style={{fontSize: "2rem"}}> {this.state.company_title} </Typography>
                                        <Typography style={{fontSize: "1.5rem"}}> {this.state.tagline} </Typography>

                                    </Grid>
                                </Grid>
                            </div>
                        </Typography>
                        <Typography className="text-wrapper" variant="h5" style={{marginLeft: "2%"}, {marginTop:"2rem"}}> {this.state.description} </Typography>
                    </Item>
                    <Item className="block-group" > 
                        <div className="grid-wrapper"> 
                            <Typography style={{margin: "10px"}} gutterBottom>
                                <Typography variant="h6" > Email: </Typography>
                                <Typography variant="subtitle1" style={{marginLeft: "10%"}}> {this.state.emailAddress} </Typography>
                            </Typography>
                            <Typography style={{margin: "10px"}} gutterBottom>
                                <Typography variant="h6"> Links: </Typography>
                                <Typography variant="subtitle1" style={{marginLeft: "10%"}}> {this.state.links} </Typography>
                            </Typography>
                        </div>
                    </Item>
                    <Item className="block-group" style={{padding: "20px"}} >  </Item>
                </Container>
            </div>
        )
    }
}