import React from "react";
import "./AboutSection.css"; // Import the CSS file
import cake from "../../images/cake1.jpg";
import { Link } from "react-router-dom";

import team1 from "../../images/1.png";
import team2 from "../../images/2.png";
import team3 from "../../images/3.png";
import team4 from "../../images/4.png";

const AboutUs = () => {
  const teamMembers = [
    {
      imgSrc: team4,
      name: "Gourav Panchal",
      position: "Web Developer",
    },
    {
      imgSrc: team3,
      name: "Vishnu Sahu",
      position: "Senior Assistant",
    },
    {
      imgSrc: team2,
      name: "Dev Sisodiya",
      position: "Front-end Developer",
    },
    {
      imgSrc: team1,
      name: "Aadil Khan",
      position: "Backend Developer",
    },
  ];

  return (
    <>
      {/* ----breadCrumb----  */}
      <section className="breadCrumb">
        <div className="breadCrumbContent">
          <h1>About Us</h1>
          <Link to="/">Home /</Link> <Link to="">About Us</Link>
        </div>
      </section>
      {/* ----breadCrumb---- end  */}

      {/* ----about section ---- */}
      <section className="about-container container">
        <div className="about-image-container">
          <img src={cake} alt="Croissant" className="about-image w-100" />
        </div>
        <div className="about-content">
          <p className="ourTeam_miniHeading">// About Us</p>
          <h3 className="about-title">
            We Bake Every Item From The Core Of Our Hearts
          </h3>
          <p className="about-text">
            At Cake Crazzy, we believe that every cake tells a story. Our
            passion for baking is rooted in bringing joy to your celebrations,
            from birthdays to weddings and every special moment in between.
            Using the finest ingredients and time-honored recipes, we create
            delicious, handcrafted cakes that are as beautiful as they are
            flavorful.
          </p>
          <p className="about-text">
            Whether you're craving a classic chocolate delight, a customized
            designer cake, or a special treat for a loved one, we are here to
            make your sweetest dreams come true. Our commitment to quality,
            creativity, and customer satisfaction ensures that every bite is a
            delightful experience.
          </p>
          <ul className="about-features-list">
            <li className="about-feature-item">
              ✔ Premium Quality Ingredients – Freshly baked, never compromised.
            </li>
            <li className="about-feature-item">
              ✔ Easy Online Ordering – Order your favorite cakes with just a few
              clicks.
            </li>
            <li className="about-feature-item">
              ✔ Custom Creations – Personalize your cake for any occasion.
            </li>
            <li className="about-feature-item">
              ✔ Home Delivery – Get your cake delivered straight to your
              doorstep.
            </li>
          </ul>
        </div>
      </section>
      {/* ----about section ---- end */}

      {/* ----Our Team Section ---- */}
      <section className="OurTeam">
        <div className="team-section container">
          <p className="ourTeam_miniHeading">// Our Team</p>
          <h2>We're Super Professional At Our Skills</h2>
          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <div key={index} className="team-member">
                <div className="team-member-photo">
                  <img src={member.imgSrc} alt={`Team Member ${index + 1}`} />
                </div>
                <h3 className="mt-3">{member.name}</h3>
                <p className="mb-0">{member.position}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* ----Our Team Section ---- end */}
    </>
  );
};

export default AboutUs;
