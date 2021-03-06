import React from "react";
import axios from 'axios';
import '../Posts/PostViewer.css';
import Offer from './Offer';
import OfferWrite from './OfferWrite';
import OfferViewerSpecific from './OfferViewerSpecific';
import {Link, Switch,
  Route, BrowserRouter as Router} from 'react-router-dom';
  

export default class OfferViewer extends React.Component {
  /**
   * Main data structure for Offers.
   */
  constructor(props){

    window.localStorage.setItem("epp", window.localStorage.getItem("epp") || 5);
  
    super(props);
      this.decreasePage = this.decreasePage.bind(this);
      this.increasePage = this.increasePage.bind(this);
      this.displayOffers = this.displayOffers.bind(this);
      this.displayButton = this.displayButton.bind(this);
      this.changePage = this.changePage.bind(this);
      this.state = {
        loaded:false,
        offers:[],
        offernum:0,
        pg:0
    }

    var pnum = window.localStorage.getItem('offerpg') || 0;
    this.state.pg = pnum;
  }

  /**
   * Initializes oofer viewer on entry or on reload.
   */
  componentDidMount() {
    //Initializes postViewerSpecific page to 1 when entering PostViewer
    if(window.location.pathname === "/offers/1"){
      window.localStorage.setItem('pagenum', 0);
    }

    //Call to database to retrieve all offers.
    axios.get("http://localhost:5000/offers/getOffers").then(res => {
      this.setState({offers:res.data});
      this.setState({loaded:true});
    })
    .catch(err => {this.setState({loaded:"Load Failed"})});

    console.log(this.state.offers);
  }

  /**
   * Decreases the page number to show different posts.
   */
  decreasePage(){
    window.localStorage.setItem('offerpg', this.state.pg-1); 
    window.location.reload();
  }

  /**
   * Increases the page number to show different posts.
   */
  increasePage(){
    window.localStorage.setItem('offerpg', parseInt(this.state.pg)+1);
    window.location.reload();
  }

  displayButton(){
    var buttons = [];

    if(this.state.pg > 0){
      buttons.push(<button class="button" type="button"  
                   onClick={this.decreasePage}>{"<"}</button>);
    }

    buttons.push(<div class="pagenum">Page: {parseInt(this.state.pg) + 1}</div>);

    if(Math.floor(this.state.offers.length / 5) !== 0){
      buttons.push(<button class="button" type="button" onClick={this.changePage}>
        {"#"}</button>)
    }

    if(parseInt(this.state.pg) + 1 < Math.ceil(this.state.offers.length / 
      window.localStorage.getItem("epp"))) {

      buttons.push(<button class="button" type="button" 
                   onClick={this.increasePage}>{">"}</button>);
    }

    return buttons;
  }

  /**
   * Changes the page number to an amount that the user will input. Answers will be modified
   * so that page number will never be less than 0 or greater than the total number of pages
   * possible.
   * 
   * @param {*} event Not used
   */
  changePage(event){
    var temp_num = prompt("Enter a page number from 1 to "+ Math.ceil(
      this.state.offers.length / window.localStorage.getItem("epp")).toString()+":","");
    if(temp_num !== null && !isNaN(parseInt(temp_num))){
      if(parseInt(temp_num) > this.state.offers.length / window.localStorage.getItem("epp")){
        temp_num = Math.floor(this.state.offers.length / window.localStorage.getItem("epp"));
      }
      if(parseInt(temp_num) < 0){
        temp_num = 0;
      }
      window.localStorage.setItem('pg', parseInt(temp_num));
      window.location.reload();
    }
  }

  /**
   * Displays posts that will link into PostViewerSpecific. 
   * Will only disiplay posts until they run out. 
   */
  displayOffers(){
    let offersList = [];
    for(let i = 0; i < window.localStorage.getItem("epp"); i++){

      let index = this.state.pg*window.localStorage.getItem("epp");

      // console.log(window.localStorage.getItem("epp"));
      // console.log("length:" + this.state.offers.length);
      // console.log("i:" + i);
      // console.log(this.state.offers);
      // console.log(this.state.offers[1].userID._id);
      // console.log(this.state.offers[i].userID.username);
      // console.log(index + i +1);


      if(this.state.offers.length >= index + i +1 &&
         this.state.offers.length !== 0) {

          // console.log(this.state.offers[i+this.state.pg*
          //   window.localStorage.getItem("epp")].userID);

          offersList.push(
            <Link style={{ textDecoration: 'none', color:'Black' }} 
                  to={{pathname:"offer"}} 
                  onClick={() => {
                    this.setState({offernum:index+i}); 
                    window.localStorage.setItem("offerid", this.state.offers[
                      index+i]._id)}}>

              <div class="post">
                <Offer  
                  offer = {this.state.offers[i+index]}
                  // userID = {this.state.offers[i+index].userID._id}
                  // username =  {this.state.offers[i+index].userID.username}
                  // messageText= {this.state.offers[i+index].messageText} 
                  // tags={this.state.offers[i+index].tags} 
                  // id={this.state.offers[i+index]._id}
                  deletable="false"/>
              </div>
            </Link>);
      }
    }
    return offersList;
  }

  /**
   * Renders the OfferViewer page
  */
  render () {
    //Displays the loading screen until the database query is finished.
    if(this.state.loaded === false){
      return <p>Loading...</p>
    }
    return (
      <Router>
        <Switch>
          {/*Displays the PostViewer page*/}
          <Route path="/offers/1/">
            <div>
              <div className="PostWrite">
                {/* The interface for adding posts */}
                <OfferWrite />
              </div>
              <hr/>
              <div className="Posts">
                <nav>
                  <ul>
                    {/* The posts being displayed */}
                    {this.displayOffers()}
                  </ul>
                </nav>
              </div>
            </div>
            <div class = "Pageselector">
              {/* The page navigation display */}
              {this.displayButton()}
            </div>
          </Route>
          {/* Displays PostViewerSpecific Page */}
          <Route path="/offers/offer">
            <OfferViewerSpecific offer={this.state.offers[this.state.offernum]}/>
          </Route>
        </Switch>
      </Router>
    );
  }
}