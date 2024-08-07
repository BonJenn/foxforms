import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Dashboard.module.css';
import FormWizard from '../Home/components/FormWizard';
import { useAuth } from '../../../src/context/AuthContext';
import Footer from '../Home/Footer';
import { formatDistanceToNow } from 'date-fns';

// Replace this with your actual API Gateway URL
const API_URL = 'https://u6n71jw2d7.execute-api.us-east-1.amazonaws.com/prod';

const Dashboard = () => {
    const { authState } = useAuth();
    const userId = authState.userId || localStorage.getItem('userId');
    const authToken = authState.token;

    const [forms, setForms] = useState([]);
    const navigate = useNavigate();
    const [showFormWizard, setShowFormWizard] = useState(false);
    const [username, setUsername] = useState('');
    const formsRef = useRef(null);
    const [formType, setFormType] = useState('');

    useEffect(() => {
        if (!authState.isLoggedIn) {
            navigate('/');
        }
    }, [authState.isLoggedIn, navigate]);

    const handleScroll = () => {
        const element = formsRef.current;
        if (!element) return; // Ensure element is not null
        const maxScroll = element.scrollWidth - element.clientWidth;
        const scrollPosition = element.scrollLeft;

        const leftFade = element.parentElement.querySelector(`.${styles.left}`);
        const rightFade = element.parentElement.querySelector(`.${styles.right}`);

        leftFade.style.opacity = scrollPosition > 0 ? '1' : '0';
        rightFade.style.opacity = scrollPosition < maxScroll ? '1' : '0';
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
    }, []);

    const fetchUsername = async () => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            console.log('No token found in localStorage');
            return;
        }
        try {
            const response = await fetch('https://u6n71jw2d7.execute-api.us-east-1.amazonaws.com/dev/get-username', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log('Fetched username:', data.username);
            setUsername(data.username);
        } catch (error) {
            console.error('Error fetching username:', error);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        console.log('Current authToken:', token);
        if (token) {
            fetchUsername();
        }
    }, []);

    useEffect(() => {
        if (userId && authToken) {
            fetch(`${API_URL}/forms?userId=${userId}`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                const sortedForms = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setForms(sortedForms);
            })
            .catch(error => {
                console.error('Error fetching forms:', error);
            });
        }
    }, [authToken, userId]);

    const isDragging = useRef(false);
    const startX = useRef(0);
    const scrollLeft = useRef(0);
    const velocity = useRef(0);
    const lastX = useRef(0);
    const lastMoveTime = useRef(0);
    const animationFrameId = useRef(null);

    const handleMouseDown = (e) => {
        isDragging.current = true;
        startX.current = e.pageX - formsRef.current.offsetLeft;
        scrollLeft.current = formsRef.current.scrollLeft;
        velocity.current = 0;
        lastX.current = e.pageX;
        lastMoveTime.current = Date.now();
        cancelAnimationFrame(animationFrameId.current);
        e.preventDefault();
    };

    const handleMouseUp = () => {
        isDragging.current = false;
        const now = Date.now();
        const timeElapsed = now - lastMoveTime.current;
        const distanceMoved = lastX.current - startX.current;
        const speed = distanceMoved / timeElapsed;

        if (Math.abs(speed) > 0.3) {
            const inertia = () => {
                if (Math.abs(velocity.current) > 1) {
                    formsRef.current.scrollLeft += velocity.current;
                    velocity.current *= 0.95;
                    animationFrameId.current = requestAnimationFrame(inertia);
                } else {
                    cancelAnimationFrame(animationFrameId.current);
                }
            };
            inertia();
        } else {
            velocity.current = 0;
        }
    };

    const handleMouseMove = (e) => {
        if (!isDragging.current) return;
        e.preventDefault();
        const x = e.pageX - formsRef.current.offsetLeft;
        const walk = (x - startX.current) * 2;
        formsRef.current.scrollLeft = scrollLeft.current - walk;
        const now = Date.now();
        const deltaTime = now - lastMoveTime.current;
        if (deltaTime > 0) {
            velocity.current = (x - lastX.current) / deltaTime;
        }
        lastX.current = x;
        lastMoveTime.current = now;
    };

    const handleMouseLeave = () => {
        if (isDragging.current) {
            handleMouseUp();
        }
        isDragging.current = false;
        cancelAnimationFrame(animationFrameId.current);
    };

    useEffect(() => {
        const element = formsRef.current;
        if (element) {
            element.addEventListener('mousedown', handleMouseDown);
            element.addEventListener('mouseup', handleMouseUp);
            element.addEventListener('mousemove', handleMouseMove);
            element.addEventListener('mouseleave', handleMouseLeave);
        }
        return () => {
            if (element) {
                element.removeEventListener('mousedown', handleMouseDown);
                element.removeEventListener('mouseup', handleMouseUp);
                element.removeEventListener('mousemove', handleMouseMove);
                element.removeEventListener('mouseleave', handleMouseLeave);
            }
        };
    }, []);

    return (
        <div className={styles.dashboardContainer}>
            {showFormWizard ? (
                <FormWizard type={formType} authToken={authToken} userId={userId} skipAccountSetup={false} />
            ) : (
                <>
                    <div className={styles.dashboardSect1}>
                        <div className={styles.dashboardProfile}>
                            <img src={authState?.userProfilePic || 'default_profile_pic.png'} alt="Profile" className={styles.userProfilePic} />
                            <div className={styles.userInfo}>
                                <h1 className={styles.usernameDisplay}>{username || 'Loading...'}'s Forms</h1>
                                <p className={styles.userEmail}>{username || 'Loading...'}</p>
                            </div>
                        </div>
                    </div>

                    <div className={styles.dashboardSect2}>
                        <h2>Create a new form</h2>
                        <div className={styles.dashboardFormButtons}>
                            <button className={styles.newSignUpFormButton} onClick={() => { setFormType('signup'); setShowFormWizard(true); }}><span>Sign Up</span><br />Form</button>
                            <button className={styles.newBasicFormButton} onClick={() => { setFormType('basic'); setShowFormWizard(true); }}><span>Basic</span><br /> Form</button>
                            <button className={styles.newBasicFormButton} onClick={() => { setFormType('ai'); setShowFormWizard(true); }}><span>AI-Generated</span><br /> Form</button>
                        </div>

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
                    </div>

                    <Footer />
                </>
            )}
        </div>
    );
}

export default Dashboard;