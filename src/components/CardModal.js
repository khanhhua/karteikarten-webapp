import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input
} from 'reactstrap';

const CardModal = ({ card: editCard, onSave, onClose }) => {
  const [ card, setCard ] = useState(editCard);
  useEffect(() => {
    setCard({ ...editCard, isPristine: true });
  }, [editCard]);

  return (
    <Modal isOpen={true}>
      <ModalHeader>Card</ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup row inline>
            <Label className='col-form-label text-right col-3'>Front</Label>
            <div className='col-9'>
              <Input
                className='font-weight-bold'
                value={card.front}
                placeholder={'Empty'}
                onChange={({ target: { value } }) => {
                  setCard({ ...card, isPristine: false, front: value })
                }}
              />
            </div>
          </FormGroup>
          <FormGroup row inline>
            <Label className='col-form-label text-right col-3'>Back</Label>
            <div className='col-9'>
              <Input
                className='font-weight-bold'
                value={card.back}
                placeholder={'Empty'}
                onChange={({ target: { value } }) => {
                  setCard({ ...card, isPristine: false, back: value })
                }}
              />
            </div>
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color='default' onClick={() => onClose()}>Cancel</Button>
        <Button color='primary' onClick={() => onSave(card)}>Save</Button>
      </ModalFooter>
    </Modal>
  )
};

CardModal.propTypes = {
  card: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

CardModal.defaultProps = {
  card: { isNew: true },
};

export default CardModal;
