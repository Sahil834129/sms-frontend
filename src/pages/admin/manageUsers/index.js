import { useState } from 'react';
import { useEffect } from 'react';
import { Spinner } from "react-bootstrap";
import { toast } from "react-toastify";

import Button from 'react-bootstrap/Button';
import TableComponent from '../../../common/TableComponent';
import ToggleSwitch from "../../../common/TriStateToggle";
import { MANAGE_USER_PERMISSION } from "../../../constants/app";
import { humanize } from '../../../utils/helper';
import { getManagePermissions, getManagePermissionRoles, getManagePermissionModules, updateUserModulePermissions } from '../../../utils/services';
import Layout from '../layout';
import { PasswordDialog } from './passwordChange';

export const ManageUsers = () => {
  const [managePermissionRole, setManagePermissionRole] = useState({});
  const [managePermissions, setManagePermissions] = useState([]);
  const [isLoading, setIsloading] = useState(false);
  const [rowsData, setRowsData] = useState([]);
  const [tableRowsData, setTableRowsData] = useState([]);
  const [manageModules, setManageModules] = useState([]);
  const [currentSelectedRole, setCurrentSelectedRole] = useState([]);
  const [passWordWindowOpen, setPasswordWindowOpen] = useState(false);

  const fetchManagePermissionRoles = () => {
    getManagePermissionRoles()
      .then(response => {
        if (response.status === 200) {
          setManagePermissionRole(response.data);
        }
      })
      .catch(error => console.log(error));
  };

  const fetchManagePermissions = () => {
    getManagePermissions()
      .then(response => {
        if (response.status === 200) {
          setManagePermissions(response.data);
        }
      })
      .catch(error => console.log(error));
  };

  const fetchManagePermissionModules = () => {
    getManagePermissionModules()
      .then(response => {
        setManageModules(response.data);
      })
      .catch(error => console.log(error));
  };

  const handleManagePermisssion = (rData, index, value, field) => {
    const data = rData.map((val, i) => {
      if (i === index) {
        val[field] = value;
      }
      return val;
    });
    setTableRowsData(data);
  };

  const column = [
    {
      accessor: 'humanizedroleName',
      Header: 'User/Role Name',
    },
    {
      accessor: '',
      Header: 'Manage Admission',
      Cell: ((e) => {

        return (
          <div style={{ display: "flex", textAlign: "center", paddingLeft: "10px" }} >
            <ToggleSwitch
              onChangeHandler={(val) => {
                handleManagePermisssion(tableRowsData, e.row.index, val, 'manageAdmission');
              }}
              inputName={"manageAdmission"}
              values={MANAGE_USER_PERMISSION}
              selected={e.row.original.manageAdmission}
            />
          </div>
        );
      })
    },
    {
      accessor: '',
      Header: 'Manage Application',
      Cell: ((e) => {
        return (
          <div style={{ display: "flex", textAlign: "center", paddingLeft: "10px" }}>
            <ToggleSwitch
              onChangeHandler={(val) => {
                handleManagePermisssion(tableRowsData, e.row.index, val, 'manageApplication');
              }}
              inputName={"manageApplication"}
              values={MANAGE_USER_PERMISSION}
              selected={e.row.original.manageApplication}
            />
          </div>
        );
      })
    },
    {
      accessor: '',
      Header: 'Manage User',
      Cell: ((e) => {
        return (
          <div style={{ display: "flex", textAlign: "center", paddingLeft: "10px" }}>
            <ToggleSwitch
              onChangeHandler={(val) => {
                handleManagePermisssion(tableRowsData, e.row.index, val, 'manageUser');
              }}
              inputName={"manageUser"}
              values={MANAGE_USER_PERMISSION}
              selected={e.row.original.manageUser}
            />
          </div>
        );
      })
    },
    {
      accessor: '',
      Header: 'Manage Fee',
      Cell: ((e) => {
        return (
          <div style={{ display: "flex", textAlign: "center", paddingLeft: "10px" }}>
            <ToggleSwitch
              onChangeHandler={(val) => {
                handleManagePermisssion(tableRowsData, e.row.index, val, 'manageFee');
              }}
              inputName={"manageFee"}
              values={MANAGE_USER_PERMISSION}
              selected={e.row.original.manageFee}
            />
          </div>
        );
      })
    },
    {
      accessor: '',
      Header: ' ',
      Cell: ((e) => {
        return (
          <div>
            <Button
              type='button'
              disabled={(e.row.original?.roleUsers?.length || 0) === 0}
              style={{ backgroundColor: '#41285F' }}
              onClick={() => {
                setPasswordWindowOpen(true);
                setCurrentSelectedRole(e.row.original?.roleUsers || []);
              }}>Change Password</Button>
          </div>
        );
      })
    }
  ];

  const passWordWindowClose = () => {
    setPasswordWindowOpen(false);
  };

  const convertCamelCase = (moduleName) => {
    return `${moduleName.replace(" ", "").charAt(0).toLowerCase() + moduleName.replace(" ", "").slice(1)}`;
  };

  const saveModulePermissions = (tableData) => {
    let preparedSaveData = tableData.map(val => {
      const data = {
        roleId: val.roleId,
        roleName: val.roleName,
      };
      const modulePermissions = manageModules.map(value => {
        return {
          ...data,
          moduleName: value,
          permissionType: val[convertCamelCase(value)] || "NONE",
          id: val[convertCamelCase(value) + "Id"],
        };
      });
      return modulePermissions;
    });
    preparedSaveData = preparedSaveData.flat();
    updateUserModulePermissions(preparedSaveData)
      .then(response => {
        if (response.status === 200) {
          setManagePermissions(preparedSaveData)
          toast("All Roles Permissions are saved");
        }
      });
  };


  useEffect(() => {
    setIsloading(true);
    fetchManagePermissionModules();
    fetchManagePermissions();
    fetchManagePermissionRoles();
  }, []);

  useEffect(() => {
    const objKeys = Object.keys(managePermissionRole);
    if (objKeys.length > 0) {
      const row = objKeys.map((val) => {
        const id = +val;
        const data = {};
        managePermissions.map((value) => {
          if (value.roleId === id) {
            data.roleId = value.roleId;
            data.roleName = value.roleName;
            data.humanizedroleName = humanize(value.roleName);
            data.roleUsers = value.users;
            data.moduleName = value.moduleName;
            data.permissionType = value.permissionType;
            data[convertCamelCase(value.moduleName)] = value.permissionType;
            data[convertCamelCase(value.moduleName) + "Id"] = value.id;
          }
        });
        return data;
      });
      setRowsData(JSON.parse(JSON.stringify(row)));
      setTableRowsData(JSON.parse(JSON.stringify(row)));
      setIsloading(false);
    } else {
      setRowsData([]);
      setTableRowsData([]);
    }
  }, [managePermissionRole, managePermissions]);

  return (
    <>
      <Layout>
        <div className='content-area-inner inner-page-outer'>
          {!isLoading && <div className='internal-page-wrapper'>
            <div className='inner-content-wrap padt8'>
              <div className='title-area'>
                <h2>Manage all user credentials</h2>
                <div className='btn-wrapper'>
                  <Button
                    className='reset-btn'
                    onClick={() => {
                      setTableRowsData(JSON.parse(JSON.stringify(rowsData)));
                    }}>
                    Reset
                  </Button>
                  <Button className='save-btn' onClick={() => saveModulePermissions(tableRowsData)}>Save</Button>
                </div>
              </div>
              <div className='table-wrapper' >
                <TableComponent
                  columns={column}
                  data={tableRowsData}
                  showSelectedAll={false}
                  selectedRows={[]}
                  onSelectedRowsChange={null}
                />
              </div>
            </div>
          </div>}
          {isLoading && <div style={{ margin: '50px auto', width: '100%', textAlign: 'center' }}><Spinner animation="border" /></div>}
        </div>
      </Layout>
      <PasswordDialog
        show={passWordWindowOpen}
        handleClose={passWordWindowClose}
        usersData={currentSelectedRole}
      />
    </>
  );
};
export default ManageUsers;
