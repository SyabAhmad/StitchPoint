import React from "react";
import heroImage from "../../assets/hero.jpg";
import team1 from "../../assets/team1.jpg";
import workshop from "../../assets/workshop.jpg";
import founder from "../../assets/founder.jpg";

export default function About() {
  return (
    <section className="about-section">
      {/* Hero About Section */}
      <div className="container-inline about-inner">
        <div className="about-text">
          <h2 className="about-title">We craft stories you wear</h2>
          <p className="about-lead">
            At Naqsh Couture we believe clothing is more than fabric and thread
            — it’s memory, confidence, and identity. For over a decade we’ve
            partnered with discerning clients to create garments that celebrate
            life’s most meaningful moments. From a bride’s first step down the
            aisle to a tailored suit that changes a boardroom conversation, each
            creation is made with intention, heart, and exacting craft.
          </p>

          <p>
            Our atelier blends traditional handwork and modern techniques. Every
            seam, every stitch, every thoughtful detail is an invitation — to
            feel exceptional, to be remembered, to hold a piece of art that fits
            your life. We’re meticulous because you deserve garments that last
            and stories that become heirlooms.
          </p>

          <ul className="about-values">
            <li>
              <strong>Bespoke excellence:</strong> Each piece is measured,
              designed and fitted to you.
            </li>
            <li>
              <strong>Artisan-led craft:</strong> Skilled hands bring centuries
              of needlework to modern silhouettes.
            </li>
            <li>
              <strong>Transparent process:</strong> Clear timelines, honest
              pricing, and open collaboration.
            </li>
          </ul>

          <div className="about-cta">
            <a className="btn-gold" href="#contact">
              Book a consultation
            </a>
            <a
              className="btn-gray"
              href="#collections"
              style={{ marginLeft: "0.5rem" }}
            >
              See collections
            </a>
          </div>
        </div>

        <div
          className="about-image"
          aria-hidden
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          {/* decorative image */}
        </div>
      </div>

      {/* Our Story Section */}
      <div className="story-section">
        <div className="container-inline story-inner">
          <div
            className="story-image"
            style={{ backgroundImage: `url(${founder})` }}
          ></div>
          <div className="story-text">
            <h3 className="story-title">Our Story</h3>
            <p>
              Founded by Sarah Khan, a passionate designer with roots in
              traditional craftsmanship, Naqsh Couture began as a dream to
              bridge the gap between heritage and modernity. Sarah's journey
              started in her grandmother's workshop, learning the art of
              embroidery that has been passed down through generations. Today,
              she leads a team of skilled artisans who share her vision of
              creating timeless pieces that tell unique stories.
            </p>
            <p>
              Every garment we create is a collaboration between you and our
              team. We listen to your dreams, understand your lifestyle, and
              craft pieces that not only look beautiful but feel like an
              extension of your personality. Our clients aren't just
              customers—they're part of our extended family.
            </p>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="team-section">
        <div className="container-inline">
          <h3 className="section-title">Meet Our Team</h3>
          <div className="team-grid">
            <div className="team-member">
              <div
                className="team-image"
                style={{ backgroundImage: `url(${team1})` }}
              ></div>
              <h4>Sarah Khan</h4>
              <p>Founder & Lead Designer</p>
              <p>
                With 15+ years in couture design, Sarah brings creativity and
                precision to every piece.
              </p>
            </div>
            <div className="team-member">
              <div
                className="team-image"
                style={{ backgroundImage: `url(${workshop})` }}
              ></div>
              <h4>Ahmed Patel</h4>
              <p>Master Tailor</p>
              <p>
                Ahmed's expertise in traditional stitching techniques ensures
                perfection in every seam.
              </p>
            </div>
            <div className="team-member">
              <div
                className="team-image"
                style={{ backgroundImage: `url(${founder})` }}
              ></div>
              <h4>Maria Rodriguez</h4>
              <p>Embroidery Specialist</p>
              <p>
                Maria's intricate handwork brings fabrics to life with stunning
                detail and artistry.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Workshop Section */}
      <div className="workshop-section">
        <div className="container-inline workshop-inner">
          <div className="workshop-text">
            <h3 className="workshop-title">Our Atelier</h3>
            <p>
              Step into our sunlit workshop where creativity flows as freely as
              the threads we work with. Our space is designed to inspire—natural
              light streams through large windows, vintage sewing machines hum
              alongside modern equipment, and the air carries the scent of fine
              fabrics and fresh coffee. This is where magic happens, where your
              vision becomes reality.
            </p>
            <p>
              We believe in sustainable practices, sourcing fabrics from ethical
              suppliers and using techniques that honor both tradition and the
              environment. Every piece we create is not just clothing—it's a
              commitment to quality, craftsmanship, and your unique story.
            </p>
          </div>
          <div
            className="workshop-image"
            style={{ backgroundImage: `url(${workshop})` }}
          ></div>
        </div>
      </div>

      {/* Values Section */}
      <div className="values-section">
        <div className="container-inline">
          <h3 className="section-title">Our Values</h3>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">🎨</div>
              <h4>Creativity</h4>
              <p>
                We push boundaries to create pieces that are uniquely yours.
              </p>
            </div>
            <div className="value-card">
              <div className="value-icon">🤝</div>
              <h4>Collaboration</h4>
              <p>Your vision guides our process— we're partners in creation.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🌱</div>
              <h4>Sustainability</h4>
              <p>We choose ethical materials and timeless designs that last.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">❤️</div>
              <h4>Passion</h4>
              <p>Every stitch is made with love and dedication to our craft.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
