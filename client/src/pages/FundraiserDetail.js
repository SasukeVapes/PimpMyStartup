import { useParams } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Alert,
  Jumbotron,
} from "react-bootstrap";

import { GET_FUNDRAISER_BY_ID } from "../utils/queries";
import { useQuery, useMutation } from "@apollo/client";
import { useState } from "react";
import { ADD_CONTRIBUTION, SUBMIT_REPORT, REQUEST_DONATION_REFUND } from "../utils/mutations";
import Auth from "../utils/auth";

const FundraiserDetail = () => {
  const { id } = useParams();

  const [contributionFormData, setContributionFormData] = useState({
    amount: 0,
    creditCardNumber: "",
    creditCardName: "",
    creditCardExpirationMonth: "",
    creditCardExpirationYear: "",
    creditCardCvv: "",
  });

  const [donated, setDonated] = useState(false);

  const { loading, error, data } = useQuery(GET_FUNDRAISER_BY_ID, {
    variables: { fundraiserId: id },
  });

  const [addContribution, addContributionResp] = useMutation(ADD_CONTRIBUTION);
  const [submitReport, submitReportResp] = useMutation(SUBMIT_REPORT);
  const [requestDonationRefund, { loading: refundLoading, error: refundError }] = useMutation(REQUEST_DONATION_REFUND);

  const [showReportForm, setShowReportForm] = useState(false);
  const [reportDescription, setReportDescription] = useState("");
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [showRefundForm, setShowRefundForm] = useState(false);
const [refundDetails, setRefundDetails] = useState({});

  const handleInputChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setContributionFormData({ ...contributionFormData, [name]: value });
  };
  
  const handleRefundRequest = (contributionId) => {
    setRefundDetails({
      contributionId: contributionId,
    });
    console.log(contributionId);
    setShowRefundForm(true);
  };
  const handleRefundSubmit = async (refundDetails) => {
    try {
      
      if (!refundDetails.contributionId) {
        console.error("Contribution ID is missing in refundDetails");
        return;
      }
      const { data } = await requestDonationRefund({
        variables: {
          donationRefundRequestInput: {
            userRequestingRefund: Auth.getProfile().data._id,
            contributionID: refundDetails.contributionId,
            fundraiserID: id,
            reasonForRefund: refundDetails.reason,
          },
        },
      });
  
      // Handle success 
      console.log("Refund request submitted successfully:", data);
  
      setShowRefundForm(false);
    } catch (error) {
      console.error("Error requesting refund:", error.message);
      // Handle error 
    }
  };
  const handleContributionSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await addContribution({
        variables: {
          contributorUsername: Auth.getProfile().data.username,
          fundraiserId: id,
          contributedAmount: parseFloat(contributionFormData.amount),
          card: {
            cvv: contributionFormData.creditCardCvv,
            expirationMonth: contributionFormData.creditCardExpirationMonth,
            expirationYear: contributionFormData.creditCardExpirationYear,
            name: contributionFormData.creditCardName,
            number: contributionFormData.creditCardNumber,
          },
        },
      });
      setContributionFormData({
        amount: 0,
        creditCardNumber: "",
        creditCardName: "",
        creditCardExpirationMonth: "",
        creditCardExpirationYear: "",
        creditCardCvv: "",
      });
      setDonated(true);
    } catch (err) {
      console.error("Error creating contribution", err);
    }
  };

  const handleReportSubmit = async () => {
    try {
      const { data } = await submitReport({
        variables: {
          reportInput: {
            reporter: Auth.getProfile().data._id,
            description: reportDescription,
            fundraiserOrContributionID: id,
          },
        },
      });

      console.log("Submitted report:", data.submitReport);
      setReportSubmitted(true);
      setReportDescription(""); // Clear the description after submission
    } catch (error) {
      console.error("Error submitting report:", error.message);
    }
  };

  if (loading) {
    return <h1>Still loading</h1>;
  }
  let fundraiserData = data.getFundraiserById;

  return (
    <>
      <Jumbotron fluid className="text-light page-header">
        <Container>
          <h1>{fundraiserData.title}</h1>
        </Container>
      </Jumbotron>
      <Container>
        <Row>
          <Col xs={4}>
            <img
              width={350}
              src={fundraiserData.image}
              alt={fundraiserData.title}
            />
            <br />
            <br />
            <br />
            <h5>Contributions</h5>
            <div className="contributions">
            {fundraiserData.contributions.map((contribution) => {
              const contributionId = contribution._id;
             const isCurrentUserContributor = Auth.loggedIn() && contribution.contributorUsername === Auth.getProfile().data.username;

             return (
              <div className="contribution-detail">
                {contribution.contributedAt}
                <br />
                <strong>{contribution.contributorUsername}</strong> donated ${contribution.contributedAmount} 
                
                {isCurrentUserContributor && (
                  <>
                    <Button variant="danger" onClick={() => handleRefundRequest(contributionId)}>
                      Refund
                    </Button>
                    {showRefundForm && (
                      <div>
                        <h2>Refund Request Form</h2>
                        <Form>
                          <Form.Group>
                            <Form.Label>Reason for Refund</Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={3}
                              placeholder="Enter the reason for the refund..."
                              value={refundDetails.reason}
                              onChange={(e) => setRefundDetails({ ...refundDetails, reason: e.target.value })}
                            />
                          </Form.Group>
                          <Button variant="primary" onClick={() => handleRefundSubmit(refundDetails)}>
                            Submit Refund Request
                          </Button>
                        </Form>
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
          </div>
          </Col>
          <Col xs={8}>
            <div className="form">
              Created by <strong>{fundraiserData.posterUsername}</strong> on{" "}
              <em>{fundraiserData.createdAt}</em>
            </div>
            <p>{fundraiserData.description}</p>
          </Col>
        </Row>
        
        {Auth.loggedIn() && (
  <Button onClick={() => setShowReportForm(true)}>Report</Button>)}
          {/* Report Form */}
          {showReportForm && (
            <div>
              <Form>
                <Form.Group>
                  <Form.Label>Description:</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={reportDescription}
                    onChange={(e) => setReportDescription(e.target.value)}
                  />
                </Form.Group>
                {reportSubmitted && (
                  <Alert
                    dismissible
                    variant="success"
                    onClose={() => setReportSubmitted(false)}
                  >
                    Report submitted successfully!
                  </Alert>
                )}
                {submitReportResp &&
                  submitReportResp.error &&
                  submitReportResp.error.message && (
                    <Alert dismissible variant="danger">
                      {submitReportResp.error.message}
                    </Alert>
                  )}
                <Button type="button" onClick={handleReportSubmit}>
                  Submit Report
                </Button>
              </Form>
            </div>
          )}
        <div className="form">
          {!Auth.loggedIn() && (
            <h3>Please login to contribute to this cause!</h3>
          )}
          {Auth.loggedIn() && (
            <>
              <h3>Contribute to this cause!</h3>
              

              {/* Contribution Form */}
              {donated && (
                <Alert
                  dismissible
                  variant="success"
                  onClose={() => {
                    setDonated(false);
                  }}
                >
                  Thank you for your contribution!
                </Alert>
              )}
              {addContributionResp &&
                addContributionResp.error &&
                addContributionResp.error.message && (
                  <Alert dismissible variant="danger">
                    {addContributionResp.error.message}
                  </Alert>
                )}
              <Form onSubmit={handleContributionSubmit}>
                <Row>
                  <Col xs={5}>
                    <Form.Group>
                      <Form.Label htmlFor="creditCardName">
                        Name on Card
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Name on card"
                        name="creditCardName"
                        onChange={handleInputChange}
                        required
                        value={contributionFormData.creditCardName}
                      />
                      <Form.Control.Feedback type="invalid">
                        Name is required.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col xs={2}>
                    <Form.Group>
                      <Form.Label htmlFor="amount">Donation amount</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder=""
                        name="amount"
                        onChange={handleInputChange}
                        required
                        width={31}
                        value={contributionFormData.amount}
                      />
                      <Form.Control.Feedback type="invalid">
                        Amount is required.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col xs={5}>
                    <Form.Group>
                      <Form.Label htmlFor="creditCardNumber">
                        Number on Card
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder=""
                        name="creditCardNumber"
                        onChange={handleInputChange}
                        required
                        value={contributionFormData.creditCardNumber}
                      />
                      <Form.Control.Feedback type="invalid">
                        Number is required.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label htmlFor="creditCardExpirationMonth">
                        Expiration month on Card
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="mm"
                        name="creditCardExpirationMonth"
                        onChange={handleInputChange}
                        required
                        value={contributionFormData.creditCardExpirationMonth}
                      />
                      <Form.Control.Feedback type="invalid">
                        Expiration Month is required.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group>
                      <Form.Label htmlFor="creditCardExpirationYear">
                        Expiration Year on Card
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="mm"
                        name="creditCardExpirationYear"
                        onChange={handleInputChange}
                        required
                        value={contributionFormData.creditCardExpirationYear}
                      />
                      <Form.Control.Feedback type="invalid">
                        Expiration Year is required.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group>
                      <Form.Label htmlFor="creditCardCvv">Cvv number</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder=""
                        name="creditCardCvv"
                        onChange={handleInputChange}
                        required
                        value={contributionFormData.creditCardCvv}
                      />
                      <Form.Control.Feedback type="invalid">
                        CVV is required.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Button type="submit" variant="success" className="paymentBtn">
                  Submit
                </Button>
              </Form>
            </>
          )}
        </div>
      </Container>
    </>
  );
};

export default FundraiserDetail;
