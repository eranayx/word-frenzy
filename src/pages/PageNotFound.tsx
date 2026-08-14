import { Link } from "react-router-dom";

import "../css/PageNotFound.css";

function PageNotFound() {
    return (
        <div className="error-page">
            <h1 className="error-msg">This page doesn't exist!</h1>
            <Link to={"/"}>Go Back Home</Link>
        </div>
    );
}

export default PageNotFound;
