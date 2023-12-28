import React, { useState } from "react";
import { Container, Jumbotron, Nav, Tab, Row, Col, Table } from "react-bootstrap";
import { useQuery } from "@apollo/client";
import { GET_REPORTS } from "../utils/queries"; 

const AdministrationPage = () => {
  const [activeTab, setActiveTab] = useState("ActivityLog");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Fetch reports using the useQuery hook
  const { loading, error, data } = useQuery(GET_REPORTS);

  return (
    <>
      <Jumbotron fluid className="text-light page-header">
        <Container>
          <h1>Administration Page</h1>
        </Container>
      </Jumbotron>
      <Container>
        <Tab.Container activeKey={activeTab}>
          <Row>
            <Col sm={3}>
              <Nav variant="pills" className="flex-column">
                <Nav.Item>
                  <Nav.Link
                    eventKey="ActivityLog"
                    onSelect={() => handleTabChange("ActivityLog")}
                    style={{
                      color: "black",
                      backgroundColor:
                        activeTab === "ActivityLog" ? "#271951" : "",
                      borderColor: "#271951",
                    }}
                  >
                    Activity Log
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    eventKey="Analytics"
                    onSelect={() => handleTabChange("Analytics")}
                    style={{
                      color: "black",
                      backgroundColor:
                        activeTab === "Analytics" ? "#271951" : "",
                      borderColor: "#271951",
                    }}
                  >
                    Analytics
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    eventKey="Reports"
                    onSelect={() => handleTabChange("Reports")}
                    style={{
                      color: "black",
                      backgroundColor: activeTab === "Reports" ? "#271951" : "",
                      borderColor: "#271951",
                    }}
                  >
                    Reports
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>
            <Col sm={9}>
              <Tab.Content>
                <Tab.Pane eventKey="ActivityLog">
                  <div className="section-container">
                    <h2>Activity Log</h2>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Curabitur suscipit, lectus vel efficitur laoreet, dolor
                      mauris imperdiet nulla, nec vestibulum purus lectus id
                      lacus.
                    </p>
                  </div>
                </Tab.Pane>
                <Tab.Pane eventKey="Analytics">
                  <div className="section-container">
                    <h2>Analytics</h2>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Curabitur suscipit, lectus vel efficitur laoreet, dolor
                      mauris imperdiet nulla, nec vestibulum purus lectus id
                      lacus.
                    </p>
                  </div>
                </Tab.Pane>
                <Tab.Pane eventKey="Reports">
                  <div className="section-container">
                    <h2>Reports</h2>
                    {loading && <p>Loading...</p>}
                    {error && <p>Error: {error.message}</p>}
                    {data && data.getReports && (
                      <Table striped bordered hover>
                        <thead>
                          <tr>
                            <th>Reporter</th>
                            <th>Description</th>
                            <th>Status</th>
                            <th>Date Submitted</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.getReports.map((report) => (
                            <tr key={report._id}>
                              <td>{report.reporter}</td>
                              <td>{report.description}</td>
                              <td>{report.status}</td>
                              <td>{new Date(parseInt(report.dateSubmitted)).toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    )}
                  </div>
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </Container>
    </>
  );
};

export default AdministrationPage;
