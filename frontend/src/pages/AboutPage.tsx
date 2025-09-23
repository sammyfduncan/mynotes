import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const AboutPage: React.FC = () => {
  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md={8}>
          <h2 className="text-center mb-4">About MyNotes</h2>
          <p>
            MyNotes is a tool designed to help students learn more effectively. Simply upload your lecture slides or other course materials, and our AI-powered service will generate comprehensive and well-structured notes for you.
          </p>
          <h4>How it Works</h4>
          <p>
            Our application accepts PDF and PowerPoint files. Once you upload a file, our system processes the content and uses a generative AI model to create notes in your desired style. You can choose from default, concise, or detailed notes to fit your study needs.
          </p>
          <h4>Why it's Useful</h4>
          <p>
            By automating the note-taking process, MyNotes allows you to focus more on understanding the lecture content rather than transcribing it. The generated notes can be a great resource for revision and exam preparation.
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default AboutPage;