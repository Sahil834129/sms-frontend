import { Form, Formik } from 'formik';
import React, { useState } from "react";
import { Container } from 'react-bootstrap';
import OtpInput from "react-otp-input";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { ReactComponent as SignupLogo } from "../assets/img/singup-logo.svg";
import Button from "../components/form/Button";
import InputField from "../components/form/InputField";
import RegisterInfoGraphic from "../components/user/RegisterInfoGraphic";
import { VerifyPhoneSchema } from "../data/validationSchema";
import RestEndPoint from "../redux/constants/RestEndpoints";
import RESTClient from "../utils/RestClient";

const VerifyPhone = () => {
    const navigate = useNavigate();
    let {phone} = useParams();
    const [submitting, setSubmitting] = useState(false);

    const verifyOTP = (formData) => {
        setSubmitting(true);
        let reqPayload = {phone: phone, otp: formData.otp};
        RESTClient.post(RestEndPoint.VERIFY_PHONE, reqPayload).then((response) => {
            setSubmitting(false);
            navigate("/?login=true");
        }).catch((error) => {
            setSubmitting(false);
            toast.error(RESTClient.getAPIErrorMessage(error));
        });
    };

    return (
        <Container className="main-container signup-main" fluid>
            <div className="signup-wrapper">
                <div className="signup-col left">
                    <RegisterInfoGraphic/>
                </div>
                <div className="signup-col right">
                    <SignupLogo />
                    <div className="form-wrapper">
                        <div className="form-title"><span>Verify your mobile number with the OTP sent to you via SMS.</span></div>
                        <div className="form-container">
                            <Formik initialValues={{ phone: {phone}, otp: ''}} validationSchema={VerifyPhoneSchema} validateOnBlur onSubmit={values => { verifyOTP(values)}}>
                                {({  errors, touched,setFieldValue ,values}) => (
                                <Form>
                                    <InputField fieldName="phone" fieldType="text" value={phone} placeholder="" readOnly={true} errors={errors} touched={touched}/> 
                                    <OtpInput
                                      onChange={(otp) =>
                                        setFieldValue("otp", otp)
                                      }
                                      numInputs={4}
                                      isInputNum={true}
                                      shouldAutoFocus
                                      value={values.otp}
                                      placeholder="----"
                                      inputStyle={{
                                        color: "blue",
                                        width: "2.5rem",
                                        height: "3rem",
                                        margin: "15px 0.5rem",
                                        fontSize: "2rem",
                                        borderRadius: 4,
                                        caretColor: "blue",
                                        marginLeft:"0px",
                                        border: "1px solid rgba(0,0,0,0.3)",
                                      }}
                                    />
                                    {errors.otp && <span style={{color:"red",fontSize:"10px"}}>{errors.otp}</span>}<br/>
                                        <div className='button-wrap'>
                                            <Button buttonLabel="Verify" submitting={submitting}/>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer autoClose={2000} position="top-right"/>
        </Container>
    );
};

export default VerifyPhone;