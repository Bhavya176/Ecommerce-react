import React, { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { addCart } from "../redux/action";
import { useSelector } from "react-redux";
import { AiTwotoneAudio } from "react-icons/ai";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Axios from "axios";
import "./../pages/Home";
import { Link, useNavigate } from "react-router-dom";
import Modal from "react-modal";
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
var current, transcript, upperCase;
const Products = () => {
  const userData = useSelector((state) => state.userReducer.userInfo?.role);

  const [data, setData] = useState([]);
  const [filter, setFilter] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const startRecord = (e) => {
    recognition.start(e);
    recognition.onresult = (e) => {
      current = e.resultIndex;
      transcript = e.results[current][0].transcript;
      upperCase = transcript.charAt(0).toUpperCase() + transcript.substring(1);
      setSearchQuery(transcript);
    };
  };
  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const addProduct = (product) => {
    dispatch(addCart(product));
  };
  const getProducts = useCallback(async () => {
    setLoading(true);
    try {
      const URL = process.env.REACT_APP_CLIENT_URL + "products";
      console.log("URL", URL);
      const response = await Axios.get(URL);

      setData(await response.data.data);
      setFilter(await response.data.data);
      setLoading(false);
    } catch (error) {
      console.log("error", error);
    }
  }, []);
  useEffect(() => {
    getProducts();
  }, [getProducts]);
  const handleDelete = async (id) => {
    console.log("id", id);
    try {
      const URL = process.env.REACT_APP_CLIENT_URL + "products/" + id;
      console.log("URL", URL);
      const response = await Axios.delete(URL);
      console.log("response", response);
      getProducts();
    } catch (error) {
      console.log("error", error);
    }
  };
  useEffect(() => {
    const filteredProducts = data.filter((product) =>
      product.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilter(filteredProducts);
  }, [searchQuery, data]);

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };
  const MyModal = ({ isOpen, onClose }) => {
    const modalStyle = {
      overlay: {
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 1000, // Higher z-index value
      },
      content: {
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)",
        borderRadius: "8px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
        padding: "20px",
        maxWidth: "400px",
        width: "90%",
        textAlign: "center",
        zIndex: 1001, // Higher z-index value
      },
    };

    return (
      <Modal isOpen={isOpen} onRequestClose={onClose} style={modalStyle}>
        <h2>Added to Cart</h2>
        <button
          onClick={onClose}
          style={{
            marginTop: "10px",
            padding: "8px 20px",
            borderRadius: "4px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          Close Modal
        </button>
      </Modal>
    );
  };
  const Loading = () => {
    return (
      <>
        <div className="col-12 py-5 text-center">
          <Skeleton height={40} width={560} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
      </>
    );
  };

  const filterProduct = (cat) => {
    const updatedList = data.filter((item) => item.category === cat);
    setFilter(updatedList);
  };
  const ShowProducts = () => {
    return (
      <>
        <div className="buttons text-center py-3">
          <button
            className="btn btn-outline-dark btn-sm m-2"
            onClick={() => setFilter(data)}
          >
            All
          </button>
          <button
            className="btn btn-outline-dark btn-sm m-2"
            onClick={() => filterProduct("men's clothing")}
          >
            Men's Clothing
          </button>
          <button
            className="btn btn-outline-dark btn-sm m-2"
            onClick={() => filterProduct("women's clothing")}
          >
            Women's Clothing
          </button>
          <button
            className="btn btn-outline-dark btn-sm m-2"
            onClick={() => filterProduct("jewelery")}
          >
            Jewelery
          </button>
          <button
            className="btn btn-outline-dark btn-sm m-2"
            onClick={() => filterProduct("electronics")}
          >
            Electronics
          </button>
        </div>

        {filter.map((product) => {
          return (
            <div
              id={product._id}
              key={product._id}
              className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4"
              style={{
                animation: "fadeIn 0.5s ease-out", // Define animation
              }}
            >
              <div
                className="card text-center h-100 position-relative" // added position-relative
                key={product._id}
                style={{
                  transition: "transform 0.2s ease-in-out", // Adding transition for smooth animation
                  height: "100%", // Set a fixed height for the card
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.05)"; // Scale up on hover
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)"; // Restore original scale on mouse leave
                }}
              >
                {userData === "admin" ? (
                  <span
                    className="position-absolute top-0 end-0 p-2 delete-icon"
                    onClick={() => handleDelete(product._id)} // function to delete the product
                    style={{
                      cursor: "pointer", // Set cursor to pointer
                      color: "#6c757d", // Set default color
                      border: "1px solid #dee2e6", // Add border
                      borderRadius: "20%", // Make the border circle
                      background: "#fff", // Background color
                      zIndex: "1", // Ensure the icon is above the card content
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = "#dc3545"; // Change color on hover
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = "#6c757d"; // Restore default color on mouse leave
                    }}
                  >
                    <i className="bi bi-trash"></i> {/* trash icon */}
                  </span>
                ) : null}
                <img
                  className="img-fluid"
                  src={product.image}
                  alt={product.title}
                  style={{
                    width: "100%", // Make sure the image takes 100% width of its container
                    height: "auto", // Maintain aspect ratio
                    maxHeight: "200px", // Set maximum height for the image
                    objectFit: "contain",
                  }}
                />

                <div className="card-body">
                  <h5 className="card-title">
                    {product.title.substring(0, 12)}...
                  </h5>
                  <p className="card-text">
                    {product.description.substring(0, 90)}...
                  </p>
                </div>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item lead">$ {product.price}</li>
                </ul>

                <div className="card-body">
                  <Link
                    to={"/product/" + product._id}
                    className="btn btn-dark m-1"
                  >
                    Buy Now
                  </Link>
                  <button
                    className="btn btn-dark m-1 add-to-cart-button"
                    onClick={(e) => {
                      addProduct(product);
                      setIsModalOpen(true);
                      e.target.classList.add("clicked"); // Add 'clicked' class to trigger animation
                      setTimeout(() => {
                        e.target.classList.remove("clicked"); // Remove 'clicked' class after animation duration
                      }, 500);
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </>
    );
  };
  return (
    <>
      <div className="container  py-3">
        <div className="row">
          <div className="col-12">
            <h2 className="display-5 text-center">Latest Products</h2>
            <hr />
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-md-6" style={{ position: "relative" }}>
            <input
              type="text"
              className="form-control"
              placeholder="Search Products..."
              value={searchQuery}
              onChange={handleSearchInputChange}
              style={{ paddingRight: "40px" }}
            />
            <div
              style={{
                position: "absolute",
                top: "50%",
                right: "12px",
                transform: "translateY(-50%)",
                cursor: "pointer",
                border: "1px solid #ccc",
                borderRadius: "10%",
                padding: "5px",
              }}
              onClick={(e) => startRecord(e)}
            >
              <AiTwotoneAudio />
            </div>
          </div>
        </div>
        {userData === "admin" ? (
          <button
            className=" px-4  btn btn-dark"
            onClick={() => navigate("addProduct")}
          >
            Add Product
          </button>
        ) : null}
        <div className="row justify-content-center">
          {loading ? <Loading /> : <ShowProducts />}
        </div>
        <MyModal isOpen={isModalOpen} onClose={closeModal} />
      </div>
    </>
  );
};

export default Products;
