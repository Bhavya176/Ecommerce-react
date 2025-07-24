import React, { useState, useEffect, useRef } from "react";

const images = [
  "https://previews.123rf.com/images/maxborovkov/maxborovkov1809/maxborovkov180900100/107813015-big-sale-banner-promotion-banner-with-colorful-maple-leaves-for-shopping-vector-background.jpg",
  "https://cdn.pixabay.com/photo/2015/11/28/11/26/sale-1067126_1280.jpg",
  "https://cdn.pixabay.com/photo/2019/11/26/19/37/black-friday-4655335_1280.jpg",
];

const Home = () => {
  const [current, setCurrent] = useState(0);
  const timeoutRef = useRef(null);

  // Auto-slide every 3 seconds
  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearTimeout(timeoutRef.current);
  }, [current]);

  // Navigation handlers
  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  };
  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % images.length);
  };

  return (
    <div className="hero position-relative border-1 pb-3" style={{ margin: "0 auto" }}>
      <div className="card bg-dark text-white border-0">
        <img
          className="card-img img-fluid"
          src={images[current]}
          alt="Hero Banner"
          style={{ height: 200, objectFit: "inherit", width: "100%" }}
        />
        {/* Left Button */}
        <button
          onClick={prevSlide}
          className="btn btn-light position-absolute"
          style={{ top: "50%", left: 20, transform: "translateY(-50%)", zIndex: 2, opacity: 0.7 }}
        >
          &#8592;
        </button>
        {/* Right Button */}
        <button
          onClick={nextSlide}
          className="btn btn-light position-absolute"
          style={{ top: "50%", right: 20, transform: "translateY(-50%)", zIndex: 2, opacity: 0.7 }}
        >
          &#8594;
        </button>
        {/* Dots */}
        <div className="position-absolute w-100 d-flex justify-content-center" style={{ bottom: 10 }}>
          {images.map((_, idx) => (
            <span
              key={idx}
              onClick={() => setCurrent(idx)}
              style={{
                display: "inline-block",
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: idx === current ? "#fff" : "#888",
                margin: "0 5px",
                cursor: "pointer",
                border: "1px solid #fff",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;