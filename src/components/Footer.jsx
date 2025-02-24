const Footer = () => {
  return (
    <footer className="bg-dark text-white text-center py-3 mt-auto">
      <div className="container">
        <p>
          &copy; {new Date().getFullYear()} UFH Education. All rights reserved.
        </p>

        {/* Social Media Links */}
        {/* Social Media Links */}

        <div id="personal-links">
          <a
            href="https://github.com/SeanFuXiao"
            id="github"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-github"></i>
          </a>
          <a
            href="https://www.linkedin.com/in/xiao-fu-138b96316/"
            id="linkedin"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-linkedin"></i>
          </a>
          <a
            href="https://www.facebook.com/profile.php?id=100090159947400"
            id="facebook"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-facebook"></i>
          </a>
          <a href="mailto:seanfuxiao@gmail.com" id="email">
            <i className="fas fa-envelope"></i>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
