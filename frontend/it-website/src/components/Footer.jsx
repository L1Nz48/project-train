import React from 'react';


function Footer() {
  return (
    <footer className="bg-dark text-light py-4 mt-auto" role="contentinfo">
      <div className="container text-center">
        <p className="mb-1">© 2025 IT Devices. สงวนลิขสิทธิ์.</p>
        <p className="mb-0">
          ติดต่อเรา:{' '}
          <a
            href="mailto:67319010024@loeitech.ac.th"
            className="text-light"
            aria-label="ส่งอีเมลถึงทีมงาน"
          >
            67319010024@loeitech.ac.th
          </a>{' '}
          |{' '}
          <a
            href="https://www.facebook.com/north.ch.79/"
            className="text-light ms-2"
            aria-label="เยี่ยมชมหน้า Facebook ของเรา"
          >
            Facebook
          </a>
        </p>
      </div>
    </footer>
  );
}

export default Footer;