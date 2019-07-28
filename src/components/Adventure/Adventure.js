import React from 'react';
import { Link } from 'react-router-dom';

import firebase from 'firebase/app';
import 'firebase/auth';

import Campgn from '../../helpers/data/campaignData';

import './Adventure.scss';

class Adventure extends React.Component {
  state = {
    campaign: '',
  }

  LoadEncounter = (currEnctr) => {
    Campgn.getEncounters()
      .then((enctrs) => {
        const currentEnctrObj = enctrs.filter(x => x.id === currEnctr);
        this.setState({ currentEnctrObj });
      })
      .catch(err => console.error('failed to retrive encounters', err));
    Campgn.getEnemyById(this.state.currentEnctrObj.enemyid)
      .then((enemyObj) => {
        this.setState({
          enemyProps: enemyObj,
        });
        // console.error(this.state.enemyProps);
      })
      .catch(err => console.error('couldnt get enemies', err));
  };

  componentDidMount() {
    const { campaign } = this.props.location.state;
    this.setState({ campaign });
    const { charId } = this.props.location.state;
    this.setState({ charId });
    Campgn.getCampById(campaign)
      .then((camp) => {
        const campObj = camp[0];
        // console.error(campObj.enctr1id);
        switch (campObj.campaignPos) {
          case 1:
            this.setState({ currEnctr: campObj.enctr1id });
            break;
          case 2:
            this.setState({ currEnctr: campObj.enctr2id });
            break;
          case 3:
            this.setState({ currEnctr: campObj.enctr3id });
            break;
          case 4:
            this.setState({ currEnctr: campObj.enctr4id });
            break;
          case 5:
            this.setState({ currEnctr: campObj.enctr5id });
            break;
          case 6:
            this.setState({ currEnctr: campObj.enctr6id });
            break;
          case 'final':
            this.setState({ currEnctr: campObj.enctrFinalid });
            break;
          default:
            console.error('invalid campaignPos');
        }
      })
      .catch(err => console.error('error', err));
    console.error(this.state.currEnctr);
    // this.LoadEncounter(this.state.currEnctr);
  }

  render() {
    return (
      <div className="adventureClass">
      <div className="card text-left scroll">
        <div className="card-body">
          <p className="card-text">With supporting text below as a natural lead-in to aWith supporting text below as a natural lead-in to additional content.With supporting text below as a natural lead-in to additional content.With supporting text below as a natural lead-in to additional content.With supporting text below as a natural lead-in to additional content.With supporting text below as a natural lead-in to additional content.With supporting text below as a natural lead-in to additional content.With supporting text below as a natural lead-in to additional content.With supporting text below as a natural lead-in to additional content.With supporting text below as a natural lead-in to additional content.With supporting text below as a natural lead-in to additional content.With supporting text below as a natural lead-in to additional content.With supporting text below as a natural lead-in to additional content.With supporting text below as a natural lead-in to additional content.With supporting text below as a natural lead-in to additional content.With supporting text below as a natural lead-in to additional content.With supporting text below as a natural lead-in to additional content.With supporting text below as a natural lead-in to additional content.With supporting text below as a natural lead-in to additional content.With supporting text below as a natural lead-in to additional content.With supporting text below as a natural lead-in to additional content.With supporting text below as a natural lead-in to additional content.With supporting text below as a natural lead-in to additional content.With supporting text below as a natural lead-in to additional content.With supporting text below as a natural lead-in to additional content.With supporting text below as a natural lead-in to additional content.With supporting text below as a natural lead-in to additional content.With supporting text below as a natural lead-in to additional content.With supporting text below as a natural lead-in to additional content.With supporting text below as a natural lead-in to additional content.With supporting text below as a natural lead-in to additional content.With supporting text below as a natural lead-in to additional content.With supporting text below as a natural lead-in to additional content.With supporting text below as a natural lead-in to additional content.With supporting text below as a natural lead-in to additional content.With supporting text below as a natural lead-in to additional content.With supporting text below additional content.With supporting text below as a natural lead-in to additional content.With supporting text below as a natural lead-in to additional content.With supporting text below as a natural lead-in to additional content.With supporting text below as a natural lead-in to additional content.With supporting texadditional content.With supporting text below as a natural lead-in to additional content.With supporting text below as a natural lead-in to additional content.With supporting text below as a natural lead-in to additional content.With supporting text below as a natural lead-in to additional content.With supporting texadditional content.With supporting text below as a natural lead-in to additional content.With supporting text below as a natural lead-in to additional content.With supporting text below as a natural lead-in to additional content.With supporting text below as a natural lead-in to additional content.With supporting tex</p>
        </div>
      </div>
      <div className="card text-left scroll">
        <button type="button" className="btn btn-secondary">{this.state.campaign}</button>
        <button type="button" className="btn btn-secondary">{this.state.currEnctr}</button>
        <button type="button" className="btn btn-secondary">btns here</button>

        <button type="button" className="btn btn-primary">items here</button>
        <button type="button" className="btn btn-primary">items here</button>
        <button type="button" className="btn btn-primary">items here</button>
      </div>
    </div>
    );
  }
}

export default Adventure;
