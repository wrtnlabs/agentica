import { ToastContainer } from "react-toastify/unstyled"
import "react-toastify/dist/ReactToastify.css";

export default function ToastProvider() {
  return (
    <ToastContainer 
      position="top-center"
      autoClose={3000} 
      hideProgressBar={true}
      closeButton={false}
      closeOnClick={true}
      icon={false}
      transition={undefined}
      style={{
        width: "100%",
        top: "80px"
      }}
      toastStyle={{
        padding: "0",
        width: "100%",
        backgroundColor: "transparent",
        margin: "0 auto",
      }}
    />
  )
}