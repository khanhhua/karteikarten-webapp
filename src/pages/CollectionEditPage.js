import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import ListGroup from 'reactstrap/es/ListGroup';
import ListGroupItem from 'reactstrap/es/ListGroupItem';
import { useParams } from 'react-router';
import { replace } from 'react-router-redux';

import {
  VIEW_COLLECTION,
  UPDATE_COLLECTION,
  STATUS_PENDING,
  CREATE_CARD_IN_COLLECTION,
  UPDATE_CARD_IN_COLLECTION,
  MOVE_CARD,
  COPY_CARD,
} from '../constants';
import {
  Navbar, Nav, NavItem, NavLink,
  Button, Input, Label, Row,
  Form, FormGroup,
} from 'reactstrap';

import CardModal from '../components/CardModal';
import CardActionsModal from '../components/CardActionsModal';

const CollectionEditPage = ({ dispatch, collection: editedCollection }) => {
  const { collectionId } = useParams();
  const [ collection, setCollection ] = useState({});
  const [ cardModalShown, setCardModalShown ] = useState(false);
  const [ editCardModalShown, setEditCardModalShown ] = useState(false);
  const [ editCard, setEditCard ] = useState(null);
  const [ cardActionsModalShown, setCardActionsModalShown ] = useState(false);

  useEffect(() => {
    dispatch({ type: VIEW_COLLECTION, status: STATUS_PENDING, collectionId });
  }, []);
  useEffect(() => {
    setCollection(editedCollection);
    setCardModalShown(false);
    setEditCardModalShown(false);
  }, [editedCollection]);

  if (!(collection && collection.items)) {
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
        <div className='row'>
          <div className='col-12'>
            <h1 className='page-title'>Your Collection</h1>
            <Form>
              <FormGroup row inline>
                <Label className='col-form-label text-right col-3'>Title</Label>
                <div className='col-9'>
                  <Input
                    className='font-weight-bold'
                    value={collection.title}
                    placeholder={'No name'}
                    onChange={({ target: { value } }) => {
                      setCollection({ ...collection, title: value });
                    }}
                    onBlur={() => {
                      dispatch({ type: UPDATE_COLLECTION, status: STATUS_PENDING, collection })
                    }}
                  />
                </div>
              </FormGroup>
              <FormGroup row inline>
                <Label className='col-form-label text-right col-3'>Cards</Label>
                <div className="col-9">
                  <ListGroup>
                    {(collection.items || []).map(item => (
                      <ListGroupItem key={item.id} className='pt-1 pb-1 pr-0'>
                        <Button
                          className='float-right'
                          size='sm'
                          color='default'
                          onClick={() => {
                            setEditCard(item);
                            setCardActionsModalShown(true);
                          }}
                        >&hellip;</Button>
                        <Button
                          className='float-right'
                          size='sm'
                          color='link'
                          onClick={() => {
                            setEditCard(item);
                            setEditCardModalShown(true);
                          }}
                        >View</Button>
                        {item.front}
                      </ListGroupItem>
                    ))}
                  </ListGroup>
                </div>
              </FormGroup>
            </Form>

            <Row className='pt-3 justify-content-center'>
              <Button
                color='primary'
                onClick={() => setCardModalShown(true)}
              >Add new Card</Button>
            </Row>
          </div>
        </div>
        {cardModalShown &&
        <CardModal
          onClose={() => setCardModalShown(false)}
          onSave={(card) => {
            dispatch({ type: CREATE_CARD_IN_COLLECTION, status: STATUS_PENDING, collection, card });
          }}
        />}
        {editCardModalShown && editCard &&
        <CardModal
          card={editCard}
          onClose={() => setEditCardModalShown(false)}
          onSave={(card) => {
            dispatch({ type: UPDATE_CARD_IN_COLLECTION, status: STATUS_PENDING, collection, card });
          }}
        />}
        {cardActionsModalShown && editCard &&
        <CardActionsModal
          card={editCard}
          onClose={() => setCardActionsModalShown(false)}
          onAccept={({ action, cardId, collectionId }) => {
            if (action === 'MOVE') {
              dispatch({
                type: MOVE_CARD,
                status: STATUS_PENDING,
                cardId,
                fromCollectionId: editedCollection.id,
                toCollectionId: collectionId
              });
            } else if (action === 'COPY') {
              dispatch({
                type: COPY_CARD,
                status: STATUS_PENDING,
                cardId,
                toCollectionId: collectionId
              });
            }
          }}
        />
        }
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  collection: state.coreData.editCollection || { id: null },
});

export default connect(mapStateToProps, dispatch => ({ dispatch }))(CollectionEditPage);
