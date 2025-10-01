import React from "react";
import "./About.css";
import "../colors.css";
import Header from "./Header";
import profilePic from "../assets/pfp.jpg";
import { useNavigate } from "react-router-dom";
import SpotifyNowPlaying from "./SpotifyNowPlaying";

const About = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  const onResumeClick = () => {
    navigate("/resume");
  };

  return (
    <>
      <Header />
      <div className="about-container">
        <div className="about-sidebar">
          <img src={profilePic} alt="Profile" className="profile-image" />
          <h1 className="name">Ryan Chin</h1>
          <p className="title">CS @ MIT</p>
          <p className="location">Cambridge, MA</p>

          <div className="contact-links">
            <div className="social-links">
              <a
                href="https://www.linkedin.com/in/rynchin/"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
              >
                / LinkedIn
              </a>
              <a
                href="https://github.com/rynchin"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
              >
                / GitHub
              </a>
              <a
                href="mailto:rychin@mit.edu"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
              >
                / Email
              </a>
              {/* <div onClick={onResumeClick} className="social-link">
                / Resume
              </div> */}
            </div>
          </div>
        </div>

        <div className="about-main">
          <div className="about-section">
            <h2>About</h2>
            <p className="about-description">
              I am an undergraduate at MIT studying computer science. My
              research interests are in NLP, representative learning, and
              meta-learning. In my free time, I organize for{" "}
              <a
                className="link"
                href="https://hackmit.org/"
                target="_blank"
                rel="noopener noreferrer"
              >
                HackMIT
              </a>
              , practice piano, and fence.
            </p>
          </div>

          <div className="work-section">
            <h2>Currently working on</h2>
            <ul className="experience-list">
              <li className="experience-item">
                Research Intern at{" "}
                <a
                  className="link"
                  href="https://www.salesforceairesearch.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Salesforce AI Research
                </a>
                , advised by{" "}
                <a
                  className="link"
                  href="https://raihanjoty.github.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Prof. Shafiq Joty
                </a>
              </li>
              <li className="experience-item">
                Research with{" "}
                <a
                  className="link"
                  href="https://www.rbg.mit.edu/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Regina Barzilay Group
                </a>{" "}
                at MIT CSAIL
              </li>
            </ul>
          </div>

          <div className="separator"></div>
          <div className="footer">
            <div className="copyright">&copy; {currentYear} Ryan Chin</div>
            <SpotifyNowPlaying />
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
