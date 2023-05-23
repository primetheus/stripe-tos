import React, { useState } from "react";
import { Alert, Button, Card, Col, Form, Row } from "react-bootstrap";
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

const StatusMessage = (message, variant) => {
  return (
    <>
      <Alert variant={variant}>{message}</Alert>
    </>
  );
};

function App() {
  const [message, setMessage] = useState("");
  const [variant, setVariant] = useState("");
  const [formData, setFormData] = useState({
    connectAccountId: "",
    secretKey: "",
    termsOfService: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Please wait...");
    setVariant("");
    // Load the Stripe library
    const stripe = require("stripe")(formData.secretKey);
    if (!stripe) return;

    const userIp = await GetIPAddress();
    const acceptanceDate = Math.floor(Date.now() / 1000);

    const payload = {
      tos_acceptance: {
        date: acceptanceDate,
        ip: userIp,
        user_agent: sUsrAg,
      },
      settings: {
        card_issuing: {
          tos_acceptance: {
            date: acceptanceDate,
            ip: userIp,
            user_agent: sUsrAg,
          },
        },
      },
    };

    await stripe.accounts
      .update(formData.connectAccountId, payload)
      .then((account) => {
        setMessage("Success!");
        setVariant("success");
        console.log(account.lastResponse);
      })
      .catch((err) => {
        setMessage(err.message);
        setVariant("danger");
        console.log(err.message);
      });
  };

  return (
    <>
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
                  placeholder="acct_1..."
                  name="connectAccountId"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      [e.target.name]: e.target.value,
                    })
                  }
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="secretKey">
                <Form.Label>Secret Key</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="sk_live_"
                  name="secretKey"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      [e.target.name]: e.target.value,
                    })
                  }
                  required
                />
                <Form.Text className="text-muted">
                  This form does not save any information!
                </Form.Text>
              </Form.Group>
              <Form.Group className="mb-3" controlId="termsOfService">
                <Form.Check
                  type="checkbox"
                  name="termsOfService"
                  label="User accepts Stripe's Terms of Service and Privacy Policy"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      [e.target.name]: e.target.checked,
                    })
                  }
                  required
                />
              </Form.Group>
              <Button
                style={{ backgroundColor: "#635BFF" }}
                disabled={
                  !formData.secretKey ||
                  !formData.connectAccountId ||
                  !formData.termsOfService
                }
                onClick={(e) => handleSubmit(e)}
              >
                Submit
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>

      {message && (
        <Row>
          <Col sm="6" className="mx-auto w-75 mt-3">
            {StatusMessage(message, variant)}
          </Col>
        </Row>
      )}
    </>
  );
}

export default App;
