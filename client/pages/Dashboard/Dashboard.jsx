import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // Assuming you're using react-router for navigation
import styles from './Dashboard.module.css'; // Importing styles
import FormWizard from '../Home/components/FormWizard'; // Import the FormWizard component
import { useAuth } from '../../../src/context/AuthContext'; // Import useAuth

const Dashboard = () => {
    const { authToken } = useParams(); // Assuming 'authToken' is a route parameter
    const { authState } = useAuth(); // Use useAuth to access authState
    console.log('Auth State:', authState); // Debugging line to check authState
    const userId = localStorage.getItem('userId'); // Get userId from local storage
    console.log("Captured authToken:", authToken); // This should log the actual authToken or undefined
    if (authToken === undefined) {
        console.log("authToken is undefined, check route configuration and parameter passing.");
    }
    const [forms, setForms] = useState([]);
    const navigate = useNavigate();
    const [showDashboard, setShowDashboard] = useState(true); // State to manage visibility of Dashboard
    const [showFormWizard, setShowFormWizard] = useState(false); // State to manage visibility of FormWizard
    const [username, setUsername] = useState(''); // State to store the username

    const fetchUsername = async () => {
        try {
            const response = await fetch('http://localhost:3000/get-username', {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch username');
            }
            const data = await response.json();
            setUsername(data.username); // Update the username state
        } catch (error) {
            console.error('Error fetching username:', error);
        }
    };

    useEffect(() => {
        if (authToken) {
            fetchUsername();
        }
    }, [authToken]);

    useEffect(() => {
        // Fetch the user's forms from the backend
        console.log(`Fetching forms for authToken: ${authToken}`); // Log the fetch URL
        console.log('Current authToken:', authToken); // Add this line to log the authToken
        fetch(`http://localhost:3000/forms?userId=${userId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Fetched forms:', data); // Add this line to log fetched data
                // Sort forms by 'createdAt' in descending order
                const sortedForms = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setForms(sortedForms);
            })
            .catch(error => console.error('Error fetching forms:', error));
    }, [authToken, userId]); // Dependency array includes authToken and userId

    return (
        <div className={styles.dashboardContainer}>
            {showFormWizard ? (
                <FormWizard authToken={authToken} userId={userId} skipAccountSetup={true} />
            ) : (
                <>
                    <h3>DASHBOARD</h3>

                    <div className={styles.innerDashboard}>

                        <div className={styles.innerUpperDashboard}>

                            <div className={styles.profileSection}>
                                <img src={authState?.userProfilePic || 'default_profile_pic.png'} alt="Profile" className={styles.userProfilePic} />
                                <p className={styles.usernameDisplay}>{username || 'Not available'}</p>
                            </div>

                            <div className={styles.editProfileSection}>
                            <button className={styles.newFormButton} onClick={() => setShowFormWizard(true)}>Make a New Form</button>
                            <button className={styles.editProfileButton} onClick={() => setShowFormWizard(true)}>Edit Profile</button>


                            </div>

                        </div>

                        
                
                  
                        <div className={styles.formList}>
                                    {forms.map(form => (
                            <div key={form._id} className={styles.formItem}>
                                <h3>{form.title}</h3>
                                {/* Display other form details as needed */}
                            </div>
                        ))}
                    </div>



                    </div>

                   
                </>
            )}
        </div>
    );
}

export default Dashboard;
