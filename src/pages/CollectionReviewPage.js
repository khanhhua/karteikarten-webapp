import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router';
import { replace } from 'react-router-redux';

import {
  STATUS_PENDING,
  REVIEW_COLLECTION,
  ANSWER_MATCH,
} from '../constants';
import { Navbar, Nav, NavItem, NavLink, Button, Row, Label, Table } from 'reactstrap';

import '../App.css';

const CollectionReviewPage = ({ dispatch, collection, cardIndex = 0, lastScorecard = null, scorecards = null, complete = false }) => {
  const { collectionId } = useParams();
  const [ card, setCard ] = useState({});

  useEffect(() => {
    if (collectionId) {
      dispatch({ type: REVIEW_COLLECTION, status: STATUS_PENDING, collectionId });
    }
  }, [collectionId]);
  useEffect(() => {
    if (collection && collection.items) {
      setCard(collection.items[0]);
    }
  }, [collection]);
  useEffect(() => {
    setCard(collection.items[cardIndex]);
  }, [collection, cardIndex]);

  if (!(collection && card && card.choices)) {
    return <div className='text-center'>Loading...</div>;
  }

  return (
    <>
      <Navbar>
        <Nav>
          <NavItem>
            <NavLink
              href='javascript: void 0'
              onClick={() => dispatch(replace('/collections'))}
            >&lsaquo; Collections</NavLink>
          </NavItem>
        </Nav>
      </Navbar>
      <div className='container'>
        <Row className='justify-content-center'>
          <div className='col-12 col-sm-10'>
            <h1 className='page-title'>Review</h1>
            {lastScorecard && !complete &&
            <Row>
              <Label className='col-4'>Last card</Label>
              <div className='col-4'>{lastScorecard.card.front}</div>
              <div className='col-4'>
                {lastScorecard.correct ?
                  <span>Correct!</span>
                  :
                  <span>Wrong!!!</span>
                }
              </div>
            </Row>
            }
            {!complete &&
            <div className='w-100 p-3 p-sm-5 karteikarten-card'>
              <h3 className={`display-4 text-center font-weight-bold ${(!(card.media && card.media.url)) && 'mb-5'}`}>{card.front}</h3>
              {card.media && card.media.url &&
              <Row className="justify-content-center mb-5">
                <img src={card.media.url} />
              </Row>
              }
              <Row key={card.id}>
                {card.choices.map((choice) => (
                  <Button
                    onClick={() => dispatch({
                      type: ANSWER_MATCH,
                      status: STATUS_PENDING,
                      answer: {
                        card,
                        choice,
                      }
                    })}
                    key={`${card.id}-${choice.id}`}
                    color='link'
                    className='w-50'
                  >{choice.back}</Button>
                ))}
              </Row>
            </div>
            }
            {complete && scorecards &&
            <>
              <div className='w-100 p-3 p-sm-5 karteikarten-card'>
                <h2>{collection.title}</h2>
                <Table responsive>
                  <thead>
                  <tr>
                    <th></th>
                    <th>Correct</th>
                    <th>Wrong</th>
                    <th>Skipped</th>
                  </tr>
                  </thead>
                  <tbody>
                  {scorecards.map(({ card, ...scorecard }) => (
                    <tr>
                      <td>{card.front}</td>
                      <td>{scorecard.corrects}</td>
                      <td>{scorecard.wrongs}</td>
                      <td>{scorecard.skippeds}</td>
                    </tr>
                  ))}
                  </tbody>
                </Table>
              </div>
              <div className="w-100 text-center">
                <Button
                  color='link'
                  onClick={() => dispatch(replace(`/review/${collection.id}`))}
                >Retry the collection</Button>
              </div>
            </>
            }
          </div>
        </Row>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  collection: state.review.reviewCollection || { items: [] },
  cardIndex: state.review.cardIndex || 0,
  lastScorecard: state.review.scorecards.length ? state.review.scorecards[state.review.scorecards.length - 1] : null,
  complete: state.review.complete,
  scorecards: state.review.scorecards,
});

export default connect(mapStateToProps, dispatch => ({ dispatch }))(CollectionReviewPage);
