import React, { useState, useEffect } from "react";
import { Form, Alert, InputGroup, Button } from "react-bootstrap";
import services_doc from "../services/services_doc";
import './doc.css';


const AddDoc = ({ id, setDocId }) => {
  const [student_rewards, setRewards] = useState("");
  const [student_name, setName] = useState("");
  const [student_id, setStudentID] = useState("");
  const [student_address, setAddress] = useState("");
  const [message, setMessage] = useState({ error: false, msg: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    if (student_rewards === "" || student_name === "" || student_id === "" || student_address === "") {
      setMessage({ error: true, msg: "All fields are mandatory!" });
      return;
    }
    const newDoc = {
      student_id,
      student_name,
      student_rewards,
      student_address
    };
    console.log(newDoc);

    try {
      if (id !== undefined && id !== "") {
        await services_doc.updateDoc(id, newDoc);
        setDocId("");
        setMessage({ error: false, msg: "Updated successfully!" });
      } else {
        await services_doc.addDocs(newDoc);
        setMessage({ error: false, msg: "New Doc added successfully!" });
      }
    } catch (err) {
      setMessage({ error: true, msg: err.message });
    }

    setRewards(0);
    setName("");
    setStudentID("");
    setAddress("");
  };

  const editHandler = async () => {
    setMessage("");
    try {
      const docSnap = await services_doc.getDoc(id);
      setRewards(docSnap.data().student_rewards);
      setName(docSnap.data().student_name);
      setStudentID(docSnap.data().student_id);
      setAddress(docSnap.data().student_address);
    } catch (err) {
      setMessage({ error: true, msg: err.message });
    }
  };

  useEffect(() => {
    console.log("The id here is : ", id);
    if (id !== undefined && id !== "") {
      editHandler();
    }
  }, [id]);
  return (
    <>
      <div className="p-4 box">
        {message?.msg && (
          <Alert
            variant={message?.error ? "danger" : "success"}
            dismissible
            onClose={() => setMessage("")}
          >
            {message?.msg}
          </Alert>
        )}

        

        <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formDocID">
            <InputGroup>
              <InputGroup.Text id="formDocID">Student ID</InputGroup.Text>
              <Form.Control
                className="studid"
                type="text"
                placeholder="ID"
                value={student_id}
                onChange={(e) => setStudentID(e.target.value)}
              />
            </InputGroup>
          </Form.Group>

        <Form.Group className="mb-3" controlId="formDocName">
            <InputGroup>
              <InputGroup.Text id="formDocName">Student Name</InputGroup.Text>
              
              <Form.Control
                className="frstname"
                type="text"
                placeholder="Name"
                value={student_name}
                onChange={(e) => setName(e.target.value)}
              />
            </InputGroup>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formDocAddress">
            <InputGroup>
              <InputGroup.Text id="formDocRewards">Student Address</InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Address"
                value={student_address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </InputGroup>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formDocRewards">
            <InputGroup>
              <InputGroup.Text id="formDocRewards">Student Rewards</InputGroup.Text>
              <Form.Control
                type="number"
                placeholder="Rewards"
                value={student_rewards}
                onChange={
                  (e) => setRewards(Number.parseFloat(e.target.value))
                }
              />
            </InputGroup>
          </Form.Group>

  
          <div className="d-grid gap-2">
            <Button variant="primary" type="Submit">
              Add/Update
            </Button>
          </div>

        </Form>
      </div>
    </>
  );
};

export default AddDoc;