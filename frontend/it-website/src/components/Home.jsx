import React from 'react';
import { Link } from 'react-router-dom';
import { Carousel } from 'react-bootstrap';

function Home() {
  const isLoggedIn = localStorage.getItem('token');

  return (
    <div className="container mt-5">
      <Carousel>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://jarrods.tech/wp-content/uploads/2023/12/asus-rog-zephyrus-m16-2023-gaming-laptop-1024x576.jpg"
            alt="First slide"
            style={{ height: '400px', objectFit: 'cover' }}
          />
          <Carousel.Caption>
            <h3>อุปกรณ์ IT ที่ทันสมัย</h3>
            <p>ค้นหาอุปกรณ์ที่ตอบโจทย์ทุกความต้องการ</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://cdn1.productnation.co/stg/sites/6/60bde00005e7a.jpeg"
            alt="Second slide"
            style={{ height: '400px', objectFit: 'cover' }}
          />
          <Carousel.Caption>
            <h3>เทคโนโลยีเพื่ออนาคต</h3>
            <p>สำรวจโลกแห่งนวัตกรรมไปกับเรา</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://www.ktc.co.th/pub/media/Article/02/gaming-gear1200x630.webp"
            alt="Third slide"
            style={{ height: '400px', objectFit: 'cover' }}
          />
          <Carousel.Caption>
            <h3>สินค้าคุณภาพสูง</h3>
            <p>เลือกสิ่งที่ดีที่สุดสำหรับคุณ</p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>

      <div className="jumbotron bg-light p-5 rounded shadow-lg mt-5 text-center">
        <h1 className="display-4 text-primary fw-bold">ยินดีต้อนรับสู่ IT L1Nz</h1>
        <p className="lead text-muted mt-3">
          ค้นหาและจัดการข้อมูลอุปกรณ์ IT ที่คุณชื่นชอบได้ที่นี่
        </p>
        <hr className="my-4" />
        <p>เริ่มต้นด้วยการสำรวจอุปกรณ์หรือเข้าร่วมกับเรา</p>
        <div className="d-flex justify-content-center gap-3">
          <Link className="btn btn-primary btn-lg" to="/devices">ดูอุปกรณ์</Link>
          {!isLoggedIn && (
            <Link className="btn btn-outline-primary btn-lg" to="/login">ล็อกอิน</Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;