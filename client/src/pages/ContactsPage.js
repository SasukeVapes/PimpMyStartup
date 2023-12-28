import React from "react";
import { Container, Row, Col, Jumbotron } from "react-bootstrap";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
const ContactsPage = () => {
    const position = [51.110428, 17.032675];
    
  return (
    <>
      <Jumbotron fluid className="text-light page-header">
        <Container>
          <h1>Contact Us</h1>
        </Container>
      </Jumbotron>
      <Container>
      <MapContainer center={position} zoom={18} style={{ height: "400px", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={position}>
            <Popup>
            Głogowska 31, Poznań, Poland
            </Popup>
        </Marker>
     </MapContainer>
        <p>
          For general inquiries, you can reach our contact center at{" "}
          <strong>+423949824293</strong>.
        </p>
        <p>
          If you need to contact our office representative, you can call{" "}
          <strong>+4784394394934</strong> or email{" "}
          <strong>PimpingSince1996@gmail.com</strong>.
        </p>
        <p>
          For business inquiries, please email us at{" "}
          <strong>businessenquiries@gmail.com</strong>.
        </p>
        <p>
          Our main office is located at Głogowska 31, Poznań, Poland.
        </p>
        <div>
          <h2>Developer Roles</h2>
          <Row>
            <Col>
              <h3>Middle Node.js Developer</h3>
              <p>Skills:</p>
              <ul>
                <li>Node.js</li>
                <li>Express</li>
                <li>Apollo</li>
                <li>GraphQL</li>
              </ul>
            </Col>
            <Col>
              <h3>Senior .NET Developer</h3>
              <p>Skills:</p>
              <ul>
                <li>ASP.NET</li>
                <li>Kafka</li>
                <li>RabbitMQ</li>
                <li>MassTransit</li>
                <li>FluentValidation</li>
                <li>Redis</li>
                {/* Add more skills as needed */}
              </ul>
            </Col>
            {/* Add more roles as needed */}
          </Row>
        </div>
        <div>
          <h2>Developer Roles</h2>
          <p>
            For developer roles, you can send your resume to{" "}
            <strong>hiringpimps@gmail.com</strong>.
          </p>
        </div>
      </Container>
    </>
  );
};

export default ContactsPage;
