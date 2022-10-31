import React, {useState, useEffect} from "react";
import { Link, useNavigate } from "react-router-dom";
import {Form, Button} from "react-bootstrap";
import RegisterInfoGraphic from "../components/user/RegisterInfoGraphic";
import {Container} from 'react-bootstrap';
import { isValidatePhone, resetUserLoginData, setUserLoginData } from "../utils/helper";
import RESTClient from "../utils/RestClient";
import RestEndPoint from "../redux/constants/RestEndpoints";
import {ToastContainer, toast} from "react-toastify";
import OtpTimer from "otp-timer";

const SignIn = () => {
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);
    const [sendingOTP, setSendingOTP] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [loginWithOTP, setLoginWithOTP] = useState(false);
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [otpSentCounter, setOtpSentCounter] = useState(1);
    const [otpMinutes, setOtpMinutes] = useState(0);
    //const handleShowPasswordDialog = () => {}

    useEffect(() => {
        if (otpSentCounter === 4) {
            setOtpMinutes(2);
        } else if (otpSentCounter === 1) {
            setOtpMinutes(0);
        }
    }, [otpSentCounter]);

    const sendOTP = () => {
        if (isValidatePhone(phone)) {
            const reqPayload = {phone: phone}
            setSendingOTP(true);
            RESTClient.post(RestEndPoint.SEND_OTP, reqPayload).then((response) => {
                setSendingOTP(false);
                setOtpSent(true);
            }).catch((error) => {
                toast.error(RESTClient.getAPIErrorMessage(error));
                setSendingOTP(false);
            });
        } else {
            toast.error("Invalid mobile number.");
        }
    }

    const getSendOTPLinkMessage = () => {
        return (
            sendingOTP ? 'Sending OTP...' : (otpSent ? <OtpTimer minutes={otpMinutes}
                seconds={30}
                text="Resend OTP in"
                ButtonText="Send OTP"
                resend={() => {
                    sendOTP();
                    setOtpSentCounter((val) =>
                        val === 2 ? 1 : val + 1,
                    );
                }}
            /> : <Link onClick={sendOTP}>Send OTP</Link>)
        )
        
    }

    const setOtpOrPassword = (value) => {
        loginWithOTP ? setOtp(value) : setPassword(value);
    }

    const signIn = () => {
        const reqPayload = {phone: phone}
        reqPayload[(loginWithOTP ? "otp" : "password")] = loginWithOTP ? otp : password;
        const action = loginWithOTP ? RestEndPoint.LOGIN_WITH_OTP : RestEndPoint.LOGIN_WITH_PASSWORD
        setSubmitting(true);
        resetUserLoginData();
        RESTClient.post(action, reqPayload).then((response) => {
            setUserLoginData(response.data);
            setSubmitting(false);
            navigate("/");
        }).catch((error) => {
            toast.error(RESTClient.getAPIErrorMessage(error));
            setSubmitting(false);
        });
    }
    return (
        <Container className="main-container singup-main" fluid>
            <div className="signup-wrapper">
                <div className="signup-col left">
                    <RegisterInfoGraphic />
                </div>
                <div className="signup-col right">
                    <div className="form-wrapper">
                        <div className="form-title"><span>Sign In</span></div>
                        <div className="form-container">
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Control type="phone" onChange={e=> setPhone(e.target.value)} placeholder="Mobile Number" />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Control type="password" placeholder={loginWithOTP ? "OTP" : "Password"} onChange={e=> setOtpOrPassword(e.target.value)}/>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                                    <Form.Check type="checkbox" name="loginWithOTP" onChange={e=> setLoginWithOTP(e.target.checked)} label=" Login with OTP" />
                                    { loginWithOTP ? getSendOTPLinkMessage() : '' }
                                </Form.Group>
                                {/* <div className="form-group mb-3 forgot-pwd-container">
                                    <Link onClick={handleShowPasswordDialog}>Forgot Password?</Link>
                                </div> */}
                                <Form.Group className="mb-3 button-wrap">
                                    <Button variant="primary" disabled={submitting} onClick={signIn}>{submitting ? "Please wait..." :"Sign In"}</Button>
                                </Form.Group>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer autoClose={2000} position="top-right"/>
        </Container>
    );
};

export default SignIn;