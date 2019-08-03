import React from 'react';
import { Link, Redirect } from 'react-router-dom';

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
    enemyHP: 0,
    text: '',
    item1Ch: 0,
    item2Ch: 0,
    item3Ch: 0,
    renderNext: false,
  }

  LoadEncounter = (currEnctr) => {
    Campgn.getEncounters()
      .then((enctrs) => {
        console.error(currEnctr, 'got encounters');
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
            enemyHP: enemyObj.enemyHP,
          });
          console.error(this.state.enemyProps, 'enemy properties');
          this.printText(this.state.enemyProps.name, ' appears! ');
        })
        .catch(err => console.error('couldnt get enemies', err));
      Items.getSeedItems()
        .then((seedItems) => {
          this.setState({ seedItems });
        })
        .catch(err => err);
      Items.getInvItems()
        .then((invItems) => {
          if (invItems.length > 0) {
            console.error(invItems[0].charid, 'inv item 1 charid');
            console.error(this.state.char.id, 'current character');
            const charInventory = invItems.filter(x => x.charid === this.state.char.id);
            console.error(charInventory, 'character inventory');
            this.setState({ inv: charInventory });
            if (this.state.inv[0] !== undefined) {
              this.setState({ item1Ch: this.state.inv[0].currCharges });
              if (this.state.inv[1] !== undefined) {
                this.setState({ item2Ch: this.state.inv[1].currCharges });
                if (this.state.inv[2] !== undefined) {
                  this.setState({ item3Ch: this.state.inv[2].currCharges });
                }
              }
            }
          }
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

  printText = (output, variable) => {
    if (variable !== undefined) {
      this.setState({ text: this.state.text + output + variable });
    } else if (output !== undefined) {
      this.setState({ text: this.state.text + output });
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

  nextEncounter = () => {
    if (this.state.inv[0] !== undefined) {
      const item1 = this.state.inv[0];
      item1.currCharges = this.state.item1Ch;
      Items.updateItems(item1, item1.id);
      if (this.state.inv[1] !== undefined) {
        const item2 = this.state.inv[1];
        item2.currCharges = this.state.item2Ch;
        Items.updateItems(item2, item2.id);
        if (this.state.inv[2] !== undefined) {
          const item3 = this.state.inv[2];
          item3.currCharges = this.state.item3Ch;
          Items.updateItems(item3, item3.id);
        }
      }
    }
    const newCamp = this.state.campObj;
    if (newCamp.campaignPos <= 3) {
      newCamp.campaignPos = newCamp.campaignPos + 1;
    } else if (newCamp.campaignPos > 3) {
      newCamp.campaignPos = 'final';
    }
    this.setState({ campObj: newCamp });
    const { char } = this.state;
    char.playerHP = this.state.currCharHP;
    CharData.updateChar(char.id, char);
    console.error(this.state.campObj);
    Campgn.updateCamp(this.state.campaign, this.state.campObj);
    this.setState({
      campaign: '',
      encounter: {},
      char: '',
      currEnctr: '',
      enemyProps: '',
      campObj: '',
      inv: [],
      seedItems: [],
      currCharHP: 0,
      enemyHP: 0,
      text: '',
      item1Ch: 0,
      item2Ch: 0,
      item3Ch: 0,
      renderNext: false,
    });
    setTimeout(() => {
      this.restartCode();
    }, 2000);
  }

  reloadEncounter = () => {
    if (this.state.renderNext === true) {
      return <button type="button" onClick={ () => this.nextEncounter() } className="btn btn-secondary">Proceed to the Next fight!</button>;
    }
  }

  printDOM = () => {
    return <div>
      <div className="card text-left scroll">
        <div className="card-body">
          <p className="card-text">{this.state.text}</p>
        </div>
      </div>
      <div className="card text-left scroll">
        <button type="button" className="btn btn-secondary" onClick={ () => this.charAtk() }>Attack!</button>
        <button type="button" className="btn btn-secondary" disabled>...</button>
        <button type="button" className="btn btn-secondary" disabled>...</button>

        {this.printBtns(this.state.inv.length)}
        {/* {this.printBtns()} */}
      </div>
      </div>;
  }

  enemyAtk = () => {
    const atkPwr = this.state.enemyProps.enemyATK;
    console.error('enemy atkpwr:', atkPwr);
    const playerHP = this.state.currCharHP;
    console.error('player hp:', playerHP);
    const newHP = playerHP - atkPwr;
    console.error('player hp after dmg:', newHP);
    this.setState({ currCharHP: newHP });
    this.printText(this.state.enemyProps.atkTxt);
    this.printText(' your HP:', this.state.currCharHP);
    if (newHP <= 0) {
      this.printText(' you lose!');
    }
  }

  charAtk = () => {
    const atkPwr = (8 + (this.state.char.STR * 2));
    const currHP = this.state.enemyHP;
    this.setState({ enemyHP: currHP - atkPwr });
    setTimeout(() => {
      this.printText(this.state.enemyProps.dmgTxt);
      this.printText(' Enemy HP:', this.state.enemyHP);
      if (this.state.enemyHP <= 0) {
        console.error('final encounter', this.state.encounter.finalEnctr);
        this.printText(this.state.enemyProps.dthTxt);
        if (this.state.encounter.finalEnctr === false) {
          this.setState({ renderNext: true });
        } else if (this.state.encounter.finalEnctr === true) {
          this.printText('YOU WIN!');
        }
      } else {
        setTimeout(() => {
          this.enemyAtk();
        }, 1500);
      }
    }, 1500);
  }

  useItem = (invIndex) => {
    const itemId = this.state.inv[invIndex].itemid;
    const newItem = this.state.inv[invIndex];
    if (invIndex === 0) {
      this.setState({ item1Ch: newItem.currCharges - 1 });
    } else if (invIndex === 1) {
      this.setState({ item2Ch: newItem.currCharges - 1 });
    } else if (invIndex === 2) {
      this.setState({ item3Ch: newItem.currCharges - 1 });
    }
    console.error(itemId);
    const itemData = this.state.seedItems;
    console.error(itemData);
    const currItem = itemData.filter(x => x.id.split('_')[0] === itemId);
    console.error(currItem);
    setTimeout(() => {
      switch (currItem[0].id) {
        case 'Firebomb_':
          this.setState({ enemyHP: this.state.enemyHP - 50 });
          this.printText(' the firebomb is thrown! EnemyHP:', this.state.enemyHP);
          break;
        case 'HPpotS_':
          if ((this.state.currCharHP + 80) > (45 + (this.state.char.VIT * 5))) {
            this.setState({ currCharHP: (45 + (this.state.char.VIT * 5)) });
          } else {
            this.setState({ currCharHP: this.state.currCharHP + 80 });
          }
          this.printText(' healed up to', this.state.currCharHP);
          break;
        default:
          this.printText(' that item cannot be used!');
      }
      if (this.state.enemyHP <= 0) {
        this.printText(this.state.enemyProps.dthTxt);
        this.setState({ renderNext: true });
      } else {
        setTimeout(() => {
          this.enemyAtk();
        }, 1500);
      }
    }, 1500);
  }

  restartCode = () => {
    const { campaign } = this.props.location.state;
    this.setState({ campaign });
    console.error('running', this.state.campObj);
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
                this.setState({ currEnctr: camp.enctrFinal });
                break;
              default:
                console.error('invalid campaignPos');
            }
            console.error(this.state.currEnctr, 'current encounter');
            setTimeout(() => {
              console.error('current encounter', this.state.currEnctr);
              this.LoadEncounter(this.state.currEnctr);
            }, 1000);
          }
        })
        .catch(err => console.error('error', err));
    }
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
                this.setState({ currEnctr: camp.enctrFinal });
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
        { this.reloadEncounter() }
    </div>
    );
  }
}

export default Adventure;
