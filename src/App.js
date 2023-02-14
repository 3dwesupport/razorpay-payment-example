import './App.css';
import {Button, Container, createTheme, TextField, ThemeProvider} from "@mui/material";
import React, {useState} from "react";


const theme = createTheme();

function App() {
    const [orderId, setOrderId] = useState('');
    const [razorpayId, setRazorpayId] = useState('');
    return (
        <ThemeProvider theme={theme}>
            <Container>
                <div className="App">
                    <div className="heading">Payment Gateway For Razorpay Orders</div>
                    <div className="form">
                        <div className="textInput">
                            <TextField id="outlined-basic" label="Razorpay Id" variant="outlined" value={razorpayId}
                                       onChange={e => setRazorpayId(e.target.value)}/>
                        </div>
                        <div className="textInput">
                            <TextField id="outlined-basic" label="Order Id" variant="outlined" value={orderId}
                                       onChange={e => setOrderId(e.target.value)}/>
                        </div>
                        <Button onClick={() => displayRazorpay(razorpayId, orderId)} className="button">Submit</Button>
                    </div>
                </div>
            </Container>
        </ThemeProvider>

    );
}

function loadScript(src) {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = () => {
            resolve(true);
        };
        script.onerror = () => {
            resolve(false);
        };
        document.body.appendChild(script);
    });
}

async function displayRazorpay(razorpayId, orderId) {
    const res = await loadScript(
        "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
        alert("Razorpay SDK failed to load. Are you online?");
        return;
    }

    const options = {
        key: razorpayId, // Enter the Key ID generated from the Dashboard
        description: "Test Transaction",
        order_id: orderId,
        handler: async function (response) {
            const data = {
                orderCreationId: orderId,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
            };
            console.log(data);
        }
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
}

export default App;
