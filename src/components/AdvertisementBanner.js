// AdvertisementBanner.js

import React from "react";

function AdvertisementBanner() {
  return (
    <div className="advertisement-banner">
      {/* Use the relative path of your local image */}
      {/* <img src="/advertisement-image.jpg" alt="Advertisement" /> */}
      <img
        className="card-img img-fluid"
        src="./assets/advertisement-image.png.jpg"
        alt="Advertisement"
        height={500}
      />
    </div>
  );
}

export default AdvertisementBanner;
