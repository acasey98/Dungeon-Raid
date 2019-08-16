/* eslint-disable consistent-return */
import React from 'react';
import {
  Link, Redirect,
} from 'react-router-dom';

import firebase from 'firebase/app';
import 'firebase/auth';

import data from '../../helpers/data/charData';
// import camp from '../../helpers/data/campaignData';

import './Base.scss';

class Base extends React.Component {
  state = {
    VIT: 1,
    STR: 1,
    DEX: 1,
    WIS: 1,
    LCK: 1,
    unassgndPts: 10,
  }

  // componentDidMount() {
  //   data.getCurrentChar(firebase.auth().currentUser.uid)
  //     .then((res) => {
  //       if (res.length !== 0) {
  //         this.setState({ redirect: true, charIdOp: res[0].id });
  //       }
  //     })
  //     .catch(err => console.error('no characters', err));
  // }

  renderRedirect = () => {
    if (this.state.redirect === true) {
      return <Redirect to={{ pathname: '/choose_item', state: { charId: this.state.charIdOp } }} />;
    }
  };

  createCharacter = () => {
    const startingHP = (45 + (this.state.VIT * 5));
    const startingMP = ((this.state.WIS * 5) + 5);
    const newChar = {
      uid: firebase.auth().currentUser.uid,
      playerHP: startingHP,
      playerMP: startingMP,
      VIT: this.state.VIT,
      STR: this.state.STR,
      DEX: this.state.DEX,
      WIS: this.state.WIS,
      LCK: this.state.LCK,
      text: '',
    };
    data.postCharacter(newChar);
  }

  statError = (errType) => {
    if (errType === 'no_pts') {
      this.setState({ text: 'You have no remaining stat points to allocate.' });
    } else if (errType === 'cant_lower') {
      this.setState({ text: 'That stat cannot be lower than 1' });
    }
  }

  VITaddPnt = (e) => {
    e.preventDefault();
    if (this.state.unassgndPts >= 1) {
      this.setState({ VIT: this.state.VIT + 1 });
      this.setState({ unassgndPts: this.state.unassgndPts - 1 });
    } else {
      this.statError('no_pts');
    }
  }

  VITsubPnt = (e) => {
    e.preventDefault();
    if (this.state.VIT > 1) {
      this.setState({ VIT: this.state.VIT - 1 });
      this.setState({ unassgndPts: this.state.unassgndPts + 1 });
    } else {
      this.statError('cant_lower');
    }
  }

  STRaddPnt = (e) => {
    e.preventDefault();
    if (this.state.unassgndPts >= 1) {
      this.setState({ STR: this.state.STR + 1 });
      this.setState({ unassgndPts: this.state.unassgndPts - 1 });
    } else {
      this.statError('no_pts');
    }
  }

  STRsubPnt = (e) => {
    e.preventDefault();
    if (this.state.STR > 1) {
      this.setState({ STR: this.state.STR - 1 });
      this.setState({ unassgndPts: this.state.unassgndPts + 1 });
    } else {
      this.statError('cant_lower');
    }
  }

  DEXaddPnt = (e) => {
    e.preventDefault();
    if (this.state.unassgndPts >= 1) {
      this.setState({ DEX: this.state.DEX + 1 });
      this.setState({ unassgndPts: this.state.unassgndPts - 1 });
    } else {
      this.statError('no_pts');
    }
  }

  DEXsubPnt = (e) => {
    e.preventDefault();
    if (this.state.DEX > 1) {
      this.setState({ DEX: this.state.DEX - 1 });
      this.setState({ unassgndPts: this.state.unassgndPts + 1 });
    } else {
      this.statError('cant_lower');
    }
  }

  WISaddPnt = (e) => {
    e.preventDefault();
    if (this.state.unassgndPts >= 1) {
      this.setState({ WIS: this.state.WIS + 1 });
      this.setState({ unassgndPts: this.state.unassgndPts - 1 });
    } else {
      this.statError('no_pts');
    }
  }

  WISsubPnt = (e) => {
    e.preventDefault();
    if (this.state.WIS > 1) {
      this.setState({ WIS: this.state.WIS - 1 });
      this.setState({ unassgndPts: this.state.unassgndPts + 1 });
    } else {
      this.statError('cant_lower');
    }
  }

  LCKaddPnt = (e) => {
    e.preventDefault();
    if (this.state.unassgndPts >= 1) {
      this.setState({ LCK: this.state.LCK + 1 });
      this.setState({ unassgndPts: this.state.unassgndPts - 1 });
    } else {
      this.statError('no_pts');
    }
  }

  LCKsubPnt = (e) => {
    e.preventDefault();
    if (this.state.LCK > 1) {
      this.setState({ LCK: this.state.LCK - 1 });
      this.setState({ unassgndPts: this.state.unassgndPts + 1 });
    } else {
      this.statError('cant_lower');
    }
  }

  render() {
    return (
      <div className="statBtns">
        {this.renderRedirect()}
        <h2 id="pntsRemain">{this.state.unassgndPts} point(s) left.</h2>
        <p>{this.state.text}</p>
        <div id="VIT" className="btn-group-vertical" role="group" aria-label="Basic example">
          <h2>VIT</h2>
          <button id="VIT_sub" type="button" className="btn btn-info" onClick={this.VITaddPnt}>+</button>
          <button id="VIT_num" type="text" className="btn btn-dark" disabled>{this.state.VIT}</button>
          <button id="VIT_add" type="button" className="btn btn-info" onClick={this.VITsubPnt}>-</button>
        </div>
        <div id="STR" className="btn-group-vertical" role="group" aria-label="Basic example">
          <h2>STR</h2>
          <button id="STR_sub" type="button" className="btn btn-info" onClick={this.STRaddPnt}>+</button>
          <button id="STR_num" type="text" className="btn btn-dark" disabled>{this.state.STR}</button>
          <button id="STR_add" type="button" className="btn btn-info" onClick={this.STRsubPnt}>-</button>
        </div>
        <div id="DEX" className="btn-group-vertical" role="group" aria-label="Basic example">
          <h2>DEX</h2>
          <button id="DEX_sub" type="button" className="btn btn-info" onClick={this.DEXaddPnt}>+</button>
          <button id="DEX_num" type="text" className="btn btn-dark" disabled>{this.state.DEX}</button>
          <button id="DEX_add" type="button" className="btn btn-info" onClick={this.DEXsubPnt}>-</button>
        </div>
        <div id="WIS" className="btn-group-vertical" role="group" aria-label="Basic example">
          <h2>WIS</h2>
          <button id="WIS_sub" type="button" className="btn btn-info" onClick={this.WISaddPnt}>+</button>
          <button id="WIS_num" type="text" className="btn btn-dark" disabled>{this.state.WIS}</button>
          <button id="WIS_add" type="button" className="btn btn-info" onClick={this.WISsubPnt}>-</button>
        </div>
        <div id="LCK" className="btn-group-vertical" role="group" aria-label="Basic example">
          <h2>LCK</h2>
          <button id="LCK_sub" type="button" className="btn btn-info" onClick={this.LCKaddPnt}>+</button>
          <button id="LCK_num" type="text" className="btn btn-dark" disabled>{this.state.LCK}</button>
          <button id="LCK_add" type="button" className="btn btn-info" onClick={this.LCKsubPnt}>-</button>
        </div>
        <Link to={'/choose_item'}>
          <button id="saveStats" type="button" className="btn btn-danger" onClick={this.createCharacter}>SAVE</button>
        </Link>
      </div>
    );
  }
}

export default Base;
