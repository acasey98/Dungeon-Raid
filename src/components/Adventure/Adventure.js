/* eslint-disable consistent-return */
/* eslint-disable max-len */
import React from 'react';
import { Redirect } from 'react-router-dom';

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
        const currentEnctrObj = enctrs.filter(x => x.id === currEnctr);
        this.setState({ encounter: currentEnctrObj[0] });
      })
      .catch(err => console.error('failed to retrieve encounters', err));
    setTimeout(() => {
      Campgn.getEnemyById(this.state.encounter.enemyid)
        .then((enemyObj) => {
          this.setState({
            enemyProps: enemyObj,
            enemyHP: enemyObj.enemyHP,
          });
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
            const charInventory = invItems.filter(x => x.charid === this.state.char.id);
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
          this.setState({ currCharMP: char[0].playerMP });
        })
        .catch(err => console.error('couldnt get char by uid', err));
    }
  }

  printText = (output, variable) => {
    if (variable !== undefined) {
      this.setState({ text: <div> {this.state.text} <br/> {output + variable} <br/> </div> });
    } else if (output !== undefined) {
      this.setState({ text: <div> {this.state.text} <br/> {output} <br/> </div> });
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
      newCamp.campaignPos += 1;
    } else if (newCamp.campaignPos > 3) {
      newCamp.campaignPos = 'final';
    }
    this.setState({ campObj: newCamp });
    const { char } = this.state;
    char.playerHP = this.state.currCharHP;
    CharData.updateChar(char.id, char);
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
      loss: false,
      win: false,
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

  printDOM = () => <div>
      <div className="card text-left scroll">
        <div className="card-body">
          <div className="card-text">
            {this.state.text}
            <br/>
          </div>
          <h3 className="card-text" id='stat_display'>
            Your HP: {this.state.currCharHP} / {(45 + (this.state.char.VIT * 5))}
            <br/>
            EnemyHP: {this.state.enemyHP} / {this.state.enemyProps.enemyHP}
          </h3>
        </div>
      </div>
      <div className="card text-left scroll">
        <button type="button" className="btn btn-secondary" onClick={ () => this.charAtk('slam') }>Slam (med STR scaling, high base)</button>
        <button type="button" className="btn btn-secondary" onClick={ () => this.charAtk('zap') }>Zap (high WIS scaling, low base)</button>
        <button type="button" className="btn btn-secondary" onClick={ () => this.charAtk('risky_swing') }>Risky Swing (low DEX & STR scaling, 4x crit%, 30% miss rate)</button>
        {this.printBtns(this.state.inv.length)}
      </div>
      </div>;

  afterEnemyAtkPassiveEffects = () => {
    if (this.state.inv[0] !== undefined && this.state.inv[0].isPassive === true) {
      console.error(this.state.inv[0]);
      this.executeAfterEnemyAtkPassive(this.state.inv[0].itemid);
    }
    if (this.state.inv[1] !== undefined && this.state.inv[1].isPassive === true) {
      this.executeAfterEnemyAtkPassive(this.state.inv[1].itemid);
    }
    if (this.state.inv[2] !== undefined && this.state.inv[2].isPassive === true) {
      this.executeAfterEnemyAtkPassive(this.state.inv[2].itemid);
    }
  }

  onAtkPassiveEffects = (atkDmg) => {
    if (this.state.inv[0] !== undefined && this.state.inv[0].isPassive === true) {
      if (this.state.inv[0].passiveType === 'onAtk') {
        this.attackModifierPassive(this.state.inv[0].id, atkDmg);
      }
    }
    if (this.state.inv[1] !== undefined && this.state.inv[1].isPassive === true) {
      if (this.state.inv[1].passiveType === 'onAtk') {
        this.attackModifierPassive(this.state.inv[1].id, atkDmg);
      }
    }
    if (this.state.inv[2] !== undefined && this.state.inv[2].isPassive === true) {
      if (this.state.inv[2].passiveType === 'onAtk') {
        this.attackModifierPassive(this.state.inv[2].id, atkDmg);
      }
    }
  }

  // attackModifierPassive = (itemId, atkDmg) => {
  // }

  executeAfterEnemyAtkPassive = (itemId) => {
    switch (itemId) {
      case 'RestoRing':
        if ((this.state.currCharHP + Math.floor(this.state.char.WIS * 2)) > (45 + (this.state.char.VIT * 5))) {
          this.setState({ currCharHP: (45 + (this.state.char.VIT * 5)) });
        } else {
          this.setState({ currCharHP: this.state.currCharHP + Math.floor(this.state.char.WIS * 2) });
        }
        this.printText(' The Ring of Restoration heals you for: ', Math.floor(this.state.char.WIS * 2));
        break;
      default:
        console.error('invalid item id passed from passiveEffects');
    }
  }

  youLose = () => {
    if (this.state.loss === true) {
      CharData.deleteCurrentChar(firebase.auth().currentUser.uid);
      return <Redirect to={{ pathname: '/you_lose' }}/>;
    }
  }

  youWin = () => {
    if (this.state.win === true) {
      CharData.deleteCurrentChar(firebase.auth().currentUser.uid);
      return <Redirect to={{ pathname: '/you_win' }}/>;
    }
  }

  enemyAtk = () => {
    const hitIndex = this.getRandom(0, 100);
    const evasion = (this.state.char.DEX * 6);
    if (hitIndex > evasion) {
      const atkPwr = this.state.enemyProps.enemyATK;
      const playerHP = this.state.currCharHP;
      const newHP = playerHP - atkPwr;
      this.setState({ currCharHP: newHP });
      this.printText(this.state.enemyProps.atkTxt);
      if (newHP <= 0) {
        this.setState({ lose: true });
      }
    } else if (hitIndex <= evasion) {
      this.printText(this.state.enemyProps.atkTxt, ' but you evade it! ');
    }
    this.afterEnemyAtkPassiveEffects();
  }

  getRandom = (min, max) => {
    const minNum = Math.ceil(min);
    const maxNum = Math.floor(max);
    const finalNum = Math.floor(Math.random() * (maxNum - minNum)) + minNum;
    return finalNum;
  };

  charAtk = (skill) => {
    if (skill === 'slam') {
      let atkPwr = (10 + (this.state.char.STR * 2));
      const critIndex = this.getRandom(0, 100);
      const critChance = (5 + (this.state.char.LCK * 5));
      if (critIndex < critChance) {
        atkPwr *= 2;
      }
      const currHP = this.state.enemyHP;
      this.setState({ enemyHP: currHP - atkPwr });
      setTimeout(() => {
        this.printText(' You use Slam! DMG: ', atkPwr);
        if (critIndex < critChance) {
          this.printText(' A critical strike!!! ');
        }
        if (this.state.enemyHP <= 0) {
          this.printText(this.state.enemyProps.dthTxt);
          if (this.state.encounter.finalEnctr === false) {
            this.setState({ renderNext: true });
          } else if (this.state.encounter.finalEnctr === true) {
            this.setState({ win: true });
          }
        } else {
          setTimeout(() => {
            this.enemyAtk();
          }, 1500);
        }
      }, 1500);
    } else if (skill === 'risky_swing') {
      let atkPwr = (10 + (2 * (this.state.char.DEX + this.state.char.STR)));
      const critIndex = this.getRandom(0, 100);
      const hitIndex = this.getRandom(0, 100);
      if (hitIndex <= 30) {
        const critChance = (4 * (5 + (this.state.char.LCK * 5)));
        if (critIndex < critChance) {
          atkPwr *= 2;
        }
        const currHP = this.state.enemyHP;
        this.setState({ enemyHP: currHP - atkPwr });
        setTimeout(() => {
          this.printText(' You use Risky Swing! DMG: ', atkPwr);
          if (critIndex < critChance) {
            this.printText(' A critical strike!!! ');
          }
          if (this.state.enemyHP <= 0) {
            this.printText(this.state.enemyProps.dthTxt);
            if (this.state.encounter.finalEnctr === false) {
              this.setState({ renderNext: true });
            } else if (this.state.encounter.finalEnctr === true) {
              this.setState({ win: true });
            }
          } else {
            setTimeout(() => {
              this.enemyAtk();
            }, 1500);
          }
        }, 1500);
      } else {
        this.printText(' You missed your Risky Swing! ');
        setTimeout(() => {
          this.enemyAtk();
        }, 1500);
      }
    } else if (skill === 'zap') {
      let atkPwr = (2 + (this.state.char.WIS * 4));
      const critIndex = this.getRandom(0, 100);
      const critChance = (5 + (this.state.char.LCK * 5));
      if (critIndex < critChance) {
        atkPwr *= 2;
      }
      const currHP = this.state.enemyHP;
      this.setState({ enemyHP: currHP - atkPwr });
      setTimeout(() => {
        this.printText(' You use Zap! DMG: ', atkPwr);
        if (critIndex < critChance) {
          this.printText(' A critical strike!!! ');
        }
        if (this.state.enemyHP <= 0) {
          this.printText(this.state.enemyProps.dthTxt);
          if (this.state.encounter.finalEnctr === false) {
            this.setState({ renderNext: true });
          } else if (this.state.encounter.finalEnctr === true) {
            this.setState({ win: true });
          }
        } else {
          setTimeout(() => {
            this.enemyAtk();
          }, 1500);
        }
      }, 1500);
    }
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
    const itemData = this.state.seedItems;
    const currItem = itemData.filter(x => x.id.split('_')[0] === itemId);
    setTimeout(() => {
      switch (currItem[0].id) {
        case 'Firebomb_':
          this.setState({ enemyHP: this.state.enemyHP - 50 });
          this.printText(' The firebomb is thrown, dealing 50 damage! ');
          break;
        case 'HPpotS_':
          if ((this.state.currCharHP + 80) > (45 + (this.state.char.VIT * 5))) {
            this.setState({ currCharHP: (45 + (this.state.char.VIT * 5)) });
          } else {
            this.setState({ currCharHP: this.state.currCharHP + 80 });
          }
          this.printText(' Healed up to ', this.state.currCharHP);
          break;
        default:
          this.printText(' That item cannot be used! ');
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
    this.getChar();
    if (this.state.campObj === '') {
      Campgn.getCampById(campaign)
        .then((camp) => {
          this.setState({ campObj: camp });
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
            setTimeout(() => {
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
        { this.youLose() }
        { this.youWin() }
    </div>
    );
  }
}

export default Adventure;
