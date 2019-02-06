import React from 'react';
import { Link } from 'react-router-dom';

const parseUserEmail = (email, id) => ({
  emailText: email === JSON.parse(localStorage.getItem('user')).email ? 'You' : email,
  userLink: `${process.env.PUBLIC_URL}/accounts/profile/${id}/`,
});

const userTableCell = (email, id) => {
  const { emailText, userLink } = parseUserEmail(email, id);
  return (
    <Link to={userLink}>{emailText}</Link>
  );
};

export default userTableCell;
