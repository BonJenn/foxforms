import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // Assuming you're using react-router for navigation
import styles from './Dashboard.module.css'; // Importing styles
import FormWizard from '../Home/components/FormWizard'; // Import the FormWizard component

const Dashboard = () => {
    const { authToken } = useParams(); // Assuming 'authToken' is a route parameter
    console.log("Captured authToken:", authToken); // This should log the actual authToken or undefined
    if (authToken === undefined) {
        console.log("authToken is undefined, check route configuration and parameter passing.");
    }
    const [forms, setForms] = useState([]);
    const navigate = useNavigate();
    const [showDashboard, setShowDashboard] = useState(true); // State to manage visibility of Dashboard
    const [showFormWizard, setShowFormWizard] = useState(false); // State to manage visibility of FormWizard

    useEffect(() => {
        // Fetch the user's forms from the backend
        console.log(`Fetching forms for authToken: ${authToken}`); // Log the fetch URL
        console.log('Current authToken:', authToken); // Add this line to log the authToken
        fetch(`http://localhost:5174/forms?authToken=${authToken}`)
            .then(response => response.json())
            .then(data => {
                console.log('Fetched forms:', data); // Add this line to log fetched data
                setForms(data);
            })
            .catch(error => console.error('Error fetching forms:', error));
    }, [authToken]); // Dependency array includes authToken

    return (
        <div className={styles.dashboardContainer}>
            {showFormWizard ? (
                <FormWizard authToken={authToken} skipAccountSetup={true} />
            ) : (
                <>
                    <h3>DASHBOARD</h3>
                    <button className={styles.newFormButton} onClick={() => setShowFormWizard(true)}>Make a New Form</button>
                    <div className={styles.formList}>
                        {forms.map(form => (
                            <div key={form._id} className={styles.formItem}>
                                <h3>{form.title}</h3>
                                {/* Display other form details as needed */}
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

export default Dashboard;