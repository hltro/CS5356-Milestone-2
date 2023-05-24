import React, { useEffect, useState } from "react";
import ListClasses from "../components/ListClasses";
import CreateClass from "../components/CreateClass";

/**
 * CS-5356-TODO
 * Show classes on the Instructor Home Page
 *
 * When this component loads for the first time,
 * load the users classes with a GET /api/classes.
 * Save it to the component state.
 *
 * Users can create new class codes, and classes from this page.
 * When a class code is generated or a new class is created,
 * reload and display the updated list of the user's classes.
 */
const InstructorHomePage = props => {
  // console.log('props',props);
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () =>{
    fetch('api/classes', {
      method: "GET"
    })
      .then(response => {
        if (response.ok) {
          response.json().then(data => {
            console.log(data.classes);
            setClasses(data.classes);
          })
        }
      })
  }

// Show classes
  const onCodeGenerated = () => {  
    fetchData();
  };

// Create and update classes
  const onClassCreated = () => {
    fetchData();
  };

  return (
    <>
      <section>
        <div className="container">
          <ListClasses classes={classes} onCodeGenerated={onCodeGenerated} />
        </div>
      </section>
      <section>
        <div className="container">
          <CreateClass onClassCreated={onClassCreated} />
        </div>
      </section>
    </>
  );
};

export default InstructorHomePage;
