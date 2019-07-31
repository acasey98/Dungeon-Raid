import React from 'react';
import { Link } from 'react-router-dom';

import firebase from 'firebase/app';
import 'firebase/auth';

import Campgn from '../../helpers/data/campaignData';
import CharData from '../../helpers/data/charData';
import Items from '../../helpers/data/itemData';

import './Adventure.scss';

class Adventure extends React.Component {
  state = {
    campaign: '',
    encounter: {},
    char: '',
    currEnctr: '',
    enemyProps: '',
    campObj: '',
    inv: [],
    seedItems: [],
    currCharHP: 0,
  }

  LoadEncounter = (currEnctr) => {
    Campgn.getEncounters()
      .then((enctrs) => {
        console.error(enctrs, 'got encounters');
        const currentEnctrObj = enctrs.filter(x => x.id === currEnctr);
        console.error(currentEnctrObj, 'encounter object filtered');
        this.setState({ encounter: currentEnctrObj[0] });
        console.error(this.state.encounter, 'encounter object state');
        console.error(this.state.encounter.enemyid, 'current enemyid');
      })
      .catch(err => console.error('failed to retrieve encounters', err));
    setTimeout(() => {
      Campgn.getEnemyById(this.state.encounter.enemyid)
        .then((enemyObj) => {
          this.setState({
            enemyProps: enemyObj,
          });
          console.error(this.state.enemyProps, 'enemy properties');
        })
        .catch(err => console.error('couldnt get enemies', err));
      Items.getSeedItems()
        .then((seedItems) => {
          this.setState({ seedItems });
        })
        .catch(err => err);
      Items.getInvItems()
        .then((invItems) => {
          console.error(invItems[0].charid, 'inv item 1 charid');
          console.error(invItems[1].charid, 'inv item 2 charid');
          console.error(this.state.char.id, 'current character');
          const charInventory = invItems.filter(x => x.charid === this.state.char.id);
          console.error(charInventory, 'character inventory');
          this.setState({ inv: charInventory });
        })
        .catch(err => console.error('couldnt get invItems', err));
    }, 1500);
  };

  getChar = () => {
    if (this.state.char === '') {
      CharData.getCurrentChar(firebase.auth().currentUser.uid)
        .then((char) => {
          this.setState({ char: char[0] });
          this.setState({ currCharHP: char[0].playerHP });
          console.error(this.state.char, 'current character');
        })
        .catch(err => console.error('couldnt get char by uid', err));
    }
  }

  printBtns = (lgth) => {
    if (lgth === 1) {
      return <button id={this.state.inv[0].id} type="button" className="btn btn-primary" onClick={ () => this.useItem(0)}>{this.state.inv[0].itemid}</button>;
    } if (lgth === 2) {
      return (
        <div>
          <button id={this.state.inv[0].id} type="button" className="btn btn-primary" onClick={ () => this.useItem(0)}>{this.state.inv[0].itemid}</button>
          <button id={this.state.inv[1].id} type="button" className="btn btn-primary" onClick={ () => this.useItem(1)}>{this.state.inv[1].itemid}</button>
        </div>
      );
    } if (lgth >= 3) {
      return (
        <div>
          <button id={this.state.inv[0].id} type="button" className="btn btn-primary" onClick={ () => this.useItem(0)}>{this.state.inv[0].itemid}</button>
          <button id={this.state.inv[1].id} type="button" className="btn btn-primary" onClick={ () => this.useItem(1)}>{this.state.inv[1].itemid}</button>
          <button id={this.state.inv[2].id} type="button" className="btn btn-primary" onClick={ () => this.useItem(2)}>{this.state.inv[2].itemid}</button>
        </div>
      );
    }
  }

