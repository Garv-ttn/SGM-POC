import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Loader from "../Loader/Loader";
import Menu from "../Menu/Menu";
import styles from "./Popup.module.css";

const Popup = ({ appendToTable, updateToTable, setShow, show, editRow }) => {
  const [loading, setLoading] = useState(false);
  const handleClose = () => setShow(false);
  return (
    <>
      <Modal show={show} onHide={handleClose}>
        {loading && (
          <div className={styles.fullModalLoading}>
            <Loader />
          </div>
        )}
        <Modal.Header>
          <h3 className={styles.modalheading}>
            {editRow._id ? "Update Configuration" : "Add Configuration"}
          </h3>
        </Modal.Header>
        <Modal.Body>
          <Menu
            modalClose={handleClose}
            setLoading={setLoading}
            appendToTable={appendToTable}
            updateToTable={updateToTable}
            rowData={editRow}
          />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Popup;
