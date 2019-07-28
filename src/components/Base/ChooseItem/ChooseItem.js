/* eslint-disable max-len */
/* eslint-disable consistent-return */
import React from 'react';
import {
  Link, BrowserRouter, Route, Redirect, Switch,
} from 'react-router-dom';

import firebase from 'firebase/app';
import 'firebase/auth';

import Chars from '../../../helpers/data/charData';
import Items from '../../../helpers/data/itemData';
import Campgn from '../../../helpers/data/campaignData';

class ChooseItem extends React.Component {
  state = {
    item1: {},
    item2: {},
    item3: {},
    campaign: '',
    redirect: false,
    advPath: '',
    disabled: false,
    saveDisabled: true,
    hiddenModal: 'd-none',
    characterId: '',
  }

  displayLoading = () => {
    return <div className={this.state.hiddenModal}>
              <h3>Loading...</h3>
           </div>;
  };

  componentDidMount() {
    if (this.props.location.state !== undefined) {
      const { charId } = this.props.location.state;
      console.error(charId);
      const B = 'B';
      const idCombo = B.concat(charId);
      console.error(idCombo);
      this.setState({ characterId: 'dogshit' });
      console.error(this.state.characterId);
      Campgn.getCamp(this.state.charId)
        .then((res) => {
          console.error(res);
          if (res.length !== 0) {
            this.setState({ defaultRedirect: true, currCamp: res[0] });
          }
        })
        .catch(err => console.error('couldnt get cmpgns', err));
    } else {
      Items.getSeedItems()
        .then((items) => {
          items.filter((x) => {
            if (x.id === 'Firebomb_') {
              const item1 = x;
              this.setState({ item1 });
            }
          });
          items.filter((x) => {
            if (x.id === 'RestoRing_') {
              const item2 = x;
              this.setState({ item2 });
            }
          });
          items.filter((x) => {
            if (x.id === 'HPpotS_') {
              const item3 = x;
              this.setState({ item3 });
            }
          });
        })
        .catch(err => console.error('cant get items', err));
    }
  }

  renderRedirect = () => {
    if (this.state.defaultRedirect === true) {
      // console.error(currCamp);
      const campaign = this.state.currCamp.id;
      this.setState({ campaign });
      this.setState({ saveDisabled: false });
      this.setState({ disabled: true });
      return <Redirect to={{ pathname: '/adventure', state: { campaign: this.state.currCamp.id, charId: this.state.charId } }}/>;
    }
  }

campGet = (charId) => {
  this.setState({ advPath: '/adventure' });
  Campgn.getCamp(charId)
    .then((campaigns) => {
      // Campgn.updateCamp(campaigns[0].id, campaigns[0]);
      this.setState({ campaign: campaigns[0].id });
      this.setState({ saveDisabled: false });
      this.setState({ disabled: true });
      this.setState({ hiddenModal: 'd-none' });
    })
    .catch(err => err);
}

  saveItem = (e) => {
    const itemId = e.target.id.split('_')[0];
    const itemChrgs = e.target.id.split('_')[1];
    // const itemChrgs = itemB4.toString();
    Chars.getCurrentChar(firebase.auth().currentUser.uid)
      .then((char) => {
        this.setState({ charId: char[0].id });
        const newItem = {
          charid: char[0].id,
          itemid: itemId,
          currCharges: itemChrgs,
          modifier: '',
        };

        Items.createInvItem(newItem);
        Campgn.generateCamp(3, char[0].id)
          .then(() => {
          })
          .catch(err => err);
      })
      .catch(err => console.error('cant get characters', err));
    this.setState({ hiddenModal: 'd-block' });
    setTimeout(() => {
      this.campGet(this.state.charId);
    }, 3000);
    if (this.state.redirect === true) {
      return (<Redirect to={this.state.advPath} campaign={this.state.campaign}/>);
    }
  }

  render() {
    const item1id = this.state.item1.id + this.state.item1.maxCharges;
    const item2id = this.state.item2.id + this.state.item2.maxCharges;
    const item3id = this.state.item3.id + this.state.item3.maxCharges;

    return (
      <div className="ChooseItem">
        <div className="row">
          <div className="col-sm-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{this.state.item1.name}</h5>
                <p className="card-text">{this.state.item1.desc}</p>
                  <button id={item1id} onClick={this.saveItem} className="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter" disabled={this.state.disabled}>Choose this item</button>
              </div>
            </div>
          </div>
          <div className="col-sm-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{this.state.item2.name}</h5>
                <p className="card-text">{this.state.item2.desc}</p>
                  <button id={item2id} onClick={this.saveItem} className="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter" disabled={this.state.disabled}>Choose this item</button>
              </div>
            </div>
          </div>
          <div className="col-sm-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{this.state.item3.name}</h5>
                <p className="card-text">{this.state.item3.desc}</p>
                  <button id={item3id} onClick={this.saveItem} className="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter" disabled={this.state.disabled}>Choose this item</button>
            </div>
          </div>
        </div>
      </div>
      {this.renderRedirect()}
      <Link to={{ pathname: this.state.advPath, state: { campaign: this.state.campaign, charId: this.state.charId } }}>
        <button className="btn btn-primary" disabled={this.state.saveDisabled}>Click here to continue.</button>
      </Link>
      {this.displayLoading()}
    </div>
    );
  }
}

export default ChooseItem;
