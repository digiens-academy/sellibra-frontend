import { Spinner } from 'react-bootstrap';

const Loader = ({ fullScreen = false }) => {
  if (fullScreen) {
    return (
      <div className="spinner-overlay">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="text-center py-5">
      <Spinner animation="border" variant="primary" />
    </div>
  );
};

export default Loader;

