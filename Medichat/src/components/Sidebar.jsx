import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";

const Sidebar = ({ onSelect }) => {
    const [activeButton, setActiveButton] = useState("chat");

    const { patient, doctor, isDoctor } = useSelector((state) => state.auth);
    
    const user = useMemo(() => (isDoctor ? doctor : patient), [isDoctor, doctor, patient]);
    const isPatient = useMemo(() => !isDoctor, [isDoctor]);

    const handleClick = (buttonName) => {
        setActiveButton(buttonName);
        onSelect(buttonName);
    };

    const ButtonItem = ({ name, icon, label }) => (
        <div className="pt-2">
            <button
                onClick={() => handleClick(name)}
                className={`btn border-0 d-flex flex-start w-100 ${
                    activeButton === name ? "bg-darker text-white" : ""
                }`}
            >
                <i className={`bi ${icon} linktag main-text-srt`}> {label}</i>
            </button>
        </div>
    );

    const buttonsConfig = useMemo(() => [
        { name: "chat", icon: "bi-chat", label: "Chat", show: true },
        { name: "calls", icon: "bi-telephone", label: "Calls", show: isPatient },
        { name: "consultations", icon: "bi-chat-right-text", label: "Consultations", show: !isPatient },
        { name: "news", icon: "bi-newspaper", label: "Latest News", show: true },
        { name: "doctors", icon: "bi-heart-pulse", label: "Find a Doctor", show: true },
        { name: "notes", icon: "bi-file-earmark-text", label: "Notes", show: !isPatient },
        { name: "hospitals", icon: "bi-hospital", label: "Hospitals", show: true },
        { name: "mydoctors", icon: "bi bi-people-fill", label: "My Doctors", show: true },
        { name: "mypatients", icon: "bi bi-people-fill", label: "My Patients", show: !isPatient },
    ], [isPatient]);

    return (
        <div className="col-2 Sidebar bg-light d-none d-md-block">
            <div className="row top">
                <div className="justify-content-between">
                    {buttonsConfig.map((button) => 
                        button.show && (
                            <ButtonItem
                                key={button.name}
                                name={button.name}
                                icon={button.icon}
                                label={button.label}
                            />
                        )
                    )}
                </div>

                <div className="position-absolute p-3" style={{ bottom: "20px", left: "0" , width: "230px"}}>
                    <ButtonItem name="settings" icon="bi-gear" label="Settings" />
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
