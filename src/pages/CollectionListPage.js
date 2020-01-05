import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { push, replace } from 'react-router-redux';
import {
  Row, ListGroup, ListGroupItem, ButtonGroup, Button,
} from 'reactstrap';

import { FETCH_COLLECTIONS, STATUS_PENDING } from '../constants';
import AppNavbar from '../components/AppNavbar';

const CollectionListPage = ({ dispatch, collections }) => {
  useEffect(() => {
    dispatch({ type: FETCH_COLLECTIONS, status: STATUS_PENDING });
  }, []);

  return (
    <>
      <AppNavbar />
      <div className='container'>
        <div className='row'>
          <div className='col-12'>
            <h1 className='page-title'>Your Collections</h1>

            <Row className='justify-content-end pr-3'>
              <Button
                color='link'
                onClick={() => dispatch(push('/create-collection'))}
              >Create Collection</Button>
            </Row>
            <ListGroup className='pt-3'>
              {collections.map(collection => (
                <ListGroupItem>
                  <ButtonGroup className='float-right'>
                    <Button
                      size='sm'
                      color='link'
                      onClick={() => dispatch(push(`/collections/${collection.id}`))}
                    >View</Button>
                    <Button
                      size='sm'
                      color='link'
                      onClick={() => dispatch(push(`/review/${collection.id}`))}
                    >Review</Button>
                  </ButtonGroup>
                  {collection.title}
                </ListGroupItem>
              ))}
            </ListGroup>
          </div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  collections: state.coreData.collections || [],
});

export default connect(mapStateToProps, dispatch => ({ dispatch }))(CollectionListPage);
