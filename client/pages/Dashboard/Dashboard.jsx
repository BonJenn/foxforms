import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // Assuming you're using react-router for navigation
import styles from './Dashboard.module.css'; // Importing styles

const Dashboard = () => {
    const { userId } = useParams(); // Assuming 'userId' is a route parameter
    const [forms, setForms] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch the user's forms from the backend
        console.log(`Fetching forms for userId: ${userId}`); // Log the fetch URL
        console.log('Current userId:', userId); // Add this line to log the userId
        fetch(`http://localhost:5174/forms?userId=${userId}`)
            .then(response => response.json())
            .then(data => {
                console.log('Fetched forms:', data); // Add this line to log fetched data
                setForms(data);
            })
            .catch(error => console.error('Error fetching forms:', error));
    }, [userId]); // Dependency array includes userId

    return (
        <div className={styles.dashboardContainer}>
            <h3>DASHBOARD</h3>
            <button className={styles.newFormButton} onClick={() => navigate(`/form-wizard/${userId}`)}>Make a New Form</button>
            <div className={styles.formList}>
         
                {forms.map(form => (
                    <div key={form._id} className={styles.formItem}>
                        <h3>{form.title}</h3>
                       
                        {/* Display other form details as needed */}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Dashboard;