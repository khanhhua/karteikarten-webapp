import React, { useCallback, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Modal, ModalHeader, ModalBody, ModalFooter, Button,
  Form, FormGroup, Label,
  Input,
} from 'reactstrap';
import { get } from '../sagas/utils';

import {
  CARD_ACTION_MOVE,
  CARD_ACTION_COPY,
  CARD_ACTION_CLONE,
} from '../constants';

const CardActionsModal = ({ dispatch, card, onAccept, onClose }) => {
  const [choice, setChoice] = useState(null);
  const [collections, setCollections] = useState(null);
  const fetchCollections = useCallback(() => get('http://localhost:8080/collections'), []);
  const [collectionId, setCollectionId] = useState(null);

  return (
    <Modal isOpen={true}>
      <ModalHeader><span className='font-italic'>{card.front}</span></ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup row inline>
            <Label className='col-3 col-form-label text-right'>Action</Label>
            <div className='form-check-inline'>
              <label className='form-check-label'>
                <Input
                  type='radio' className='form-check-input' name='action'
                  onClick={() => {
                    setChoice(CARD_ACTION_MOVE);
                    fetchCollections().then(({ collections }) => setCollections(collections));
                  }}
                /> Move
              </label>
            </div>
            <div className='form-check-inline'>
              <label className='form-check-label'>
                <Input
                  type='radio' className='form-check-input' name='action'
                  onClick={() => {
                    setChoice(CARD_ACTION_COPY);
                    fetchCollections().then(({ collections }) => setCollections(collections));
                  }}
                /> Copy
              </label>
            </div>
            <div className='form-check-inline'>
              <label className='form-check-label'>
                <Input
                  type='radio' className='form-check-input' name='action'
                  onClick={() => {
                    setChoice(CARD_ACTION_CLONE);
                    setCollections(null);
                  }}
                /> Clone
              </label>
            </div>
          </FormGroup>
          {collections &&
          <FormGroup>
            <Label>Move/Copy to...</Label>
            <select className='form-control' onChange={({ target: { value } }) => setCollectionId(value)}>
              {collections.map(collection => (
                <option value={collection.id}>{collection.title}</option>
              ))}
            </select>
          </FormGroup>
          }
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color='default' onClick={onClose}>Cancel</Button>
        <Button color='primary' onClick={() => onAccept({ action: choice, cardId: card.id, collectionId })}>OK</Button>
      </ModalFooter>
    </Modal>
  )
};

CardActionsModal.propTypes = {
  card: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onAccept: PropTypes.func.isRequired,
};

export default connect(null, dispatch => ({ dispatch }))(CardActionsModal);
