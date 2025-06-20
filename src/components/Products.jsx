import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addCart } from "../redux/action";
import { AiTwotoneAudio } from "react-icons/ai";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Modal from "react-modal";
import debounce from "lodash.debounce";
import {  useTrail, animated } from "@react-spring/web";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

const Products = () => {
  const userRole = useSelector((state) => state.userReducer.userInfo?.role);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const debouncedSearch = useMemo(
    () => debounce((query) => setSearchQuery(query), 300),
    []
  );

  const startRecord = () => {
    recognition.start();
    recognition.onresult = (e) => {
      setSearchQuery(e.results[e.resultIndex][0].transcript);
    };
  };

  const addProduct = (product) => {
    dispatch(addCart(product));
    setIsModalOpen(true);
  };

  const getProducts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await Axios.get(
        `${process.env.REACT_APP_CLIENT_URL}products`
      );
      setData(response.data.data);
      setFilter(response.data.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  useEffect(() => {
    const filtered = data.filter((p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilter(filtered);
    setCurrentPage(1);
  }, [searchQuery, data]);

  const handleSearchChange = (e) => {
    debouncedSearch(e.target.value);
  };

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentProducts = filter.slice(indexOfFirst, indexOfLast);

  // Animations
  const trail = useTrail(currentProducts.length, {
    from: { opacity: 0, transform: "scale(0.9)" },
    to: { opacity: 1, transform: "scale(1)" },
    config: { mass: 1, tension: 200, friction: 25 },
  });

  

  return (
    <div className="container py-3">
      <h2 className="display-5 text-center">Latest Products</h2>
      <hr />
      <div className="row justify-content-center mb-3">
        <div className="col-md-6 position-relative">
          <input
            type="text"
            className="form-control"
            placeholder="Search Products..."
            value={searchQuery}
            onChange={handleSearchChange}
            style={{
              paddingRight: "40px",
              borderBottom: `2px solid ${searchQuery ? "#007bff" : "#ccc"}`,
              transition: "border 0.3s ease",
            }}
          />
          <animated.div
            onClick={startRecord}
            className="search-icon position-absolute"
            style={{
              top: "50%",
              right: "12px",
              transform: "translateY(-50%)",
              cursor: "pointer",
              border: "1px solid #ccc",
              borderRadius: "10%",
              padding: "5px",
              backgroundColor: "#fff",
            }}
          >
            <AiTwotoneAudio />
          </animated.div>
        </div>
      </div>

      {userRole === "admin" && (
        <button
          className="btn btn-dark mb-3"
          onClick={() => navigate("addProduct")}
        >
          Add Product
        </button>
      )}

      <div className="row justify-content-center">
        {loading ? (
          <>
            <div className="col-12 py-5 text-center">
              <Skeleton height={40} width={600} />
            </div>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="col-md-4 col-sm-6 mb-4">
                <Skeleton height={300} />
              </div>
            ))}
          </>
        ) : (
          trail.map((style, idx) => {
            const product = currentProducts[idx];
            return (
              <animated.div
                key={product._id}
                className="col-md-4 mb-4"
                style={style}
              >
                <div
                  className="card h-100 position-relative"
                  style={{ transition: "transform 0.2s ease" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "scale(1.03)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                >
                  <div className="card-body text-center">
                    <div style={{ height: "150px", overflow: "hidden" }}>
                      <img
                        src={product.image}
                        alt={product.title}
                        className="img-fluid"
                        style={{ objectFit: "contain", maxHeight: "100%" }}
                      />
                    </div>
                    <h5 className="card-title mt-3">
                      {product.title.substring(0, 12)}...
                    </h5>
                    <p className="card-text">
                      {product.description.substring(0, 90)}...
                    </p>
                    <p className="lead">$ {product.price}</p>
                    <Link
                      to={`/product/${product._id}`}
                      className="btn btn-dark m-1"
                      style={{ transition: "transform 0.2s" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.transform = "scale(1.05)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.transform = "scale(1)")
                      }
                    >
                      Buy Now
                    </Link>
                    <button
                      className="btn btn-dark m-1"
                      style={{ transition: "transform 0.2s" }}
                      onClick={() => addProduct(product)}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.transform = "scale(1.05)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.transform = "scale(1)")
                      }
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </animated.div>
            );
          })
        )}
      </div>

      <div className="text-center">
        <button
          className="btn btn-outline-dark m-2"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>Page {currentPage}</span>
        <button
          className="btn btn-outline-dark m-2"
          onClick={() =>
            setCurrentPage((prev) =>
              prev < Math.ceil(filter.length / itemsPerPage) ? prev + 1 : prev
            )
          }
          disabled={currentPage === Math.ceil(filter.length / itemsPerPage)}
        >
          Next
        </button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        style={{
          overlay: { backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1000 },
          content: {
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            borderRadius: "8px",
            padding: "20px",
            textAlign: "center",
          },
        }}
      >
        <h2>Added to Cart</h2>
        <button
          onClick={() => setIsModalOpen(false)}
          className="btn btn-primary mt-3"
        >
          Close
        </button>
      </Modal>
    </div>
  );
};

export default Products;
