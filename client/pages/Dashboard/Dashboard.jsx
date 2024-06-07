import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // Assuming you're using react-router for navigation
import styles from './Dashboard.module.css'; // Importing styles
import FormWizard from '../Home/components/FormWizard'; // Import the FormWizard component
import { useAuth } from '../../../src/context/AuthContext'; // Import useAuth
import Footer from '../Home/Footer';
import { formatDistanceToNow } from 'date-fns'; // Import formatDistanceToNow from date-fns

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
    const formsRef = useRef(null); // Create a ref for the forms container

    const handleScroll = () => {
        const element = formsRef.current;
        const maxScroll = element.scrollWidth - element.clientWidth;
        const scrollPosition = element.scrollLeft;

        // Control the visibility of the left gradient
        const leftFade = element.querySelector('.dashboardForms::before');
        const rightFade = element.querySelector('.dashboardForms::after');

        if (scrollPosition > 0) {
            leftFade.style.display = 'block';
        } else {
            leftFade.style.display = 'none';
        }

        if (scrollPosition < maxScroll) {
            rightFade.style.display = 'block';
        } else {
            rightFade.style.display = 'none';
        }
    };

    useEffect(() => {
        const element = formsRef.current;
        if (element) {
            element.addEventListener('scroll', handleScroll);
        }
        return () => {
            if (element) {
                element.removeEventListener('scroll', handleScroll);
            }
        };
    }, []); // Empty dependency array ensures this effect runs only once after the initial render

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

    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - formsRef.current.offsetLeft);
        setScrollLeft(formsRef.current.scrollLeft);
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - formsRef.current.offsetLeft;
        const walk = (x - startX) * 2; // The number here determines the sensitivity of the drag
        formsRef.current.scrollLeft = scrollLeft - walk;
    };

    useEffect(() => {
        const element = formsRef.current;
        if (element) {
            element.addEventListener('mousedown', handleMouseDown);
            element.addEventListener('mouseleave', handleMouseLeave);
            element.addEventListener('mouseup', handleMouseUp);
            element.addEventListener('mousemove', handleMouseMove);
        }
        return () => {
            if (element) {
                element.removeEventListener('mousedown', handleMouseDown);
                element.removeEventListener('mouseleave', handleMouseLeave);
                element.removeEventListener('mouseup', handleMouseUp);
                element.removeEventListener('mousemove', handleMouseMove);
            }
        };
    }, [isDragging, startX, scrollLeft]); // Dependencies ensure that updates to state are respected

    return (
        <div className={styles.dashboardContainer}>
            {showFormWizard ? (
                <FormWizard authToken={authToken} userId={userId} skipAccountSetup={true} />
            ) : (
                <>


                {/* Dashboard Section 2 */}
                    <div className={styles.dashboardSect1}>
                            <div className={styles.dashboardProfile}>
                                <img src={authState?.userProfilePic || 'default_profile_pic.png'} alt="Profile" className={styles.userProfilePic} />
                                <div className={styles.userInfo}>
                                    <h1 className={styles.usernameDisplay}>{username || 'Not available'}'s Forms</h1>
                                    <p className={styles.userEmail}>{username || 'Not available'}</p>
                                </div>
                            </div>
                    </div>


                {/* Dashboard Section 2 */}
                    <div className={styles.dashboardSect2}> 
                        <h2>Create a new form</h2>
                        <div className={styles.dashboardFormButtons}>
                            <button className={styles.newSignUpFormButton} onClick={() => setShowFormWizard(true)}><span>Sign Up</span><br></br>Form</button>
                            <button className={styles.newBasicFormButton} onClick={() => setShowFormWizard(true)}><span>Basic</span><br></br> Form</button>
                        </div>
                    </div>

                {/* Dashboard Section 3 */}
                    <div className={styles.dashboardSect3}>
                        <h2>Your forms</h2>
                        <div className={styles.dashboardFormsContainer}>
                            <div className={styles.dashboardForms} ref={formsRef}>
                                {forms.map(form => (
                                    <div key={form.id} className={styles.dashboardForm}>
                                        <h4>{form.title}</h4>
                                        <p>{formatDistanceToNow(new Date(form.createdAt), { addSuffix: true })}</p>  
                                    </div>
                                ))}
                            </div>
                            <div className={`${styles.fadeEffect} ${styles.left}`}></div>
                            <div className={`${styles.fadeEffect} ${styles.right}`}></div>
                        </div>
                    </div>

                 


          

                    <Footer />
                </>
            )}
        </div>


        
   
    );
}

export default Dashboard;
