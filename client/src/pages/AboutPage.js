import React from "react";
import { Jumbotron, Container } from "react-bootstrap";

const AboutPage = () => {
  return (
    <>
      <Jumbotron fluid className="text-light page-header">
        <Container>
          <h1>About PimpMyStartup</h1>
        </Container>
      </Jumbotron>

      <Container>
        <h2>Introduction to Crowdfunding</h2>
        <p>
          Crowdfunding is a revolutionary way for individuals and businesses to
          raise funds by reaching out to a large number of people, often
          through online platforms. It has transformed the traditional funding
          landscape, allowing innovative ideas and projects to come to life
          with the support of a diverse community of backers.
        </p>

        <h2>PimpMyStartup: Empowering Dreams, Transforming Lives</h2>
        <p>
          PimpMyStartup is a dynamic crowdfunding platform committed to
          empowering entrepreneurs and businesses to turn their visions into
          reality. Our mission is to provide a space where creators can
          showcase their projects and connect with backers who share their
          passion for innovation and positive change.
        </p>

        <h2>Meet George Korennoy: The Visionary CEO</h2>
        <p>
          At the helm of PimpMyStartup is our visionary CEO, George Korennoy.
          Known for his unwavering commitment to supporting startups and
          fostering a culture of creativity, George is a driving force behind
          our platform's success. His leadership inspires our team to go above
          and beyond in assisting businesses in their fundraising journey.
        </p>

        <h2>How We Make a Difference</h2>
        <p>
          PimpMyStartup has been instrumental in helping businesses from diverse
          backgrounds raise the funds they need to thrive. We take pride in our
          global reach, having supported initiatives in India and Africa,
          contributing to positive change and development in these regions.
        </p>

        <h2>Join Us in Transforming Dreams into Reality</h2>
        <p>
          Whether you're an entrepreneur with a groundbreaking idea or someone
          passionate about supporting innovative projects, PimpMyStartup is the
          platform for you. Join our community, be part of something
          extraordinary, and help us make a positive impact on the world.
        </p>
      </Container>
    </>
  );
};

export default AboutPage;