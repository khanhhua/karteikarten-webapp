import React from 'react';
import PropTypes from 'prop-types';
import { Button, ButtonGroup, ListGroup, ListGroupItem, Badge } from 'reactstrap';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';

import { faSmile, faSadCry, faLayerGroup } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const HealthIndicator = ({ stats }) => {
  if (stats.corrects_ratio >= 0.625) {
    return (
      <FontAwesomeIcon
        icon={faSmile} className='text-success'
        title={`Correct ratio ${stats.corrects_ratio * 100}%`}
      />
    );
  }

  return (
    <FontAwesomeIcon
      icon={faSadCry} className='text-warning'
      title={`Correct ratio ${stats.corrects_ratio * 100}%`}
    />
  );
};

const CollectionList = ({ dispatch, collections, className }) => (
  <ListGroup className={className || ''} flush>
    {collections.map(collection => (
      <ListGroupItem className='pl-0 pr-0'>
        <div className='float-right'>
          {collection.stats && <HealthIndicator stats={collection.stats} />}
          <ButtonGroup>
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
        </div>
        <>
          <FontAwesomeIcon icon={faLayerGroup} /> {collection.title}
        </>
      </ListGroupItem>
    ))}
  </ListGroup>
);

CollectionList.propTypes = {
  collections: PropTypes.array.isRequired,
  className: PropTypes.string
};

CollectionList.defaultProps = {
  collections: [],
};

export default connect(null, dispatch => ({ dispatch }))(CollectionList);
