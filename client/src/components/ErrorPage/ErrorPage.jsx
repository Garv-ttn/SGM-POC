import React from "react";
import { useNavigate } from "react-router-dom";
import styles from '../ErrorPage/ErrorPage.module.css'


const ErrorPage = () => {
  const navigate = useNavigate();
  return (
    <>
     <div id={styles.notfound}>
		<div className ={styles.notfound}>
			<div className ={styles.notfound-404}>
				<h1 className={styles.heading}><span className={styles.spanerror}>4</span><span className={styles.spanerror}>0</span><span className={styles.spanerror}>4</span></h1>
			</div>
			<h2 className={styles.errormessage}>we are sorry, but the page you requested was not found</h2>
        <button className="btn btn-success"
          onClick={() => navigate("/")}
        >
          Back to Home
        </button>
		</div>
	</div>

    </>
  );
};


export default ErrorPage;