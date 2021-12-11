import { useAlertContext } from "../../alertContext";
import { route } from 'preact-router';

const Toast = () => {   
    const {alertMessage, setAlertMessage, alertRef} = useAlertContext();
    const handleClose = () => {
        setAlertMessage('');
    }

    return (
        <div tabIndex='-1' ref={alertRef} aria-live="assertive" class="toast text-center rounded-md absolute top-50px bg-gray-50 my-4">
           {alertMessage ?  (
                <div className="toast-content p-6 rounded-md">
                <p class="text-3xl my-3 text-red-700" >Error</p>
                <p class="text-lg"> { alertMessage }</p>
                <button aria-label="close the popup and go back to form" class="button my-2" onClick={handleClose}>Close</button>
               </div>
           ):   null
            }
        </div>
    )
}

export default Toast;