import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { Link, useParams } from "react-router-dom";
import Marquee from "react-fast-marquee";
import { useDispatch } from "react-redux";
import { addCart } from "../redux/action";
import { Footer, Navbar } from "../components";
import ReactGA from "react-ga4";

const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState([]);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const dispatch = useDispatch();

  const addProduct = (product) => {
    dispatch(addCart(product));
    // Track the "Add to Cart" event
    ReactGA.event({
      category: "E-commerce",
      action: "Add to Cart",
      label: product.title, // You can label with the product title or ID
    });
  };

  const handleGoToCartClick = () => {
    // Track the "Go to Cart" event
    ReactGA.event({
      category: "E-commerce",
      action: "Go to Cart",
      label: "User clicked on Go to Cart",
    });
  };

  const handleBuyNowClick = (item) => {
    // Track the "Buy Now" event for similar products
    ReactGA.event({
      category: "E-commerce",
      action: "Buy Now",
      label: item.title, // You can label with the product title or ID
    });
  };

  useEffect(() => {
    const getProduct = async () => {
      setLoading(true);
      setLoading2(true);
      const URL = process.env.REACT_APP_CLIENT_URL + "products/" + id;

      const response = await fetch(URL);
      const data = await response.json();

      setProduct(data.data);
      setLoading(false);
      const URLBASE = process.env.REACT_APP_CLIENT_URL + "products";

      const response2 = await fetch(URLBASE);
      const data2 = await response2.json();
      const filtered = data2.data.filter(
        (item) => item.category === data.data.category
      );
      window.scrollTo({ top: 0, behavior: "smooth" });

      setSimilarProducts(filtered);
      setLoading2(false);
    };
    getProduct();
  }, [id]);

  const Loading = () => {
    return (
      <>
        <div className="container my-5 py-2">
          <div className="row">
            <div className="col-md-6 py-3">
              <Skeleton height={400} width={400} />
            </div>
            <div className="col-md-6 py-5">
              <Skeleton height={30} width={250} />
              <Skeleton height={90} />
              <Skeleton height={40} width={70} />
              <Skeleton height={50} width={110} />
              <Skeleton height={120} />
              <Skeleton height={40} width={110} inline={true} />
              <Skeleton className="mx-3" height={40} width={110} />
            </div>
          </div>
        </div>
      </>
    );
  };

  const ShowProduct = () => {
    return (
      <>
        <div className="container my-2 py-2">
          <div className="row">
            <div
              className="col-md-5 col-sm-12 py-3"
              style={{ textAlign: "center", alignSelf: "center" }}
            >
              <img
                className="img-fluid"
                src={product.image}
                alt={product.title}
                width="250px"
                height="250px"
              />
            </div>
            <div className="col-md-5 col-md-6 py-5">
              <h4 className="text-uppercase text-muted">{product.category}</h4>
              <h1 className="display-5">{product.title}</h1>
              <p className="lead">
                {product.rating && product.rating.rate}{" "}
                <i className="fa fa-star"></i>
              </p>
              <h3 className="display-6  my-4">${product.price}</h3>
              <p className="lead">{product.description}</p>
              <button
                className="btn btn-outline-dark"
                onClick={() => addProduct(product)}
              >
                Add to Cart
              </button>
              <Link
                to="/cart"
                className="btn btn-dark mx-3"
                onClick={handleGoToCartClick}
              >
                Go to Cart
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  };

  const Loading2 = () => {
    return (
      <>
        <div className="my-4 py-4">
          <div className="d-flex">
            <div className="mx-4">
              <Skeleton height={400} width={250} />
            </div>
            <div className="mx-4">
              <Skeleton height={400} width={250} />
            </div>
            <div className="mx-4">
              <Skeleton height={400} width={250} />
            </div>
            <div className="mx-4">
              <Skeleton height={400} width={250} />
            </div>
          </div>
        </div>
      </>
    );
  };

  const ShowSimilarProduct = () => {
    return (
      <>
        <div className="py-4 my-4">
          <div className="d-flex">
            {similarProducts.map((item) => {
              return (
                <div key={item._id} className="card mx-4 text-center">
                  <img
                    className="card-img-top p-3"
                    src={item.image}
                    alt="Card"
                    height={150}
                    width={150}
                  />
                  <div className="card-body">
                    <h5 className="card-title">
                      {item.title.substring(0, 15)}...
                    </h5>
                  </div>
                  <div className="card-body">
                    <Link
                      to={"/product/" + item._id}
                      className="btn btn-dark m-1"
                      onClick={() => handleBuyNowClick(item)}
                    >
                      Buy Now
                    </Link>
                    <button
                      className="btn btn-dark m-1"
                      onClick={() => addProduct(item)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="row">{loading ? <Loading /> : <ShowProduct />}</div>
        <div className="row my-5 py-5">
          <div className="d-none d-md-block">
            <h2 className="">You may also Like</h2>
            <Marquee pauseOnHover={true} pauseOnClick={true} speed={50}>
              {loading2 ? <Loading2 /> : <ShowSimilarProduct />}
            </Marquee>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Product;
