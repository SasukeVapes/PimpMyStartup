import React from "react";
import { Container, Jumbotron, Card, Row, Col } from "react-bootstrap";

const SuccessStoriesPage = () => {
  const successStories = [
    {
      name: "Rajid Abjumekov",
      image: "https://cdn.britannica.com/45/223045-050-A6453D5D/Telsa-CEO-Elon-Musk-2014.jpg",
      story: "In Silicon Valley, Rajid Abjumekovs journey from struggling entrepreneur to multibillionaire began with PimpMyStartup, his innovative crowdfunding platform. Facing initial skepticism, Rajid's unique Founders Vault feature set the platform apart. Using PimpMyStartup, he successfully raised funds for his own groundbreaking project, sparking a surge in the platform's popularity. As Rajid's startup flourished, so did PimpMyStartup, becoming synonymous with success in the startup world. Rajid's story, marked by perseverance and innovation, inspired entrepreneurs globally, showcasing the transformative power of seizing opportunities.",
    },
    {
      name: "Ben Brut",
      image: "https://upload.wikimedia.org/wikipedia/commons/e/e9/Official_portrait_of_Barack_Obama.jpg",
      story: "In the lively backdrop of 1980, Ben Brut made history as the first African American to achieve success on PimpMyStartup, a revolutionary crowdfunding platform. Armed with an unwavering vision, Ben introduced innovative concepts to the fundraising scene. His unique campaign on PimpMyStartup not only propelled his own venture but also paved the way for aspiring entrepreneurs of color. In an era marked by challenges and limited opportunities for minorities, Ben's triumph on PimpMyStartup shattered barriers. His story became a beacon of inspiration, showcasing that determination, innovation, and resilience could overcome any obstacle. As the first African American to thrive in the world of fundraising, Ben Brut left an indelible mark on the entrepreneurial landscape of 1980, opening doors for a more diverse and inclusive future.",
    },
    {
      name: "Kenny East",
      image: "https://i0.wp.com/culturalhistoryoftheinternet.com/wp-content/uploads/2020/11/cover2-1.jpg?resize=810%2C580&ssl=1",
      story: "Famous ship owner Kenny East made a fortune after his startup 'DeFund the Jews' made it to top 5 on PimpMyStartup, making him the youngest African-American to spit fax",
    },
  ];

  return (
    <>
      <Jumbotron fluid className="text-light page-header">
        <Container>
          <h1 className="hover-scale">Success Stories</h1>
        </Container>
      </Jumbotron>
      <Container>
        <Row>
          {successStories.map((story, index) => (
            <Col key={index} md={4} className="mb-4">
              <div className="hover-scale">
                <Card>
                  <div className="fade-in">
                    <Card.Img
                      variant="top"
                      src={story.image}
                      alt={`${story.name}'s image`}
                    />
                  </div>
                  <Card.Body>
                    <Card.Title>{story.name}</Card.Title>
                    <Card.Text>{story.story}</Card.Text>
                  </Card.Body>
                </Card>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
};

export default SuccessStoriesPage;