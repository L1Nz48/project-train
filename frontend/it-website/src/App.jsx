import React from 'react';
import { Link } from 'react-router-dom';
import { Carousel } from 'react-bootstrap';
import './Home.css';

function Home() {
  const isLoggedIn = localStorage.getItem('token');

  return (
    <div className="container my-5">
      <h1 className="visually-hidden">หน้าแรก IT L1Nz</h1>
      <Carousel aria-label="สไลด์โฆษณาอุปกรณ์ IT">
        <Carousel.Item>
          <img
            className="d-block w-100 carousel-img"
            src="https://jarrods.tech/wp-content/uploads/2023/12/asus-rog-zephyrus-m16-2023-gaming-laptop-1024x576.jpg"
            alt="ภาพโฆษณาอุปกรณ์ IT ที่ทันสมัย"
            loading="lazy"
          />
          <Carousel.Caption>
            <h3>อุปกรณ์ IT ที่ทันสมัย</h3>
            <p>ค้นหาอุปกรณ์ที่ตอบโจทย์ทุกความต้องการ</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100 carousel-img"
            src="https://cdn1.productnation.co/stg/sites/6/60bde00005e7a.jpeg"
            alt="ภาพโฆษณาเทคโนโลยีเพื่ออนาคต"
            loading="lazy"
          />
          <Carousel.Caption>
            <h3>เทคโนโลยีเพื่ออนาคต</h3>
            <p>สำรวจโลกแห่งนวัตกรรมไปกับเรา</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100 carousel-img"
            src="https://www.ktc.co.th/pub/media/Article/02/gaming-gear1200x630.webp"
            alt="ภาพโฆษณารายละเอียดอุปกรณ์ IT"
            loading="lazy"
          />
          <Carousel.Caption>
            <h3>รายละเอียดอุปกรณ์ครบ</h3>
            <p>เลือกสิ่งที่ดีที่สุดสำหรับคุณ</p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>

      <div className="jumbotron bg-light p-5 rounded shadow-lg my-5 text-center">
        <h2 className="display-4 text-primary fw-bold">ยินดีต้อนรับสู่ IT L1Nz</h2>
        <p className="lead text-muted mt-3">
          ค้นหาและจัดการข้อมูลอุปกรณ์ IT ที่คุณชื่นชอบได้ที่นี่
        </p>
        <hr className="my-4" />
        <p>เริ่มต้นด้วยการสำรวจอุปกรณ์หรือเข้าร่วมกับเรา</p>
        <div className="d-flex justify-content-center gap-3">
          <Link
            className="btn btn-primary btn-lg"
            to="/devices"
            aria-label="ดูรายการอุปกรณ์"
          >
            ดูอุปกรณ์
          </Link>
          {!isLoggedIn && (
            <Link
              className="btn btn-outline-primary btn-lg"
              to="/login"
              aria-label="ล็อกอินเข้าสู่ระบบ"
            >
              ล็อกอิน
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;