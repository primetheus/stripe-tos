import React, { useState } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import {loadStripe} from '@stripe/stripe-js';
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "./logo.svg";
import "./App.css";
var sUsrAg = navigator.userAgent;

/**
 * Lookup the IP address of the user
 * @returns The IP address of the user
 */
const GetIPAddress = async () => {
  const response = await fetch("https://api.seeip.org/jsonip");
  const data = await response.json();
  return data.ip;
};

function App() {
  console.log(sUsrAg);
  GetIPAddress().then((ip) => {
    console.log(ip);
  });

  const [formData, setFormData] = useState({
    connectAccountId: "",
    publishableKey: "",
    secretKey: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    const stripe = loadStripe('pk_test_51KeQbeBb7TlDnEKpn0eU2rkJatF99JNq9aLUQrLcIBFhN03TSakmyeFx3QqjZGrRQ6YNvHC02SKZaZBzR1JFKk2M00x0t8UYi5');
    if (!stripe) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }
  };

  return (
    <Row>
      <Col sm="6" className="mx-auto w-75 mt-5">
        <Card body>
          <Card.Title tag="h5">Stripe Terms of Service</Card.Title>
          <Card.Text></Card.Text>
          <Form>
            <Form.Group className="mb-3" controlId="connectAccountId">
              <Form.Label>Connect Account ID</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Connect Account ID"
              />
              <Form.Text
                className="text-muted"
                name="connectAccountId"
                onChange={(e) =>
                  setFormData({ ...formData, [e.target.name]: e.target.value })
                }
              >
                This form does not save any information!
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" controlId="publishableKey">
              <Form.Label>Publishable Key</Form.Label>
              <Form.Control
                type="text"
                placeholder="pk_live_"
              />
              <Form.Text
                className="text-muted"
                name="publishableKey"
                onChange={(e) =>
                  setFormData({ ...formData, [e.target.name]: e.target.value })
                }
              >
                This form does not save any information!
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" controlId="secretKey">
              <Form.Label>Secret Key</Form.Label>
              <Form.Control
                type="password"
                placeholder="sk_live_"
                name="secretKey"
                onChange={(e) =>
                  setFormData({ ...formData, [e.target.name]: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCheckbox">
              <Form.Check
                type="checkbox"
                label="User accepts Stripe's Terms of Service and Privacy Policy"
              />
            </Form.Group>
            <Button 
              style={{ backgroundColor: "#635BFF" }}  
              onClick={(e) => handleSubmit(e)}>
              Submit
            </Button>
          </Form>
        </Card>
      </Col>
    </Row>
  );
}

{
  /*
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  */
}

export default App;
