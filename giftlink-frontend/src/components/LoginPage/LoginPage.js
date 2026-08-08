import React, { useState, useEffect } from 'react';
import './LoginPage.css';
import { urlConfig } from '../../config'; //Task 1: Import urlConfig from `giftlink-frontend/src/config.js`
import { useAppContext } from '../../context/AuthContext'; //Task 2: Import useAppContext `giftlink-frontend/context/AuthContext.js`
import { useNavigate } from 'react-router-dom'; //Task 3: Import useNavigate from `react-router-dom` to handle navigation after successful registration.

function LoginPage() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [incorrect, setIncorrect] = useState(''); //Task 4: Include a state for incorrect password.
    const navigate = useNavigate(); //Task 5: Create a local variable for `navigate`,`bearerToken`   and `setIsLoggedIn`.
    const bearerToken = sessionStorage.getItem('auth-token');
    const { setIsLoggedIn } = useAppContext();

    useEffect(() => { //Task 6. If the bearerToken has a value (user already logged in), navigate to MainPage
        if (sessionStorage.getItem('auth-token')) {
            navigate('/app')
        }
    }, [navigate])


    const handleLogin = async () => {
        try {
            setIncorrect("");
            //first task
            const response = await fetch(`${urlConfig.backendUrl}/api/auth/login`, {
                method: 'POST', //Task 7: Set method
                headers: { //Task 8: Set headers
                    'content-type': 'application/json',
                    'Authorization': bearerToken ? `Bearer ${bearerToken}` : '', // Include Bearer token if available
                },
                body: JSON.stringify({ //Task 9: Set body to send user details
                    email: email,
                    password: password,
                })
            });

            // Task 1: Access data coming from fetch API
            const json = await response.json();
            // Task 5: Clear input and set an error message if the password is incorrect
            if (json.authtoken) {
                // Tasks 1-4 done previously
                // Task 2: Set user details
                sessionStorage.setItem('auth-token', json.authtoken);
                sessionStorage.setItem('name', json.userName);
                sessionStorage.setItem('email', json.userEmail);
                // Task 3: Set the user's state to log in using the `useAppContext`.
                setIsLoggedIn(true);
                // Task 4: Navigate to the MainPage after logging in.
                navigate('/app');
            } else {
                setEmail("");
                setPassword("");
                setIncorrect("Wrong password. Try again.");
                //Below is optional, but recommended - Clear out error message after 2 seconds
                setTimeout(() => {
                    setIncorrect("");
                }, 2000);
            }
        } catch (e) {
            console.log("Error fetching details: " + e.message);
        }
    }

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-4">
                    <div className="login-card p-4 border rounded">
                        <h2 className="text-center mb-4 font-weight-bold">Login</h2>

                        <div className="mb-4">
                            <label htmlFor="email" className="form label">Email</label><br />
                            <input
                                id="email"
                                type="email"
                                className="form-control"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            {/* Task 6: Display an error message to the user. */}
                            <span style={{ color: 'red', height: '.5cm', display: 'block', fontStyle: 'italic', fontSize: '12px' }}>{incorrect}</span>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="password" className="form label">Password</label><br />
                            <input
                                id="password"
                                type="password"
                                className="form-control"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <button className="btn btn-primary w-100 mb-3" onClick={handleLogin}>Login</button>

                        <p className="mt-4 text-center">
                            New here? <a href="/app/register" className="text-primary">Register Here</a>
                        </p>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;