import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { replace } from 'react-router-redux';
import PropTypes from 'prop-types';
import { Container, Row, Col, Modal, ModalBody, Button } from 'reactstrap';

import { FETCH_RECENT_COLLECTIONS, STATUS_PENDING } from '../constants';
import CollectionList from '../components/CollectionList';

const HomePage = ({ dispatch, isLoading, collections }) => {
  useEffect(() => {
    dispatch({ type: FETCH_RECENT_COLLECTIONS, status: STATUS_PENDING });
  }, []);

  if (isLoading) {
    return (<div className="text-center">Loading...</div>);
  }

  if (!collections.length) {
    return (
      <Modal isOpen={true}>
        <ModalBody>
          <p className="display-4 text-center">Welcome to Karteikarten!</p>
          <p>Let's create your first collection!</p>
          <Row className='justify-content-center'>
            <Button
              color="primary"
              onClick={() => dispatch(replace('/create-collection'))}
            >Let's go!</Button>
          </Row>
        </ModalBody>
      </Modal>
    );
  }

  return (
    <Container>
      <h1 className='page-title'>Dashboard</h1>
      <Row>
        <Col widths={[12]}>
          <h2>Recent collections</h2>
          <CollectionList collections={collections} />
        </Col>
      </Row>
      {/* TODO: Either statistics or progress or challenge others */}
    </Container>
  );
};

HomePage.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  collections: PropTypes.array.isRequired,
};

HomePage.defaultProps = {
  isLoading: true,
  collections: [],
};

const mapStateToProps = (state) => ({
  collections: state.coreData.collections,
  isLoading: state.network.busy,
});

export default connect(mapStateToProps, dispatch => ({ dispatch }))(HomePage);
