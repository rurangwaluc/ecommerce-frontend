import React, { useEffect, useState } from 'react'
import Axios from 'axios';
import Card from "./UCard";
import { Link } from 'react-router-dom'
import { Col, Row, Button } from 'antd';
import Icon from '@ant-design/icons';
import ShowImage from './Tools/ShowImage';
import { getProducts, getProductsBySell, getDailyProducts, getCategories, getFilteredProducts } from "./apiCore";
import List from "./ListCategories";
import { addItem, addWishlistItem } from './cartHelpers';
import Menu from './Menu'
import Footer from './Footer'
import ImageSlider from './Tools/ImageSlider'
import img1 from '../img/phone1.jpg'
import img2 from '../img/phone2.jpg'
import img4 from '../img/a.jpg'
import img5 from '../img/b.jpg'
import img6 from '../img/c.jpg'
import img7 from '../img/e.jpg'
import img8 from '../img/e.jpg'
import img9 from '../img/f.jpg'
import asset from '../img/big-ad-1.jpg'
import smallAd from '../img/small-ad.jpg'
import partner from '../img/oppo.png'

const API = process.env.REACT_APP_API_URL;

const { Meta } = Card;

const Home = (props) => {

  const [Products, setProducts] = useState([])
  const [Skip, setSkip] = useState(0)
  const [Limit, setLimit] = useState(8)
  const [PostSize, setPostSize] = useState()
  const [SearchTerms, setSearchTerms] = useState("")
  const [Categories, setCategories] = useState([]);

  const [myFilters, setMyFilters] = useState({
    filters: { category: [], price: [] }
  });
  const [Product, setProduct] = useState([]);
  const [redirect, setRedirect] = useState(false);
  const [ProductsByArrival, setProductsByArrival] = useState([]);
  const [ProductsByDay, setProductsByDay] = useState([]);
  const [ProductsBySell, setProductsBySell] = useState([]);
  const [error, setError] = useState(false);
  // const [filteredResults, setFilteredResults] = useState([]);
  const [size, setSize] = useState(0);

  const init = () => {
    getCategories().then(data => {
      if (data.error) {
        setError(data.error);
      } else {
        setCategories(data);
      }
    });
  };


  const loadFilteredResults = newFilters => {
    // console.log(newFilters);
    getFilteredProducts(Skip, Limit, newFilters).then(data => {
      if (data.error) {
        setError(data.error);

      } else {
        setProductsByArrival(data.data);
        setProductsBySell(data.data);
        setSize(data.size);
        setSkip(0);
      }

    });
  };
  const loadProductsByDay = () => {
    getDailyProducts('price').then(data => {
      if (data.error) {
        setError(data.error);
      } else {
        setProductsByDay(data);
      }
    });
  };

  const loadProductsByArrival = () => {
    getProducts('createdAt').then(data => {
      console.log(data);
      if (data.error) {
        setError(data.error);
      } else {
        setProductsByArrival(data);
      }
    });
  };

  const loadProductsBySell = () => {
    getProductsBySell('price').then(data => {
      if (data.error) {
        setError(data.error);
      } else {
        setProductsBySell(data);
      }
    });
  };


  useEffect(() => {
    loadProductsByDay();
    loadProductsBySell();
    loadProductsByArrival();
    init();
    loadFilteredResults(Skip, Limit, myFilters.filters);
    const variables = {
      skip: Skip,
      limit: Limit,
    }

    getProducts(variables)

  }, [])

  const handleFilters = (filters, filterBy) => {
    // console.log("SHOP", filters, filterBy);
    const newFilters = { ...myFilters };
    newFilters.filters[filterBy] = filters;

    // if (filterBy === "price") {
    //     let priceValues = handlePrice(filters);
    //     newFilters.filters[filterBy] = priceValues;
    // }
    loadFilteredResults(myFilters.filters);
    setMyFilters(newFilters);
  };

  const onLoadMore = () => {
    let skip = Skip + Limit;

    const variables = {
      skip: skip,
      limit: Limit,
      loadMore: true,
      filters: myFilters,
      searchTerm: SearchTerms
    }
    getProducts(variables)
    setSkip(skip)
  }

  const SrollToTop = () => {
    // window.location.reload(false);
    window.scrollTo({top:0, behavior: 'smooth'});
   
  } 

  const renderCardByDay = ProductsByDay.map((product, index) => {



    const addToCart = () => {
      addItem(product, setRedirect(true));
      console.log('added');
    };
    const addToWishlist = () => {
      addWishlistItem(product, setRedirect(true));
      console.log('added');
    };
    return <ul key={index} id="autoWidth" className="cS-hidden">
      <Link to={`/product/${product._id}`} onClick={SrollToTop}>
        <li className="item-a">
          <div className="daily-product">
            <Link to="" className="daily-product-category">{product.brand}</Link>
            <div className="product-info-container">

              <div className="daily-product-description">
                <Link to={`/product/${product._id}`}>
                  {product.title}
                </Link>
              </div>
              <div className="product-image">
                <Link to={`/product/${product._id}`}>
                  <ShowImage images={product.images} />
                </Link>
              </div>
              <div className="price-container">
                <div className="view-price"><span>{`Rwf ${product.price}`}</span></div>
                {/* <button onClick={addToCart} className="add-to-cart"><i className="fas fa-cart-plus"></i></button> */}
              </div>
            </div>

            <div className="hover-container">
              <div className="add-to-compare">
                <Link to="/cart" onClick={addToCart} title="Add to Cart"><i className="fas fa-cart-plus"></i>Cart</Link>
              </div>
              <div className="add-to-wishlist">
                <Link to="/wishlist" onClick={addToWishlist} title="Add to WishList"><i className="far fa-heart"></i>WishList</Link>
              </div>
            </div>
          </div>
        </li>
      </Link>



    </ul>

  })
  const renderCardByArrival = ProductsByArrival.map((product, index) => {



    const addToCart = () => {
      addItem(product, setRedirect(true));
      console.log('added');
    };
    const addToWishlist = () => {
      addWishlistItem(product, setRedirect(true));
      console.log('added');
    };
    return <div key={index} className="daily-product">
      <Link to={`/product/${product._id}`} onClick={SrollToTop}>

        <Link to="" className="daily-product-category">{product.brand}</Link>
        <div className="product-info-container">

          <div className="daily-product-description">
            <Link to={`/product/${product._id}`}>
              {product.title}
            </Link>
          </div>
          <div className="product-image">
            <Link to={`/product/${product._id}`}>
              <ShowImage images={product.images} />
            </Link>
          </div>
          <div className="price-container">
            <div className="view-price"><span>{`Rwf ${product.price}`}</span></div>
            {/* <button onClick={addToCart} className="add-to-cart"><i className="fas fa-cart-plus"></i></button> */}
          </div>
        </div>

        <div className="hover-container">
          <div className="add-to-compare">
            <Link to="/cart" onClick={addToCart} title="Add to Cart"><i className="fas fa-cart-plus"></i>Cart</Link>
          </div>
          <div className="add-to-wishlist">
            <Link to="/wishlist" onClick={addToWishlist} title="Add to WishList"><i className="far fa-heart"></i>WishList</Link>
          </div>
        </div>
      </Link>
    </div>

  })


  const renderCardBySell = ProductsBySell.map((product, index) => {
    const addToCart = () => {
      addItem(product, setRedirect(true));
      console.log('added');
    };
    const addToWishlist = () => {
      addWishlistItem(product, setRedirect(true));
      console.log('added');
    };
    return <div key={index} className="product-item">

      <div className="product-image">
        <Link to={`/product/${product._id}`} onClick={SrollToTop}>
          <ShowImage images={product.images} />
        </Link>
      </div>
      <Link className="text-decoration-none" to={`/product/${product._id}`}>
        <div className="product-description">
          <div className="product-border">
            <div className="product-category">

              <Link to="" >{product.brand}</Link>
            </div>
            <div className="product-name">
              <Link to={`/product/${product._id}`}>
                {product.title}
              </Link>
            </div>

            <div className="price-container">
              <div className="view-price"><span>{`Rwf ${product.price}`}</span></div>
              {/* <button onClick={addToCart} className="add-to-cart"><i className="fas fa-cart-plus"></i></button> */}
            </div>
          </div>

          <div className="hover-container">
            <div className="add-to-compare">
              <Link to="/cart" onClick={addToCart} title="Add to Cart"><i className="fas fa-cart-plus"></i>Cart</Link>
            </div>
            <div className="add-to-wishlist">
              <Link to="/wishlist" onClick={addToWishlist} title="Add to WishList"><i className="far fa-heart"></i>WishList</Link>
            </div>
          </div>
        </div>
      </Link>


    </div>

  })


  return (
    <div>
      <a id="button" title="Back To Top"></a>
      <Menu />

      <div className="main-home" >
        <section className="categories">
          <h2><i className="fas fa-bars"></i>Categories</h2>
          <ul className="main-categories">
            {Categories.length === 0 ?
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div class="spinner-1"></div>
              </div> :
              <List
                categories={Categories}
                handleFilters={filters =>
                  handleFilters(filters, "category")
                }
              />
            }
          </ul>
          <a href=""><div className="other-ad"></div></a>
        </section>
        <section className='slider-info'>
          <div className="slide-container">

            <ImageSlider />


          </div>

          <div className="other-categories">
            <div className="other-menu1">
              <a href="https://www.google.com/"><img src={img1} alt="" /></a>
            </div>
            <div className="other-menu2">
              <a href="https://www.youtube.com/"><img src={img2} alt="" /></a>

            </div>
            <div className="other-menu6">
              <a href="https://www.amazon.com/"><img src={img1} alt="" /></a>

            </div>
            <div className="other-menu7">
              <a href="https://www.youtube.com/"><img src={img2} alt="" /></a>

            </div>

          </div>
        </section>
        <section className="ads-bar">
          <a href=""><div className="ad1"></div></a>
          <a href=""><div className="ad2"></div></a>
        </section>
      </div>

      <section className="daily-deals">
        <div className="daily-deals-header">

          <div className="daily-deals-title"> <h3>Deals Of The Day</h3></div>
          <div className="countdown">Ends in: 00:00:00</div>
        </div>
        {ProductsByDay.length === 0 ?
          <div style={{ padding: '20px', alignItems: 'center' }}>
            <div class="spinner-1"></div>
          </div> :
          <section className="slider">
            {renderCardByDay}
          </section>
        }
      </section>
      <section className="big-ad1-container">
        <div className="big-ad1">
          <a href=""><img src={asset} alt="" /></a>
        </div>
      </section>


      <div className="new-arrivals">
        <div className="arrivals-header">

          <div className="arrivals-title"> <h3>New Arrivals</h3></div>
        </div>
        {ProductsByArrival.length === 0 ?
          <div style={{ padding: '20px', alignItems: 'center' }}>
            <div class="spinner-1"></div>
          </div> :
          <div className="new-products-container">

            {renderCardByArrival}

          </div>
        }
      </div>
      <section className="big-ad4">

        <div className="big-ad-image"><a href=""><img src={smallAd} alt="" /></a></div>
        <div className="big-ad-image"><a href=""><img src={smallAd} alt="" /></a></div>


      </section>
      <section className="best-sellers">
        <div className="sellers-header">

          <div className="sellers-title">             <h3>Best Sellers</h3>  </div>

        </div>



        {/* <div className="tab"> */}
        {ProductsBySell.length === 0 ?
          <div style={{ padding: '20px', alignItems: 'center' }}>
            <div class="spinner-1"></div>
          </div> :
          <div className="content-container">
            {renderCardBySell}
          </div>
        }
      </section>


      <section className="big-ad2-container">
        <div className="big-ad2">
          <a href=""><img src={asset} alt="" /></a>
        </div>
      </section>
      {/* Parteners */}

      <section className="partners">
        <div className="partners-header">
          <div className="partners-title">
            <h3>Partners</h3>
          </div>
        </div>
        <div className="partners-logo">
          <div className="logo">
            <img src={partner} alt="" />
          </div>
        </div>
      </section>

      <section className="trust">
        <div className="trust-content">
          <div className="content">
            <div className="content-icon"><i className="fas fa-truck"></i></div>
            <div className="content-text">
              <p>FREE SHIPPING</p>
              <p>free shipping on all products.</p>
            </div>
          </div>
          <div className="content">
            <div className="content-icon"><i className="fas fa-wallet"></i></div>
            <div className="content-text">
              <p>trusted provider</p>
              <p>trusted by our customers.</p>
            </div>
          </div>
          <div className="content">
            <div className="content-icon"><i className="fas fa-headset"></i></div>
            <div className="content-text">
              <p>online support 24/7</p>
              <p>you can call or text us at any time.</p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>

  )
};

export default Home;