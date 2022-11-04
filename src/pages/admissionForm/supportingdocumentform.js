import React, { useState, useRef } from "react";
import "../../assets/scss/custom-styles.scss";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
// import Button from "../../components/form/Button";

import { useNavigate } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Layout from "../../common/layout";
import Breadcrumbs from "../../common/Breadcrumbs";
import LeftMenuBar from "../../common/LeftMenuBar";
import PageContent from "../../resources/pageContent";
import { Formik, Form, Field } from 'formik';
import InputField from "../../components/form/InputField";


export const SupportingDocumentForm = (SupportingDocumentForm) => {
  const [show, setShow] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const saveData = (formData) => {

    console.log(JSON.stringify(formData));
  }
  const hiddenFileInput = useRef(null);

  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };

  // Customize the file upload UI (see "customization"):
  const options = { multi: true };
  const [file, setFile] = React.useState("");

  // Handles file upload event and updates state
  function handleUpload(event) {
    setFile(event.target.files[0]);
    // Add code here to upload file to server
    // ...
  }
  const ImageThumb = ({ image }) => {
    return <img src={URL.createObjectURL(image)} alt={image.name} />;
  };
  const history = useNavigate();
  return (
    <Layout>
      <section className="content-area">
        <Container className="content-area-inner pt-n16 admmission-sequence-wrap">
          <Col className="inner-page-content">
            <Row className="content-section">
              <Breadcrumbs />
              <div className="content-area-inner internal-page-wrapper">
                <LeftMenuBar menuItems={PageContent.ADMISSION_FORM_SIDEBAR_MENU_ITEMS} parentPage="userProfile" />
                <div className="inner-page-content right">
                  <div className="inner-page-right-container">
                    <h6 className="student-heading">Supporting Documents</h6>
                    <p className="Stud-info">
                      Please provide accurate details of the student applying
                      for admission. This information is used to help the school
                      best cater for the educational needs of the student.
                    </p>
                    <Formik initialValues={{
                      file1: '',  documentName:''
                    }}
                      validateOnBlur onSubmit={values => { saveData(values) }}>
                      {({ values, setFieldValue, errors, touched }) => (
                        <Form className="row g-3">
                          <div className="tab_btn">
                            <ul className="nav nav-tabs my-3">
                              <li className="nav-item">
                                <a
                                  href="#paperback"
                                  className="nav-link active"
                                  data-bs-toggle="tab"
                                >
                                  Student
                                </a>
                              </li>
                              <li className="nav-item">
                                <a
                                  href="#ebook"
                                  className="nav-link"
                                  data-bs-toggle="tab"
                                >
                                  Parent/Guardian
                                </a>
                              </li>
                            </ul>
                            <div className="tab-content">
                              <div className="tab-pane active" id="paperback">
                                <Form className="row g-3">
                                  <div className="d-flex flex-column">
                                    <label className="form-label upload_pic">
                                      Upload Photo(a passport size coloured picture
                                      not more than 6 months){" "}
                                      <span className="req">*</span>
                                    </label>
                                    <span className="format-type">
                                      Format : jpeg, jpg & png only. image size
                                      should be less than 3MB
                                    </span>

                                    <div id="upload-box">
                                      <Button onClick={handleClick}>
                                        Upload a file
                                      </Button>
                                      <input
                                        type="file"
                                        id="file1"
                                        name="file1"
                                        onChange={handleUpload}
                                        style={{ display: "none" }}
                                        ref={hiddenFileInput}
                                      />
                                      <p>Filename: {file.name}</p>
                                      <p>File type: {file.type}</p>
                                      <p>File size: {file.size} bytes</p>
                                      {file && (
                                        <ImageThumb
                                          image={file}
                                          className=""
                                          style={{ width: "50px", height: "10px" }}
                                        />
                                      )}
                                    </div>
                                  </div>
                                  <div className="col-md-6 d-flex flex-column">
                                    <label className="form-label upload_pic">
                                      Birth Certificate
                                      <span className="req">*</span>
                                    </label>
                                    <span className="format-type mb-2">
                                      Format : jpeg, jpg & png only. image size
                                      should be less than 3MB
                                    </span>
                                    <div class="input-group">
                                      <input
                                        type="file"
                                        class="form-control"
                                        id="documentName"
                                        name="documentName"
                                        aria-describedby="inputGroupFileAddon04"
                                        aria-label="Upload"
                                        onChange={(event) => { setFieldValue("documentName", event.currentTarget.value); }}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-md-6 d-flex flex-column">
                                    <label className="form-label upload_pic">
                                      Immunization Certificate
                                      <span className="req">*</span>
                                    </label>
                                    <span className="format-type mb-2">
                                      Format : jpeg, jpg & png only. image size
                                      should be less than 3MB
                                    </span>
                                    <div class="input-group">
                                      <input
                                        type="file"
                                        class="form-control"
                                        id="documentName"
                                        name="documentName"
                                        aria-describedby="inputGroupFileAddon04"
                                        aria-label="Upload"
                                        onChange={(event) => { setFieldValue("documentName", event.currentTarget.value); }}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-md-6 d-flex flex-column mt-3">
                                    <label className="form-label upload_pic">
                                      Report Card(Last Year for the school attended)
                                      <span className="req">*</span>
                                    </label>
                                    <span className="format-type mb-2">
                                      Format : jpeg, jpg & png only. image size
                                      should be less than 3MB
                                    </span>
                                    <div class="input-group">
                                      <input
                                        type="file"
                                        class="form-control"
                                        id="documentName"
                                        name="documentName"
                                        aria-describedby="inputGroupFileAddon04"
                                        aria-label="Upload"
                                        onChange={(event) => { setFieldValue("documentName", event.currentTarget.value); }}
                                      />

                                    </div>
                                  </div>
                                  <div className="col-md-6 d-flex flex-column mt-3">
                                    <label className="form-label upload_pic">
                                      Medical Certificate(If Applicable)
                                      <span className="req">*</span>
                                    </label>
                                    <span className="format-type mb-2">
                                      Format : jpeg, jpg & png only. image size
                                      should be less than 3MB
                                    </span>
                                    <div class="input-group">
                                      <input
                                        type="file"
                                        class="form-control"
                                        id="documentName"
                                        name="documentName"
                                        aria-describedby="inputGroupFileAddon04"
                                        aria-label="Upload"
                                        onChange={(event) => { setFieldValue("documentName", event.currentTarget.value); }}
                                      />

                                    </div>
                                  </div>
                                  <div className="col-md-6 d-flex flex-column mt-3">
                                    <label className="form-label upload_pic">
                                      Caste Certificate(If Applicable)
                                      <span className="req">*</span>
                                    </label>
                                    <span className="format-type mb-2">
                                      Format : jpeg, jpg & png only. image size
                                      should be less than 3MB
                                    </span>
                                    <div className="d-flex align-items-center my-1">
                                      <div class="form-check form-check-inline">
                                        <InputField className="form-check-input" label="SC" value="true" fieldName="option1" fieldType="radio" errors={errors} touched={touched} />
                                      </div>
                                      <div class="form-check form-check-inline">
                                        <InputField className="form-check-input" label="ST" value="true" fieldName="option1" fieldType="radio" errors={errors} touched={touched} />
                                      </div>
                                      <div class="form-check form-check-inline">
                                        <InputField className="form-check-input" label="OBC" value="true" fieldName="option1" fieldType="radio" errors={errors} touched={touched} />
                                      </div>
                                    </div>
                                    <div class="input-group">
                                      <input
                                        type="file"
                                        class="form-control"
                                        id="documentName"
                                        name="documentName"
                                        aria-describedby="inputGroupFileAddon04"
                                        aria-label="Upload"
                                        onChange={(event) => { setFieldValue("documentName", event.currentTarget.value); }}
                                      />

                                    </div>
                                  </div>
                                  <div className="col-md-6 d-flex flex-column mt-3">
                                    <label className="form-label upload_pic">
                                      Residential Proof
                                      <span className="req">*</span>
                                    </label>
                                    <span className="format-type mb-2">
                                      Format : jpeg, jpg & png only. image size
                                      should be less than 3MB
                                    </span>
                                    <div className="d-flex align-items-center my-1">
                                      <div class="form-check form-check-inline">
                                        <InputField className="form-check-input" label="AADHAR" value="true" fieldName="option2" fieldType="radio" checked={values.option4} errors={errors} touched={touched} />
                                      </div>
                                      <div class="form-check form-check-inline">
                                        <InputField className="form-check-input" label="Passport" value="true" fieldName="option2" fieldType="radio" checked={values.option4} errors={errors} touched={touched} />
                                      </div>
                                    </div>
                                    <div class="input-group">
                                      <input
                                        type="file"
                                        class="form-control"
                                        id="documentName"
                                        name="documentName"
                                        aria-describedby="inputGroupFileAddon04"
                                        aria-label="Upload"
                                        onChange={(event) => { setFieldValue("documentName", event.currentTarget.value); }}
                                      />
                                    </div>
                                  </div>
                                </Form>
                              </div>
                              <div className="tab-pane" id="ebook">
                                <h1>hello shiv</h1>
                              </div>
                            </div>
                          </div>
                          <div className="form-group mb-3 button-wrap">
                            <button type="button" className='cancel comn' onClick={() => history("/parentsguardianform")}>{submitting ? "Please wait..." : "Cancel"}</button>
                            <button className='save comn' type="submit" submitting={submitting}
                            // onClick={() => history('/supportingdocumentform')}
                            >Save &amp; Next</button>
                          </div>
                        </Form>
                      )}
                    </Formik>
                  </div>
                </div>
              </div>
            </Row>
          </Col>
        </Container>
      </section>
    </Layout>
  );
};
export default SupportingDocumentForm;
