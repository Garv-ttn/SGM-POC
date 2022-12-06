import React from "react";
import { useState, useEffect } from "react";
import styles from "./Tables.module.css";
import Moment from "react-moment";
import { MdEdit, MdDelete } from "react-icons/md";
import Table from "react-bootstrap/Table";
import axios from "axios";
import { toast } from "react-toastify";
import Form from "react-bootstrap/Form";

function Tables({ infos, setInfos, setShow, fireEditFn }) {
  const [filterType, setFilterType] = useState("default");

  const handleEdit = (data) => {
    if (!data.startTime)
      return toast.warn("Edit is not permitted, Match start time not found");

    if (Date.parse(data.startTime) <= new Date().getTime())
      return toast.warn("Can't edit match is already started");

    setShow(true);
    fireEditFn(data);
  };

  async function handleDelete(id) {
    try {
      const { data } = await axios.delete(
        `${process.env.REACT_APP_SERVER_URL}/configurations/${id}`
      );

      toast.success("Deleted Successfully");

      data._id && setInfos(infos.filter(({ _id }) => _id !== data._id));
    } catch (error) {
      console.log(error.message);
      return toast.error("Error please try again later");
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/configurations`
      );
      setInfos(data);
    } catch (error) {
      console.log(error.message);
      toast.error("Error please try again later");
    }
  };

  const handleFilter = (e) => [setFilterType(e.target.value)];

  const filterData = infos.filter((info) => {
    if (filterType === "default") {
      return info;
    }
    return info.type?.toLowerCase().includes(filterType?.toLocaleLowerCase());
  });

  return (
    <>
      <div className={styles.filtercontainer}>
        <div className={styles.filtermain}>
          <Form.Select
            onChange={handleFilter}
            className={styles.filterbody}
            aria-label="Default select example"
          >
            <option className={styles.filteroption} value="default">
              Default
            </option>
            <option className={styles.filteroption} value="Popular">
              Popular
            </option>
            <option className={styles.filteroption} value="Featured">
              Featured
            </option>
          </Form.Select>
        </div>
      </div>
      <Table bordered hover responsive>
        <thead>
          <tr className={styles.head}>
            <th>Type</th>
            <th>Details</th>
            <th>Date Added</th>
            <th>Enabled</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody className={styles.body}>
          {filterData.map((info) => (
            <tr
              className={info.type === "featured" ? styles.white : styles.gray}
              key={info._id}
            >
              <td
                className={
                  info.type === "popular" ? styles.orange : styles.green
                }
              >
                {info.type}
              </td>

              <td>
                {info.sportName}, {info.compName}, {info.matchName}
              </td>
              <td>
                <Moment format="dddd, MMMM Do, h:mm a">{info.createdAt}</Moment>
              </td>
              <td className={styles.check}>
                <input type="checkbox" checked={info.enabled} readOnly />
              </td>

              <td>
                <div className={styles.t_flex}>
                  <button
                    className={styles.space1}
                    onClick={() => handleEdit(info)}
                  >
                    <MdEdit />
                  </button>

                  <button
                    className={styles.space2}
                    onClick={() => handleDelete(info._id)}
                  >
                    <MdDelete />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}

export default Tables;
