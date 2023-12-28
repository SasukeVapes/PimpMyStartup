import React from "react";
import { Container, Jumbotron, Accordion, Card } from "react-bootstrap";

const QAPage = () => {
  return (
    <>
      <Jumbotron fluid className="text-light page-header">
        <Container>
          <h1>Q&A</h1>
        </Container>
      </Jumbotron>
      <Container>
        <Accordion>
          {/* Question 1 */}
          <Card>
            <Accordion.Toggle as={Card.Header} eventKey="0">
              What is PimpMyStartup?
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="0">
              <Card.Body>
                PimpMyStartup is a crowdfunding platform that helps businesses
                raise funds for their projects and ideas. We connect
                entrepreneurs with potential investors, allowing them to
                showcase their initiatives and receive financial support.
              </Card.Body>
            </Accordion.Collapse>
          </Card>

          {/* Question 2 */}
          <Card>
            <Accordion.Toggle as={Card.Header} eventKey="1">
              How can I start a fundraiser on PimpMyStartup?
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="1">
              <Card.Body>
                To start a fundraiser, you need to create an account on
                PimpMyStartup. Once logged in, you can navigate to the "Create
                Fundraiser" section, where you'll provide details about your
                project, funding goal, and other relevant information.
              </Card.Body>
            </Accordion.Collapse>
          </Card>

          {/* Question 3 */}
          <Card>
            <Accordion.Toggle as={Card.Header} eventKey="2">
              How does the contribution process work?
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="2">
              <Card.Body>
                Contributors can browse through the available fundraisers on
                PimpMyStartup and choose the projects they want to support. They
                can make contributions using various payment methods, and their
                contributions will be reflected on the respective fundraiser
                pages.
              </Card.Body>
            </Accordion.Collapse>
          </Card>

          {/* Question 4 */}
          <Card>
            <Accordion.Toggle as={Card.Header} eventKey="3">
              Do you verify the legitimacy of a Startup?
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="3">
              <Card.Body>
                Of course. We thoroughly do background checks, request all the appropriate documentation,
                Imagery, and other sources. We do understand that in our modern landscape there's always
                a place for fraudulent behavior.
                We regularly check for illegitimate activity and you can directly contribute and help with neutralizing
                dishonest fundraisers by reporting them to our team.
              </Card.Body>
            </Accordion.Collapse>
          </Card>

          {/* Question 5 */}
          <Card>
            <Accordion.Toggle as={Card.Header} eventKey="4">
              How can I report suspicious Fundraiser?
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="4">
              <Card.Body>
                You can click the report button under the fundraiser and write a message, describing
                what kind of suspicious activities you noticed and information you are aware of about
                the fundraiser or it's author. We always review all reports and they get sorted out in
                10 to 15 business days.
              </Card.Body>
            </Accordion.Collapse>
          </Card>

        </Accordion>
      </Container>
    </>
  );
};

export default QAPage;