  printDOM = () => {
    return <div>
      <div className="card text-left scroll">
        <div className="card-body">
          <p className="card-text">With supporting text below as a natural lead-in to aWith supporting text below as a natural lead-in to additional content.With supporting text below as a natural lead-in to additional content.With supporting text below as a natural lead-in to additional content.With supporting text below as a natural lead-in to additional content.With supporting text below as a natural lead-in to additional content.With supporting text below as a natural lead-in to additional content.With supporting text below as a natural lead-in to additional content.With supporting text below as a natural lead-in to additional content.With supporting text below as a natural lead-in to additional content.With supporting text below as a natural lead-in to additional content.With supporting text below as a natural lead-in to additional content.With supporting text below as a natural lead-in to additional content.With supporting text below as a natural lead-in to additional content.With supporting text below as a natural lead-in to additional content.With supporting text below as a natural lead-in to additional content.With supporting text below as a natural lead-in to additional content.With supporting text below as a natural lead-in to additional content.With supporting text below as a natural lead-in to additional content.With supporting text below as a natural lead-in to additional content.With supporting text below as a natural lead-in to additional content.With supporting text below as a natural lead-in to additional content.With supporting text below as a natural lead-in to additional content.With supporting text below as a natural lead-in to additional content.With supporting text below as a natural lead-in to additional content.With supporting text below as a natural lead-in to additional content.With supporting text below as a natural lead-in to additional content.With supporting text below as a natural lead-in to additional content.With supporting text below as a natural lead-in to additional content.With supporting text below as a natural lead-in to additional content.With supporting text below as a natural lead-in to additional content.With supporting text below as a natural lead-in to additional content.With supporting text below as a natural lead-in to additional content.With supporting text below as a natural lead-in to additional content.With supporting text below as a natural lead-in to additional content.With supporting text below as a natural lead-in to additional content.With supporting text below additional content.With supporting text below as a natural lead-in to additional content.With supporting text below as a natural lead-in to additional content.With supporting text below as a natural lead-in to additional content.With supporting text below as a natural lead-in to additional content.With supporting texadditional content.With supporting text below as a natural lead-in to additional content.With supporting text below as a natural lead-in to additional content.With supporting text below as a natural lead-in to additional content.With supporting text below as a natural lead-in to additional content.With supporting texadditional content.With supporting text below as a natural lead-in to additional content.With supporting text below as a natural lead-in to additional content.With supporting text below as a natural lead-in to additional content.With supporting text below as a natural lead-in to additional content.With supporting tex</p>
        </div>
      </div>
      <div className="card text-left scroll">
        <button type="button" className="btn btn-secondary" onClick={this.charAtk}>Attack!</button>
        <button type="button" className="btn btn-secondary" disabled>...</button>
        <button type="button" className="btn btn-secondary" disabled>...</button>

        {this.printBtns(this.state.inv.length)}
        {/* {this.printBtns()} */}
      </div>
      </div>;
  }

  enemyAtk = () => {
    const atkPwr = this.state.enemyProps.enemyAtk;
    const playerHP = this.state.currCharHP;
    const newHP = playerHP - atkPwr;
    this.setState({ currCharHP: newHP });
  }

  useItem = (invIndex) => {
    const itemId = this.state.inv[invIndex].itemid;
    console.error(itemId);
    const itemData = this.state.seedItems;
    console.error(itemData);
    const currItem = itemData.filter(x => x.id.split('_')[0] === itemId);
    console.error(currItem);
    const currEnemyHP = this.state.enemyProps.enemyHP;
    switch (currItem[0].id) {
      case 'Firebomb_':
        this.setState({ enemyHP: currEnemyHP - 50 });
        console.error('the firebomb is thrown! EnemyHP:', this.state.enemyHP);
        break;
      case 'HPpotS_':
        if ((this.state.currCharHP + 80) > (45 + (this.state.char.VIT * 5))) {
          this.setState({ currCharHP: (45 + (this.state.char.VIT * 5)) });
        } else {
          this.setState({ currCharHP: this.state.currCharHP + 80 });
        }
        setTimeout(() => {
          console.error('healed up to', this.state.currCharHP);
        }, 1500);
        break;
      default:
        console.error('that item cannot be used!');
    }
    this.enemyAtk();
  }

  componentDidMount() {
    const { campaign } = this.props.location.state;
    this.setState({ campaign });
    // const { charId } = this.props.location.state;
    // this.setState({ charId });
    this.getChar();
    if (this.state.campObj === '') {
      Campgn.getCampById(campaign)
        .then((camp) => {
          this.setState({ campObj: camp });
          console.error(camp, 'current campaign object');
          if (this.state.currEnctr === '') {
            switch (camp.campaignPos) {
              case 1:
                this.setState({ currEnctr: camp.enctr1id });
                break;
              case 2:
                this.setState({ currEnctr: camp.enctr2id });
                break;
              case 3:
                this.setState({ currEnctr: camp.enctr3id });
                break;
              case 4:
                this.setState({ currEnctr: camp.enctr4id });
                break;
              case 5:
                this.setState({ currEnctr: camp.enctr5id });
                break;
              case 6:
                this.setState({ currEnctr: camp.enctr6id });
                break;
              case 'final':
                this.setState({ currEnctr: camp.enctrFinalid });
                break;
              default:
                console.error('invalid campaignPos');
            }
            console.error(this.state.currEnctr, 'current encounter');
            setTimeout(() => {
              this.LoadEncounter(this.state.currEnctr);
            }, 1000);
          }
        })
        .catch(err => console.error('error', err));
    }
  }

  render() {
    return (
      <div className="adventureClass">
        { this.printDOM() }
    </div>
    );
  }
}

export default Adventure;
