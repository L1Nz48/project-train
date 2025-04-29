import React from 'react';


function Footer() {
  return (
    <footer className="bg-dark text-light py-4 mt-auto" role="contentinfo">
      <div className="container text-center">
        <p className="mb-1">อัปเดตอุปกรณ์IT คอมพิวเตอร์ แล็ปท็อป โทรศัพทร์ อุปกรณ์ต่างๆ สงวนลิขสิทธิ์ ©2025 L1Nz</p>
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