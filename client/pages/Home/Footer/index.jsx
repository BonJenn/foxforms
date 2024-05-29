import React from 'react';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div>
        <a href="/about">About Us</a>
        <a href="/terms">Terms of Service</a>
        <a href="/privacy">Privacy Policy</a>
      </div>
      <p>© 2023 Your Company Name. All rights reserved.</p>
    </footer>
  );
}

export default Footer;

