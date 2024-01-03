import React, { useState } from "react";
import { Container, Alert, Jumbotron, Nav, Tab, Row, Col, Table } from "react-bootstrap";
import { useQuery, useMutation } from "@apollo/client";
import { GET_REPORTS, GET_ACTIVITY_LOGS, GET_ALL_REFUNDS, GET_ALL_FUNDRAISERS, CREATE_ANALYTICS } from "../utils/queries";
import { Link } from "react-router-dom";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const AdministrationPage = () => {
  const [activeTab, setActiveTab] = useState("ActivityLog");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showAnalyticsSubmitted, setShowAnalyticsSubmitted] = useState(false);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const { loading: fundraisersLoading, error: fundraisersError, data: fundraisersData } = useQuery(GET_ALL_FUNDRAISERS);
  const [createAnalytics, { loading: createAnalyticsLoading, error: createAnalyticsError }] = useMutation(CREATE_ANALYTICS);
  const { loading: refundRequestsLoading, error: refundRequestsError, data: refundRequestsData } = useQuery(GET_ALL_REFUNDS);

  const calculateAnalyticsValues = () => {
    if (fundraisersData && fundraisersData.getAllFundRaisers) {
      let filteredFundraisers = fundraisersData.getAllFundRaisers;

      if (startDate && endDate) {
        filteredFundraisers = fundraisersData.getAllFundRaisers.filter(
          (fundraiser) =>
            new Date(fundraiser.createdAt) >= startDate &&
            new Date(fundraiser.createdAt) <= endDate
        );
      }

      const totalFundsRaised = filteredFundraisers.reduce(
        (total, fundraiser) =>
          total +
          fundraiser.contributions.reduce(
            (sum, contribution) => sum + contribution.contributedAmount,
            0
          ),
        0
      );

      const numberOfFundraisersCreated = filteredFundraisers.length;

      const totalContributions = filteredFundraisers.reduce(
        (total, fundraiser) => total + fundraiser.contributions.length,
        0
      );

      const averageDonationAmount = totalFundsRaised / totalContributions;

      const popularCategoriesTags = Array.from(
        new Set(
          filteredFundraisers.flatMap((fundraiser) => fundraiser.tags)
        )
      );

      const userActivityTrends = {
        signUps: 0,
        logins: 0,
        donations: totalContributions,
      };

      return {
        totalFundsRaised,
        numberOfFundraisersCreated,
        averageDonationAmount,
        popularCategoriesTags,
        userActivityTrends,
      };
    }

    return null;
  };

  const handleCreateAnalytics = async () => {
    try {
      const analyticsValues = calculateAnalyticsValues();
      const { data } = await createAnalytics({ variables: { analyticsInput: analyticsValues } });

      console.log("Analytics created successfully:", data.createAnalytics);
      setShowAnalyticsSubmitted(true);
    } catch (error) {
      console.error("Error creating analytics:", error);
    }
  };

  const analyticsValues = calculateAnalyticsValues();
  const { loading, error, data } = useQuery(GET_REPORTS);
  const { loading: activityLogsLoading, error: activityLogsError, data: activityLogsData } = useQuery(GET_ACTIVITY_LOGS);

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
                <Nav.Item>
                  <Nav.Link
                    eventKey="RefundReviews"
                    onSelect={() => handleTabChange("RefundReviews")}
                    style={{
                      color: "black",
                      backgroundColor:
                        activeTab === "RefundReviews" ? "#271951" : "",
                      borderColor: "#271951",
                    }}
                  >
                    Refund Reviews
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>
            <Col sm={9}>
              <Tab.Content>
                <Tab.Pane eventKey="ActivityLog">
                  <div className="section-container">
                    <h2>Activity Log</h2>
                    {activityLogsLoading && <p>Loading...</p>}
                    {activityLogsError && <p>Error: {activityLogsError.message}</p>}
                    {activityLogsData && activityLogsData.getActivityLogs && (
                      <Table striped bordered hover>
                        <thead>
                          <tr>
                            <th>User ID</th>
                            <th>Action Type</th>
                            <th>Timestamp</th>
                            <th>Description</th>
                            <th>IP Address</th>
                          </tr>
                        </thead>
                        <tbody>
                          {activityLogsData.getActivityLogs.map((log) => (
                            <tr key={log._id}>
                              <td>{log.userPerformingAction ? log.userPerformingAction._id : "Unknown User"}</td>
                              <td>{log.actionType}</td>
                              <td>{new Date(log.timestamp).toLocaleString()}</td>
                              <td>{log.description}</td>
                              <td>{log.ipAddress || "N/A"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    )}
                  </div>
                </Tab.Pane>
                <Tab.Pane eventKey="Analytics">
                  <div className="section-container">
                    <h2>Analytics</h2>
                    {analyticsValues && (
                      <div>
                        <p>Total Funds Raised: ${analyticsValues.totalFundsRaised}</p>
                        <p>Number of Fundraisers Created: {analyticsValues.numberOfFundraisersCreated}</p>
                        <p>Average Donation Amount: ${analyticsValues.averageDonationAmount.toFixed(2)}</p>
                        <p>Popular Categories/Tags: {analyticsValues.popularCategoriesTags.join(", ")}</p>
                        <p>User Activity Trends:</p>
                        <ul>
                          <li>Sign-Ups: {analyticsValues.userActivityTrends.signUps}</li>
                          <li>Logins: {analyticsValues.userActivityTrends.logins}</li>
                          <li>Donations: {analyticsValues.userActivityTrends.donations}</li>
                        </ul>
                        <div>
                          <h5>Generate report once a month! From 1st to the last day of the past month</h5>
                          <h6>The report must be submitted from 1st to the 3rd day of the NEW month!</h6>
                          <p>Select Start Date:</p>
                          <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
                        </div>
                        <div>
                          <p>Select End Date:</p>
                          <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} />
                        </div>
                        <div>
                          {startDate && endDate && (
                            <button onClick={handleCreateAnalytics} disabled={createAnalyticsLoading}>
                              Create Analytics
                            </button>
                          )}
                        </div>
                        <div>
                          {showAnalyticsSubmitted && (
                            <Alert
                              dismissible
                              variant="success"
                              onClose={() => setShowAnalyticsSubmitted(false)}
                            >
                              Analytics sent successfully!
                            </Alert>
                          )}
                        </div>
                        {createAnalyticsError && <p>Error creating analytics: {createAnalyticsError.message}</p>}
                      </div>
                    )}
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
                            <th>Fundraiser</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.getReports.map((report) => (
                            <tr key={report._id}>
                              <td>{report.reporter}</td>
                              <td>{report.description}</td>
                              <td>{report.status}</td>
                              <td>{new Date(parseInt(report.dateSubmitted)).toLocaleString()}</td>
                              <td><Link to={"/fundraiser/" + report.fundraiserOrContributionID}>View Fundraiser</Link></td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    )}
                  </div>
                </Tab.Pane>
                <Tab.Pane eventKey="RefundReviews">
                  <div className="section-container">
                    <h2>Refund Reviews</h2>
                    {refundRequestsLoading && <p>Loading...</p>}
                    {refundRequestsError && <p>Error: {refundRequestsError.message}</p>}
                    {refundRequestsData && refundRequestsData.getAllDonationRefundRequests && (
                      <Table striped bordered hover>
                        <thead>
                          <tr>
                            <th>User Requesting Refund</th>
                            <th>Contribution ID</th>
                            <th>Fundraiser ID</th>
                            <th>Reason for Refund</th>
                            <th>Status</th>
                            <th>Administrator Comments</th>
                            <th>Date Requested</th>
                          </tr>
                        </thead>
                        <tbody>
                          {refundRequestsData.getAllDonationRefundRequests.map((refund) => (
                            <tr key={refund._id}>
                              <td>{refund.userRequestingRefund}</td>
                              <td>{refund.contributionID}</td>
                              <td>{refund.fundraiserID}</td>
                              <td>{refund.reasonForRefund}</td>
                              <td>{refund.status}</td>
                              <td>{refund.administratorComments || "N/A"}</td>
                              <td>{new Date(refund.dateRequested).toLocaleString()}</td>
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
