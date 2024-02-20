import React from 'react';
import './AddToUnreadButton.css'

const AddToUnreadButton = ({url, onClick, isPageUnread }) => (
  <button className='addToUnreadButton' onClick={onClick} disabled={!url.startsWith('http://') && !url.startsWith('https://')}>
    {isPageUnread ? 'Mark as Read' : 'Add to Unread'}
  </button>
);

export default AddToUnreadButton;