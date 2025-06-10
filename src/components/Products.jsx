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

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

const Products = () => {
  const userData = useSelector((state) => state.userReducer.userInfo?.role);
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const debouncedSearch = useMemo(
    () => debounce((query) => setSearchQuery(query), 300),
    []
  );

  const startRecord = () => {
    recognition.start();
    recognition.onresult = (e) => {
      const transcript = e.results[e.resultIndex][0].transcript;
      setSearchQuery(transcript);
    };
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const addProduct = (product) => {
    dispatch(addCart(product));
  };

  const getProducts = useCallback(async () => {
    setLoading(true);
    try {
      const URL = `${process.env.REACT_APP_CLIENT_URL}products`;
      const response = await Axios.get(URL);
      const fetchedData = response.data.data;
      setData(fetchedData);
      setFilter(fetchedData);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  const handleDelete = async (id) => {
    try {
      const URL = `${process.env.REACT_APP_CLIENT_URL}products/${id}`;
      await Axios.delete(URL);
      getProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  useEffect(() => {
    const filteredProducts = data.filter((product) =>
      product.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilter(filteredProducts);
    setCurrentPage(1); // Reset to the first page when filter changes
  }, [searchQuery, data]);

  const handleSearchInputChange = (e) => {
    debouncedSearch(e.target.value);
  };

  const MyModal = ({ isOpen, onClose }) => {
    const modalStyle = {
      overlay: {
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 1000,
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
        zIndex: 1001,
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

  const Loading = () => (
    <>
      <div className="col-12 py-5 text-center">
        <Skeleton height={40} width={560} />
      </div>
      {[...Array(6)].map((_, index) => (
        <div key={index} className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
      ))}
    </>
  );

  const filterProduct = (cat) => {
    const updatedList = data.filter((item) => item.category === cat);
    setFilter(updatedList);
  };

  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filter.slice(indexOfFirstProduct, indexOfLastProduct);

  const ShowProducts = () => (
    <>
      <div className="buttons text-center py-3">
        {[
          "All",
          "men's clothing",
          "women's clothing",
          "jewelery",
          "electronics",
        ].map((category) => (
          <button
            key={category}
            className="btn btn-outline-dark btn-sm m-2"
            onClick={() =>
              category === "All" ? setFilter(data) : filterProduct(category)
            }
            onMouseEnter={(e) => {
              e.target.style.color = "#fff";
              e.target.style.backgroundColor = "#000";
            }}
            onMouseLeave={(e) => {
              e.target.style.color = "#000";
              e.target.style.backgroundColor = "transparent";
            }}
            style={{
              borderColor: "#000",
              color: "#000",
              borderRadius: "4px",
              transition: "all 0.2s ease",
            }}
          >
            {category}
          </button>
        ))}
      </div>

      {currentProducts.map((product) => (
        <div
          id={product._id}
          key={product._id}
          className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4"
          style={{ animation: "fadeIn 0.5s ease-out" }}
        >
          <div
            className="card text-center h-100 position-relative"
            style={{
              transition: "transform 0.2s ease-in-out",
              height: "100%",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.05)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            {userData === "admin" && (
              <span
                className="position-absolute top-0 end-0 p-2"
                onClick={() => handleDelete(product._id)}
                style={{
                  cursor: "pointer",
                  color: "#6c757d",
                  border: "1px solid #dee2e6",
                  borderRadius: "20%",
                  background: "#fff",
                  zIndex: "1",
                }}
                onMouseEnter={(e) => (e.target.style.color = "#dc3545")}
                onMouseLeave={(e) => (e.target.style.color = "#6c757d")}
              >
                <i className="bi bi-trash"></i>
              </span>
            )}
            <div
              style={{
                height: "150px",
                overflow: "hidden",
                position: "relative",
              }}
            >
              <img
                className="img-fluid"
                src={product.image}
                alt={product.title}
                style={{
                  width: "100%",
                  height: "100%",
                  display: "block",
                  objectFit: "contain",
                }}
              />
            </div>
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
                to={`/product/${product._id}`}
                className="btn btn-dark m-1"
                style={{ backgroundColor: "#000", borderColor: "#000" }}
              >
                Buy Now
              </Link>
              <button
                className="btn btn-dark m-1"
                style={{ backgroundColor: "#000", borderColor: "#000" }}
                onClick={(e) => {
                  addProduct(product);
                  setIsModalOpen(true);
                  e.target.classList.add("clicked");
                  setTimeout(() => e.target.classList.remove("clicked"), 500);
                }}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      ))}
      <div className="pagination-controls text-center">
        <button
          className="btn btn-outline-dark m-2"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          style={{ borderColor: "#000", color: "#000", borderRadius: "4px" }}
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
          style={{ borderColor: "#000", color: "#000", borderRadius: "4px" }}
        >
          Next
        </button>
      </div>
    </>
  );

  return (
    <div className="container py-3">
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
            className="search-icon"
            onClick={startRecord}
            style={{
              position: "absolute",
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
          </div>
        </div>
        {/* <div className="sort-controls text-center py-3">
            <label>Sort by:</label>
            <select
              value={""}
              onChange={(e) => console.log()}
              className="form-select"
              style={{ width: "200px", margin: "0 auto" }}
            >
              <option value="none">None</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="price-asc">Price (Low-High)</option>
              <option value="price-desc">Price (High-Low)</option>
            </select>
          </div> */}
      </div>
      {userData === "admin" && (
        <button
          className="px-4 btn btn-dark"
          onClick={() => navigate("addProduct")}
          style={{
            borderColor: "#000",
            color: "#fff",
            backgroundColor: "#000",
          }}
        >
          Add Product
        </button>
      )}
      <div className="row justify-content-center">
        {loading ? <Loading /> : <ShowProducts />}
      </div>
      <MyModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default Products;
