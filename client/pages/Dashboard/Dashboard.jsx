import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Assuming you're using react-router for navigation
import styles from './Dashboard.module.css'; // Importing styles

const Dashboard = () => {
    const [forms, setForms] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch the user's forms from the backend
        fetch('http://localhost:5174/forms')
            .then(response => response.json())
            .then(data => setForms(data))
            .catch(error => console.error('Error fetching forms:', error));
    }, []);

    return (
        <div className={styles.dashboardContainer}>
            <button className={styles.newFormButton} onClick={() => navigate('/form-wizard')}>Make a New Form</button>
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