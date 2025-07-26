import { ToastContainer } from "react-toastify";
import Body from "./Body";


const Applayout = () => {
 
  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Body />
    </div>
  );
};

export default Applayout;
