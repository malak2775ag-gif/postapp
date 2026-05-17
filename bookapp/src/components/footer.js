import React from 'react';
import { Container } from 'reactstrap';

const Footer = () => {
  return (
    <footer className="fancy-footer py-4 mt-auto">
      <Container className="text-center">
        <p className="mb-0">&copy; {new Date().getFullYear()} HIBR Reading Tracker App. All rights reserved. Your personalized companion for tracking books, managing your reading list, and discovering new literary adventures.</p>
        <small className="text-muted">Keep shining and keep reading!</small>
      </Container>
    </footer>
  );
};

export default Footer;