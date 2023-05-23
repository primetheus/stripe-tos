import React, { useState } from "react";
import { Alert, Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "./logo-light.svg";
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
  const [validated, setValidated] = useState(false);
  const [message, setMessage] = useState("");
  const [variant, setVariant] = useState("");
  const [formData, setFormData] = useState({
    connectAccountId: "",
    secretKey: "",
    termsOfService: false,
  });

  const handleSubmit = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      setValidated(true);
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
    }
    setValidated(true);
  };

  return (
    <>
    <Container>
      <Row>
        <Col md={{ span: 4, offset: 4 }} className="mt-5">
          <Card body>
            <Card.Header><img src={logo} alt="logo" /></Card.Header>
            <Card.Text></Card.Text>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="connectAccountId">
                <Form.Label>Connect Account ID</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="acct_1..."
                  name="connectAccountId"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      [e.target.name]: e.target.value,
                    })
                  }
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a valid Connect Account ID.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3" controlId="secretKey">
                <Form.Label>Secret Key</Form.Label>
                <Form.Control
                  required
                  type="password"
                  placeholder="sk_live_"
                  name="secretKey"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      [e.target.name]: e.target.value,
                    })
                  }
                />
                <Form.Text className="text-muted">
                  This form does not save any information!
                </Form.Text>
                <Form.Control.Feedback type="invalid">
                  Please provide a valid API secret key.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3" controlId="termsOfService">
                <Form.Check
                  required
                  type="checkbox"
                  name="termsOfService"
                  label={`User accepts Stripe's Terms of Service and Privacy Policy`}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      [e.target.name]: e.target.checked,
                    })
                  }
                />
                <Form.Control.Feedback type="invalid">
                  You must accept the terms of service and privacy policy to
                  continue.
                </Form.Control.Feedback>
              </Form.Group>
              <Button
                style={{ backgroundColor: "#635BFF" }}
                type="submit"
                //</Form>disabled={
                //  !formData.secretKey ||
                //  !formData.connectAccountId ||
                //  !formData.termsOfService
                //}
                //onClick={(e) => handleSubmit(e)}
              >
                Submit
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>

      {message && (
        <Row>
          <Col md={{ span: 4, offset: 4 }} className="mt-3">
            {StatusMessage(message, variant)}
          </Col>
        </Row>
      )}
      </Container>
    </>
  );
}

export default App;
