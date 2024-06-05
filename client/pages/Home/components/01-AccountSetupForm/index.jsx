import { useState } from 'react';
import styles from './AccountSetupForm.module.css';
import formIllustration from '../../../../images/forms-concept-illustration/FoxForms_illustration.png';
import formExampleIcon01 from '../../../../images/forms-concept-illustration/AccountSetupForm_Sect3_Icon01.png';
import formExampleIcon02 from '../../../../images/forms-concept-illustration/AccountSetupForm_Sect3_Icon02.png';
import formExampleIcon03 from '../../../../images/forms-concept-illustration/AccountSetupForm_Sect3_Icon03.png';
import formExampleIcon04 from '../../../../images/forms-concept-illustration/AccountSetupForm_Sect3_Icon04.png';




// User Sign Up
const AccountSetupForm = ({ onBack, onNext, username, setUsername, password, setPassword, updateGlobalPayloadState, setShowComponent }) => {
    const [formData, setFormData] = useState({
        confirmPassword: '',
    });
    const [passwordError, setPasswordError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'username') setUsername(value);
        else if (name === 'password') setPassword(value); // Add this line to update password
        else setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== formData.confirmPassword) {
            setPasswordError('Passwords do not match');
            return;
        }
        try {
            const response = await fetch('http://localhost:3000/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = response.ok ? await response.json() : { message: await response.text() };
            if (response.ok) {
                console.log('User signed up successfully:', data);
                localStorage.setItem('authToken', data.authToken); // Store authToken in local storage
                updateGlobalPayloadState({
                    username: username,
                    userId: data.userId
                });
                onNext(); // Proceed to the next form or action
            } else {
                throw new Error(data.message || 'Failed to sign up');
            }
        } catch (error) {
            console.error('Signup error:', error);
            setPasswordError(error.message || 'An unexpected error occurred during sign-up.');
        }
    };

    const handleSignUpClick = () => {
        console.log('Before setting showComponent');
        setShowComponent('signup');
        console.log('After setting showComponent:', showComponent);
    };

    return (
        <>
            <div className={styles.AccountSetupForm}>
                <div className={styles.AccountSetupFormSect1}>
                    <div className={styles.AccountSetupFormHero}>
                        <h1><span className={styles.gradientText}>Effortless</span> form building.</h1>
                        <h1><span className={styles.gradientText}>Seamless</span> data collection.</h1>
                        <h3> Gather customer insights with precision and ease.</h3>
                    </div>

                    <button 
                        className={styles.signUpButton} 
                        onClick={() => setShowComponent('signup')}
                        style={{ backgroundColor: 'black', color: 'white', padding: '10px 20px', fontSize: '16px', borderRadius: '5px', cursor: 'pointer' }}
                    >
                        Sign Up
                    </button>
                </div>

                <div className={styles.AccountSetupFormIllustration}>
                    <img src={formIllustration} alt="FoxForms Illustration" />
                </div>

                <div className={styles.accountSetupFormSect2}>
                    <h1>What Our Users Are Saying</h1>
                    <br></br>

                    <div className={styles.userTestimonials}>
                        
                        <div className={styles.userTestimonial_1}>
                            <div className={styles.userReview}>
                                <div className={styles.profilePicContainer}>
                                    <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" alt="User Testimonial Picture" />

                                    <h2>
                                        "FoxForms completely transformed our customer conversion rates!
                                    </h2>
                                </div>
                                <br></br>
                                <h4> 
                                    Since implementing their user-friendly forms, we've seen a 40% increase in sign-ups. 
                                    The customization options allowed us to tailor each form to our specific needs, making it easier for customers to complete and submit. 
                                    Highly recommend!"
                                </h4>
                            </div>
                            <div className={styles.userReviewName}>
                                <h4>Michael Jackson</h4>
                            </div>
                        </div>

                       <div className={styles.userTestimonial_2}>
                            <div className={styles.userReview}>
                                <h2>
                                    "The data visualization features of FoxForms are a game-changer! 
                                </h2> 
                                <br></br>
                                <h4>
                                    Each form provides detailed analytics that help us understand customer behavior better. 
                                    We can see exactly where users drop off and what elements are most effective. 
                                    This insight has enabled us to tweak our approach and significantly boost our conversion rates."
                                </h4>
                            </div>
                            <div className={styles.userReviewName}>
                                 <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" alt="User Testimonial Picture" />
                                <h4>Michael Jackson</h4>
                            </div>
                        </div>

                        <div className={styles.userTestimonial_3}>
                            <div className={styles.userReview}>
                                <h2>
                                    "Before using FoxForms, our customer engagement was lackluster at best. 
                                </h2>
                                <br></br>
                                <h4>
                                    Now, with their intuitive and visually appealing forms, we've seen a dramatic improvement. 
                                    Not only are more people completing our forms, but the feedback we receive is richer and more actionable. 
                                    FoxForms has truly helped us connect with our audience on a deeper level."   
                                </h4>
                            </div>
                            <div className={styles.userReviewName}>
                                <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" alt="User Testimonial Picture" />
                                <h4>Michael Jackson</h4>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.accountSetupFormSect3}>
                    <div className={styles.formExamples}>
                        <div className={styles.formExample}>
                            <h1>Forms Galore!</h1>
                            <div className={styles.formExamplesRow}>
                                <div className={styles.formType}>
                                    <img src={formExampleIcon01} alt="Contact Form Icon" />
                                    <h2>Contact Forms</h2>
                                    <p>Effortlessly gather contact information from your users with our customizable contact forms.</p>
                                </div>
                                <div className={styles.formType}>
                                    <img src={formExampleIcon02} alt="Survey Form Icon" />
                                    <h2>Survey Forms</h2>
                                    <p>Collect valuable feedback and insights with our easy-to-use survey forms.</p>
                                </div>
                            </div>

                            <div className={styles.formExamplesRow}>
                                <div className={styles.formType}>
                                    <img src={formExampleIcon03} alt="Order Form Icon" />
                                    <h2>Order Forms</h2>
                                    <p>Streamline your ordering process with our efficient and user-friendly order forms.</p>
                                </div>
                                <div className={styles.formType}>
                                     <img src={formExampleIcon04} alt="Feedback Form Icon" />
                                    <h2>Feedback Forms</h2>
                                    <p>Get detailed feedback from your customers to improve your products and services.</p>
                                </div>
                            </div>

                            <div className={styles.formExamplesRow}>
                                <div className={styles.formType}>
                                    <h2>And more!</h2>
                                    <p>Explore a variety of other form types to meet all your data collection needs.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> 
            </div> 
        </>
    );
};

export default AccountSetupForm;
