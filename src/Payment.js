import React, {  useEffect, useState } from 'react';
import './Payment.css';
import { useStateValue } from './StateProvider';
import CheckoutProduct from './CheckoutProduct';
import { Link, useNavigate } from "react-router-dom";
import { CardElement,useStripe,useElements } from '@stripe/react-stripe-js';
import CurrencyFormat from 'react-currency-format';
import { getBasketTotal } from './reducer';
import axios from "./axios";
import { db } from "./firebase";


function Payment() {
    const [{basket, user}, dispatch] = useStateValue();
    const navigate = useNavigate();

    const stripe = useStripe();
    const elements = useElements();

    return (
        <form>
          {/* Enable visibility on page load for CardElement */}
          <CardElement options={{ hidePostalCode: true }} />
    
        </form>
      );
    
    // const [currentstate, function to update the state] = useState("Initial State")
    const [processing, setProcessing] = useState("");
    const [succeeded, setSucceeded] = useState(false);
    const [error, setError] = useState(null);
    const [disabled, setDisable] = useState(true); 
    const [clientSecret, setClientSecret] = useState(true);
    // useEffect({function},[dependancy])

    useEffect(() => {
        //generate special stripe secret which allows you to charge a customer
        const getClientSecret = async () => {
            const response = await axios({
                method: 'post',
                // Stripe expects the total in a currencies subunits like dollar in cents
                url: `/payments/create?total=${getBasketTotal(basket) * 100}` // *100 to get subunits
        });
        setClientSecret(response.data.clientSecret)
    }
        getClientSecret();
 }, [basket])

console.log("THE SECRET IS >>>>", clientSecret)
console.log('👱', user)

    const handleSubmit = async (event) => {
        // fancy stripe stuff
        event.preventDefault();
        setProcessing(true);   // u click once and it gets blocked
        
        const payload = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement)
            }
        }).then(({ paymentIntent }) => {
            //paymentIntent = payment confirmation

            db
              .collection('users')
              .doc(user?.uid)
              .collection('orders')
              .doc(paymentIntent.id)
              .set({
                basket: basket,
                amount: paymentIntent.amount,
                created: paymentIntent.created
              });

            setSucceeded(true);
            setError(null);
            setProcessing(false);

            dispatch({
                type: 'EMPTY_BASKET'
            })


            navigate('/orders', { replace: true });

        })

    }
    const handleChange = (event) => {
        // Listen for changes in the CardElement
        // and display any errors as the customer types their card details
        setDisable(event.empty);
        setError(event.error?event.error.message : "")
    }
  return (
    <div className='payment'>
        <div className='payment__container'>
            <h1>
                Checkout(
                    <Link to="/checkout">{basket?.length} items</Link>
                    )
            </h1>
            {/* Payment section - delivery address */}
        <div className='payment__section'>
            <div className='payment__title'>
                <h3>Delivery Address</h3>
            </div>
            <div className='payment__address'>
                <p>{user?.email}</p>
                <p>123 React Lane</p>
                <p>Los Angeles, CA</p>
            </div>
        </div>
             {/* Payment section - Review Items */}
            <div className='payment__section'>
                <div className='payment__title'>
                        <h3>Review items and delivery</h3>
                </div>
                    <div className='payment__items'>
                    {basket.map(item => (
                         <CheckoutProduct
                            id = {item.id}
                            title={item.title}
                            image={item.image}
                            price={item.price}
                            rating={item.rating}
                        />
                    ))}
                </div>
            </div>
            {/* Payment section - Payment method */}
            <div className='payment__section'>
            <div className="payment__title">
                <h3>Payment Method</h3>
                </div>
                <div className="payment__details">
                    {/* stripe magic*/}
                    <form onSubmit={handleSubmit}>
                        <CardElement onChange={handleChange}/> 

                      <div className='payment__priceContainer'>
                      <CurrencyFormat
                        renderText={(value) => (
                            <h3>Order Total: {value}</h3>
                        )}
                        decimalScale={2}
                        value={getBasketTotal(basket)}
                        displayType={"text"}
                        thousandSeparator={true}
                        prefix={"$"}
                     />
                     <button disabled={processing || disabled || succeeded}>
                        <span>{processing ? <p>Processing</p>:"Buy Now"} </span>
                     </button>
                        </div> 
                        {/* Error */}
                        {error && <div>{error}</div>}
                    </form>


                     
                </div>
            </div>      
        </div>
    </div>
    )
}

export default Payment;
