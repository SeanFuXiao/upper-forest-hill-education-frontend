import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.homeContainer}>
      <header style={styles.heroSection}>
        <div style={styles.heroOverlay}></div>
        <div style={styles.heroContent}>
          <h1 style={styles.boldHeading}>
            Welcome to Upper Forest Hill Education
          </h1>
          <p style={styles.subheading}>
            Empowering students with quality education since 2015.
          </p>
          <button style={styles.button} onClick={() => navigate("/login")}>
            Get Started
          </button>
        </div>
      </header>

      <section style={styles.aboutSection}>
        <div style={styles.aboutContent}>
          <h2 style={styles.boldHeading}>About Upper Forest Hill Education</h2>
          <p style={styles.text}>
            Upper Forest Hill Education was established in 2015 in Toronto,
            Ontario, Canada. It is a comprehensive K-12 premium education and
            training institution located at 5231 Yonge St, North York.
          </p>
          <p style={styles.text}>
            After years of continuous effort, with nearly a thousand registered
            students, it has become a highly reputable and trusted educational
            institution in the region.
          </p>
        </div>
      </section>

      <section style={styles.featuresSection}>
        <h2 style={styles.boldHeading}>Why Choose Us?</h2>
        <br></br>
        <div style={styles.features}>
          <div style={styles.featureCard}>
            <img
              src="/bg_s3.webp"
              alt="Comprehensive Curriculum"
              style={styles.featureImage}
            />
            <h3 style={styles.featureHeading}>Comprehensive Curriculum</h3>
            <p style={styles.text}>
              We offer a wide range of subjects designed to prepare students for
              their future.
            </p>
          </div>
          <div style={styles.featureCard}>
            <img
              src="/bg_s1.webp"
              alt="Expert Educators"
              style={styles.featureImage}
            />
            <h3 style={styles.featureHeading}>Expert Educators</h3>
            <p style={styles.text}>
              Our experienced teachers are dedicated to fostering academic
              excellence.
            </p>
          </div>
          <div style={styles.featureCard}>
            <img
              src="/bg_s2.webp"
              alt="Modern Facilities"
              style={styles.featureImage}
            />
            <h3 style={styles.featureHeading}>Modern Facilities</h3>
            <p style={styles.text}>
              Our state-of-the-art classrooms and learning environments enhance
              student engagement.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

const styles = {
  homeContainer: {
    fontFamily: "Arial, sans-serif",
    textAlign: "center",
    padding: "20px",
  },
  heroSection: {
    position: "relative",
    background: "url('/home_bg.jpg') center/cover no-repeat",
    color: "white",
    padding: "80px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    minHeight: "400px",
  },
  heroOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0, 0, 0, 0.5)",
    zIndex: 1,
  },
  heroContent: {
    position: "relative",
    zIndex: 2,
    maxWidth: "800px",
  },
  boldHeading: {
    fontSize: "2.8rem",
    marginBottom: "10px",
    fontWeight: "bold",
  },
  subheading: {
    fontSize: "1.2rem",
    opacity: 0.9,
  },
  button: {
    marginTop: "20px",
    padding: "10px 20px",
    fontSize: "1.2rem",
    backgroundColor: "#0077cc",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  aboutSection: {
    padding: "50px 20px",
    background: "#ECF0F1",
  },
  aboutContent: {
    maxWidth: "800px",
    margin: "0 auto",
  },
  sectionHeading: {
    fontSize: "2rem",
    marginBottom: "20px",
    fontWeight: "bold",
  },
  text: {
    fontSize: "1.1rem",
    lineHeight: "1.6",
  },
  featuresSection: {
    padding: "50px 20px",
  },
  features: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    flexWrap: "wrap",
  },
  featureCard: {
    background: "white",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
    maxWidth: "300px",
    textAlign: "center",
  },
  featureImage: {
    width: "100%",
    height: "200px",
    objectFit: "cover",
    borderRadius: "8px 8px 0 0",
    marginBottom: "10px",
  },
  featureHeading: {
    fontSize: "1.5rem",
    marginBottom: "10px",
  },
  footer: {
    marginTop: "50px",
    padding: "20px",
    background: "#2C3E50",
    color: "white",
  },
};

export default Home;
