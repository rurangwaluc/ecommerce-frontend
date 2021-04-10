import React, { useState, useEffect } from 'react';
import { getProducts, getClientToken, createOrder } from './apiCore';
import { emptyCart } from './cartHelpers';
import Card from './Card';
import { isAuthenticated } from '../auth';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

const Checkout = ({ products, setRun = f => f, run = undefined }) => {
    const [data, setData] = useState({
        loading: false,
        success: false,
        clientToken: null,
        error: '',
        instance: {},
        phone: '',
        color: '',
        district: '',
        sector: '',
        cell: '',
        village: '',
        address: ''
    });

    const userId = isAuthenticated() && isAuthenticated().user._id;
    const token = isAuthenticated() && isAuthenticated().token;



    const handleColor = event => {
        setData({ ...data, color: event.target.value });
    };

    const handleAddress = event => {
        setData({ ...data, address: event.target.value });
    };
    const handlePhone = event => {
        setData({ ...data, phone: event.target.value });
    };
    const handleDistrict = event => {
        setData({ ...data, district: event.target.value });
    };
    const handleSector = event => {
        setData({ ...data, sector: event.target.value });
    };
    const handleCell = event => {
        setData({ ...data, cell: event.target.value });
    };
    const handleVillage = event => {
        setData({ ...data, village: event.target.value });
    };

    const getTotal = () => {
        return products.reduce((currentValue, nextValue) => {
            return currentValue + nextValue.count * nextValue.price;
        }, 0);
    };

    const showCheckout = () => {
        return isAuthenticated() ? (
            <div>{showDropIn()}</div>
        ) : (
                <Link to="/signin">
                    <button id='btn-s' className="bTNs">Signin to checkout</button>
                </Link>
            );
    };

    let deliveryColor = data.color
    let deliveryAddress = data.address
    let phoneNumber = data.phone
    let deliveryDistrict = data.district
    let deliverySector = data.sector
    let deliveryCell = data.cell
    let deliveryVillage = data.village

    const buy = (e) => {
        e.preventDefault();
        setData({ loading: false });


        const createOrderData = {
            products: products,
            amount: getTotal(products),
            phone: phoneNumber,
            color: deliveryColor,
            district: deliveryDistrict,
            sector: deliverySector,
            cell: deliveryCell,
            village: deliveryVillage,
            address: deliveryAddress
        };
        if (!deliveryColor || !deliveryDistrict || !deliverySector || !deliveryCell || !deliveryVillage || !deliveryAddress) {
            // return alert('All fields are required')
            return toast.error('Please fill all fields');
        } else {
            toast.success('Thanks! Your Order Was Successful!')
        };
        createOrder(userId, token, createOrderData)
            .then(response => {
                emptyCart(() => {
                    setRun(!run); // run useEffect in parent Cart
                    console.log('Order success and empty cart');
                    setData({
                        loading: false,
                        success: true
                    });
                });
            })
            .catch(error => {
                console.log(error);
                setData({ loading: false });
            });

    };

    const showDropIn = () => (
        <div onBlur={() => setData({ ...data, error: '' })}>
            <ToastContainer />
            { products.length > 0 ? (
                <form className="deliveryInputs ">

                    <div className="deliverys mt-4">
                        <input onChange={handleColor} value={data.color} type="text" placeholder='Phone Color' />

                    </div>

                    <div className="deliverys mt-4">
                        <input onChange={handleDistrict} value={data.district} type="text" placeholder='District' />

                    </div>
                    <div className="deliverys mt-4">
                        <input onChange={handleSector} value={data.sector} type="text" placeholder='Sector' />

                    </div>
                    <div className="deliverys mt-4">
                        <input onChange={handleCell} value={data.cell} type="text" placeholder='Cell' />

                    </div>
                    <div className="deliverys mt-4">
                        <input onChange={handleVillage} value={data.village} type="text" placeholder='Village' />

                    </div>
                    <div className="deliverys mt-4">
                        <input onChange={handlePhone} value={data.phone} type="phone" placeholder='Phone' />

                    </div>

                    <div className="deliveryTextarea">

                        <label className="text-muted">Delivery address:</label>
                        <textarea
                            onChange={handleAddress}
                            className="form-control"
                            value={data.address}
                            placeholder="Type your delivery address here..."

                        />
                    </div>


                    <button onClick={buy} className="deliveryBtn mb-5">
                        Order Now
                    </button>
                </form>
            ) : null}
        </div>
    );



    const showSuccess = success => (
        <div className="alert alert-info" style={{ display: success ? '' : 'none' }}>
            Thanks! Your Order Was Successful!
        </div>
    );

    const showLoading = loading => loading && <h2 className="text-warning">Loading...</h2>;

    return (
        <div>
            <h2>Total: Rwf {getTotal()}</h2>
            {showSuccess(data.success)}

            {showCheckout()}
        </div>
    );
};

export default Checkout;