import React from 'react';
import './AddToUnreadButton.css'
import getMessage from './i18n.js'

const AddToUnreadButton = ({url, onClick, isPageUnread }) => (
  <button className='addToUnreadButton' onClick={onClick} disabled={!url.startsWith('http://') && !url.startsWith('https://')}>
    {isPageUnread ? getMessage('markAsRead') : getMessage('addToUnread')}
  </button>
);

export default AddToUnreadButton;
