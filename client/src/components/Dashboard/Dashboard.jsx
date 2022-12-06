import React, { useState } from "react";
import Popup from "../Popup/Popup";
import styles from "./Dashboard.module.css";
import Table from "../Table/Tables";
import Button from "react-bootstrap/esm/Button";

const Dashboard = () => {
  const [TableData, setTableData] = useState([]);
  const [show, setShow] = useState(false);
  const [editRow, setEditRow] = useState({});

  function appendToTable(data) {
    setTableData((prev) => [...prev, data]);
  }

  function updateToTable(data) {
    setTableData(TableData.map((tr) => (tr._id === data._id ? data : tr)));
  }

  function fireEditFn(data) {
    setEditRow(data);
  }
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <img className={styles.logo} src={"./logo.png"} alt="logo_img" />
        <p className={styles.logoheading}>SGM Configurator</p>
      </div>

      <div className={styles.txt}>
        <h2 className={styles.para}>Saved Configurations</h2>

        <Button
          onClick={() => {
            setShow(true);
            setEditRow({});
          }}
          className={styles.addbutton}
        >
          Add New
        </Button>
        <Popup
          appendToTable={appendToTable}
          updateToTable={updateToTable}
          show={show}
          setShow={setShow}
          editRow={editRow}
        />
      </div>

      <div className={styles.table}>
        <Table
          infos={TableData}
          setInfos={setTableData}
          setShow={setShow}
          fireEditFn={fireEditFn}
        />
      </div>
    </div>
  );
};

export default Dashboard;
