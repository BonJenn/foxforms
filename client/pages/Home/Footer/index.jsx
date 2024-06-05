import React from 'react';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerLeftSide}>
        <p><span>BENN</span> Technologies inc.</p>
      </div> {/* Closing tag added here */}
      
      <div className={styles.footerRightSide}>
        <a href="/about">About Us</a>
        <a href="/terms">Terms of Service</a>
        <a href="/privacy">Privacy Policy</a> 
      </div>
    </footer>
  );
}

export default Footer;



