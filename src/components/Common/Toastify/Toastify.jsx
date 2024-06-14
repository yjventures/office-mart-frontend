// component name: Toastify.jsx
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const showToast = (message, type) => {
  toast(message, {
    type,
  });
};

export { showToast };