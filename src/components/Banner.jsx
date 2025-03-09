import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import "./Banner.css";

const Banner = () => {
  return (
    <div className="banner">
      <div className="banner-content">
        <h1>GadgetHaven✨</h1>
        <p>Your go-to destination for the latest and greatest gadgets</p>
        <Link to="/dashboard" className="banner-button">
          Go to Dashboard <FontAwesomeIcon icon={faArrowRight} />
        </Link>
      </div>
    </div>
  );
};

export default Banner;
