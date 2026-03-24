import React, { useEffect, useState } from "react";
let alertHandler;

export const showCustomAlert = (message) => {
    if(alertHandler) {
        alertHandler(message);
    }
};

const CustomAlert = () => {

    const [msg, setMsg] = useState('');
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        alertHandler = (message) => {
            setMsg(message);
            setVisible(true);
        }
    }, []);

  return (
    visible && (<div className="fixed inset-0 flex items-start justify-center pt-12.5 bg-black/50 z-50">
        <div className="bg-[#202124] text-white rounded-lg shadow-lg p-6 w-80">
            <p className="text-sm">{msg}</p>
            <div className="flex justify-end mt-10">
                <button
                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full cursor-pointer text-sm"
                    onClick={() => setVisible(false)}
                >
                    Ok
                </button>
            </div>
        </div>
    </div>)
  );
};

export default CustomAlert;
