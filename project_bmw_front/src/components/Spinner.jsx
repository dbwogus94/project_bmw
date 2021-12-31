import { BeatLoader } from 'react-spinners';

const Spinner = () => {
  return (
    <>
      <div className="spinner">
        <h4>loading...</h4>
        <BeatLoader height="160" width="32" color="#505050" radius="8" />;
      </div>
    </>
  );
};

export default Spinner;
