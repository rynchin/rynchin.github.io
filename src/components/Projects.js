import React from "react";
import "./Projects.css";
import "../colors.css";
import Header from "./Header";
import demoVideo from "../assets/demo.mp4";
import mqaImage from "../assets/mqa.png";
import chainReactionImage from "../assets/Chain-Reaction.png";
import diGif from "../assets/DI.gif";
import dedupImage from "../assets/dedup.png";

const Projects = () => {
  const projects = [
    {
      id: "notetexer",
      title: "Notetexer",
      type: "video",
      media: demoVideo,
      description:
        "An integrated AI editor that converts stylus and audio input into structured LaTeX. It features an editor page with PDF creation, audio synchronization, and persistent storage for all previous audio/video inputs and project files.",
      link: {
        url: "https://notetexer.com",
        text: "Visit Site",
      },
    },
    {
      id: "chain-reaction",
      title: "Chain Reaction",
      type: "image",
      media: chainReactionImage,
      alt: "Chain Reaction game interface",
      description: (
        <>
          A real-time multiplayer word game where players race to form word
          chains and score the highest based on Google search queries. Compete
          against friends in private rooms with a continuous live scoreboard!
          <br />
          <span style={{ opacity: 0.7, fontWeight: 300 }}>
            5th Place at MIT Weblab 2025.
          </span>
        </>
      ),
      link: {
        url: "https://chain-reaction-4rpv.onrender.com/",
        text: "View Site",
      },
    },
    {
      id: "mqa",
      title: "Multi-Query Attention Implementation",
      type: "image",
      media: mqaImage,
      alt: "Multi-Query Attention diagram",
      description:
        "Implementation of N. Shazeer's Multi-Query Attention. Achieved a 17% reduction in peak memory usage compared to Multi-Head Attention, with benchmarks showing improved memory bandwidth during inference.",
      link: {
        url: "https://github.com/rynchin/mqa",
        text: "View on GitHub",
      },
    },
    {
      id: "dedup",
      title: "Deduplication At Scale",
      type: "image",
      media: dedupImage,
      alt: "Dedup pipeline visualization",
      description:
        "High-recall, CPU-feasible deduplication system for large text+code datasets. Implements MinHash–LSH and SimHash–Jaccard hybrid matching with >98% accuracy at 80–100× speedups over exact comparison. Designed for pretraining data quality and continual dataset refresh.",
      link: {
        url: "https://github.com/rynchin/dedup/blob/master/docs/experiments.md",
        text: "Writeup",
      },
    },
    {
      id: "double-integrator",
      title: "Multiplayer Collision Avoidance Solver",
      type: "image",
      media: diGif,
      alt: "Double Integrator collision avoidance simulation",
      description:
        "Optimal control solver for multi-agent collision avoidance that refines initial trajectories generated within an interactive playground. Modeled as a LP optimization problem based on the KKT conditions and log-barrier constraints.",
      link: {
        url: "https://github.com/rynchin/DoubleIntegrator",
        text: "View on GitHub",
      },
    },
  ];

  const renderProject = (project) => (
    <div key={project.id} className="project-card">
      <div className="project-content-horizontal">
        <div
          className={
            project.type === "video" ? "project-video" : "project-image"
          }
        >
          {project.type === "video" ? (
            <video autoPlay loop muted playsInline className="demo-video">
              <source src={project.media} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <img
              src={project.media}
              alt={project.alt}
              className="project-img"
            />
          )}
        </div>

        <div className="project-info-horizontal">
          <h2 className="project-title">{project.title}</h2>
          <p className="project-description">{project.description}</p>
          <div className="project-links">
            <a
              href={project.link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="project-link"
            >
              {project.link.text}
            </a>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Header />
      <div className="projects-container">
        <div className="projects-content">
          <h1 className="projects-title">Projects</h1>
          <div className="project-grid">{projects.map(renderProject)}</div>
        </div>
      </div>
    </>
  );
};

export default Projects;
