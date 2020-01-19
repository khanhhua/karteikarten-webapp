import React, { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Row, Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input,
} from 'reactstrap';
import { useDropzone } from 'react-dropzone';
import { STATUS_PENDING, UPLOAD_ASSET } from '../constants';

const CardModal = ({ dispatch, media, mediaContext, card: editCard, onSave, onClose }) => {
  const [ card, setCard ] = useState(editCard);
  const onDrop = useCallback((files) => {
    const acceptedFiles = (files || []).filter(() => true);
    if (!acceptedFiles.length) {
      return;
    }
    dispatch({
      type: UPLOAD_ASSET,
      status: STATUS_PENDING,
      mediaContext,
      file: acceptedFiles[0] });
  }, []);
  const {getRootProps, getInputProps, isDragActive} = useDropzone({ onDrop });

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
          <div {...getRootProps()} className="border border-secondary bg-light text-center pt-4 pb-4">
            <input {...getInputProps()} />
            {
              isDragActive ?
                <p className="m-0">Drop the files here ...</p> :
                <p className="m-0">Drop in a picture or sound file</p>
            }
            {(editCard && editCard.media && editCard.media.url) ?
              <Row className="justify-content-center">
                <img src={editCard.media.url} />
              </Row>
            :
            media ?
              <Row className="justify-content-center">
                <img src={media.url} />
              </Row>
            :
            null
            }
          </div>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color='default' onClick={() => onClose()}>Cancel</Button>
        <Button color='primary' onClick={() => {
          if (media && card.media_id !== media.id) {
            onSave({ ...card, media_id: media.id })
          } else {
            onSave(card);
          }
        }}>Save</Button>
      </ModalFooter>
    </Modal>
  )
};

CardModal.propTypes = {
  dispatch: PropTypes.func.isRequired,
  card: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  mediaContext: PropTypes.string.isRequired,
  media: PropTypes.object,
};

CardModal.defaultProps = {
  card: { isNew: true },
};

const mapStateToProps = (state, props) => {
  const { mediaContext } = props;
  if (!(mediaContext in state.media)) {
    return {
      media: null,
    }
  }

  return {
    media: state.media[mediaContext]
  };
};

export default connect(mapStateToProps, dispatch => ({ dispatch }))(CardModal);
