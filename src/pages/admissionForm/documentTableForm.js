import { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { hideLoader, showLoader } from "../../common/Loader";
import { ACCEPT_MIME_TYPE, FILE_SIZE, FILE_UPLOAD_ERROR } from "../../constants/app";
import RestEndPoint from "../../redux/constants/RestEndpoints";
import { humanize } from "../../utils/helper";
import RESTClient from "../../utils/RestClient";
import { downloadDocument } from "../../utils/services";

export function DocumentTableFormat({
  documents,
  currentStudent,
  currentTab,
  setDocument,
}) {
  const [fileUploadErrors, setFileUploadErrrors] = useState({});
  const [files, setFiles] = useState({});
  const dispatch = useDispatch();

  const handleFileChangeInput = (e) => {
    if(e.target.files[0])
    {
      setFileUploadErrrors({});
    }
    setFiles((val) => {
      return {
        ...val,
        [e.target.name]: e.target.files[0],
      };
    });
  };

  const callUploadFIleApi = async (childId, documentName, fileData) => {
    let formData = new FormData();
    formData.append("file", fileData[documentName]);
    formData.append("childId", childId);
    formData.append("documentName", documentName);

    try {
      showLoader(dispatch)
      const response = await RESTClient.post(
        RestEndPoint.STUDENT_DOCUMENT_UPLOAD,
        formData
      );
      if (response.data) {
        const data = documents.map((val) => {
          if (val.documentName === response.data.documentName) {
            return {
              ...val,
              ...response.data,
            };
          } else {
            return val;
          }
        });
        setDocument(data);
        delete fileData[documentName];
        setFiles(fileData);
        hideLoader(dispatch)
      }
    } catch (error) {
      hideLoader(dispatch)
      toast.error(RESTClient.getAPIErrorMessage(error));
    }
  };

  const validateFile = (uploadFile) => {
    
    if (uploadFile.size > FILE_SIZE) {
      toast.error(FILE_UPLOAD_ERROR.FILE_SIZE_ERROR_MSG)
      return false;
    }
    
    if(ACCEPT_MIME_TYPE.find((element) => element === uploadFile.type) ===undefined)
    {
      toast.error(FILE_UPLOAD_ERROR.FILE_TYPE_ERROR_MSG)
      return false;
    }
    return true;
  };

  const fileUplaod = (fileType, fileData) => {
    const error = {};
    if (fileData[fileType]) {
      if (validateFile(fileData[fileType])) {
        callUploadFIleApi(currentStudent.childId, fileType, fileData);
        error[fileType] = "";
      }
    } else {
      error[fileType] = "File is not selected";
    }
    setFileUploadErrrors((val) => {
      return {
        ...val,
        ...error,
      };
    });
  };
  useEffect(()=>{
    setFiles({})
    setFileUploadErrrors({});
  },[currentTab])

  return (
    <Table bordered hover className="document-tbl">
      <thead>
        <tr>
          <th>#</th>
          <th>Document Name</th>
          <th>Select</th>
          <th className="doc-upload-btn">Action</th>
          <th>Download (If Exist)</th>
        </tr>
      </thead>
      <tbody>
        {documents.map((val, index) => (
          <tr key={`${currentTab}-${index}`}>
            <td>{index + 1}</td>
            <td className="doc-name">
              <span>{humanize(val.documentName)}</span>
              <span>{val.mandatory ? "*" : ""}</span>
            </td>
            <td className="doc-upload-fld">
              <input
                type={"file"}
                accept=".jpg,.jpeg,.png,.pdf"
                style={{cursor:'pointer'}}
                name={val.documentName}
                onChange={handleFileChangeInput}
              />
              <span className="error-msg">
                {fileUploadErrors[val.documentName] !== undefined
                  ? fileUploadErrors[val.documentName]
                  : ""}
              </span>
            </td>
            <td className="doc-upload-btn">
              <Button
                className="upload-btn"
                onClick={(e) => {
                  fileUplaod(val.documentName, files);
                }}
              >
                Upload
              </Button>
            </td>
            <td className="doc-filename">
              {val.status === "uploaded" && (
                <a
                  href="javascript:void(0)"
                  onClick={() => {
                    downloadDocument(currentStudent.childId, val.documentName);
                  }}
                >
                  {" "}
                  Download <i className="icons link-icon"></i>
                </a>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
