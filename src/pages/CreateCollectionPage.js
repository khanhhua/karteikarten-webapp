import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Row, Label, Button, Input } from 'reactstrap';

import { CREATE_CARD_IN_NEW_COLLECTION, CREATE_COLLECTION, STATUS_PENDING } from '../constants';
import { useParams } from 'react-router';
import { replace } from 'react-router-redux';

const CreateCollectionPage = (
  {
    dispatch,
    newCollection = { id: null, title: '', tags: '' },
  }
) => {
  const params = useParams();
  const [collection, setCollection] = useState(newCollection);
  const [card, setCard] = useState({ id: null, isPristine: true, front: '', back: '' });

  useEffect(() => {
    setCollection(newCollection);
  }, [
    newCollection.id,
  ]);
  useEffect(() => {
    setCard({ id: null, isPristine: true, front: '', back: '' });
  }, [
    newCollection.id,
    newCollection.items,
  ]);

  const step = params && params.step || 'step-0';

  return (
    <div className='container'>
      <div className='row'>
        <div className='col-12'>
          <h1 className='page-title'>Create Your Collection</h1>

          {step === 'step-0' &&
          <>
          <Row className='mb-2'>
            <Label className='col-form-label text-right col-3'>Title</Label>
            <Input
              className='col-7 font-weight-bold'
              value={collection.title}
              placeholder={'No name'}
              onChange={({ target: { value } }) => {
                setCollection({ ...collection, title: value })
              }}
            />
          </Row>
          <Row className='mb-2'>
            <Label className='col-form-label text-right col-3'>Tags</Label>
            <Input
              type='textarea'
              className='col-7'
              rows={2}
              onChange={({ target: { value } }) => {
                setCollection({ ...collection, tags: value.split(/\n+|\s+/) })
              }}
            />
          </Row>
          <Row className='mt-2'>
            <div className='offset-3'>
              <Button
                color='primary'
                onClick={() => dispatch({ type: CREATE_COLLECTION, status: STATUS_PENDING, collection })}
              >Create</Button>
            </div>
          </Row>
          </>
          }
          {step === 'step-1' &&
          <>
            <Row>
              <ul className='list-inline'>
                {newCollection.items && newCollection.items.map(item => (
                  <li className='list-inline-item'>{item.front}</li>
                ))}
              </ul>
            </Row>
            <Row>
              <Label className='col-form-label text-right col-3'>Front</Label>
              <Input
                className='col-7 font-weight-bold'
                value={card.front}
                placeholder={'Empty'}
                onChange={({ target: { value } }) => {
                  setCard({ ...card, isPristine: false, front: value })
                }}
              />
            </Row>
            <Row className='pt-2'>
              <Label className='col-form-label text-right col-3'>Back</Label>
              <Input
                className='col-7 font-weight-bold'
                value={card.back}
                placeholder={'Empty'}
                onChange={({ target: { value } }) => {
                  setCard({ ...card, back: value })
                }}
              />
            </Row>
            <Row className='justify-content-center pt-3'>
              <Button
                color='primary'
                onClick={() => dispatch({
                  type: CREATE_CARD_IN_NEW_COLLECTION,
                  status: STATUS_PENDING,
                  collection: newCollection,
                  card,
                })}
              >Add to Collection</Button>
              <Button
                color='default'
                onClick={() => dispatch(replace('/collections'))}
              >Finish</Button>
            </Row>
          </>
          }
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  newCollection: state.coreData.newCollection || undefined,
});

export default connect(mapStateToProps, dispatch => ({ dispatch }))(CreateCollectionPage);
