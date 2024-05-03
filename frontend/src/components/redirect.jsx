import { Link } from "react-router-dom";

const Redirect = () => {
  return (
    <div>
      <h1>Oh no, this route doesn't exist!</h1>
      <Link className="border-2 border-black" to="/">
        You can go back to the home page by clicking here, though!
      </Link>
    </div>
  );
};

export default Redirect;
