import React, { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import services_doc from "../services/services_doc";
import './doc.css';

const DocsList = ({ getDocId }) => {
  const [docs, setDocs] = useState([]);
  useEffect(() => {
    getDocs();
  }, []);

  const getDocs = async () => {
    

    const data = await services_doc.getAllDocs();
    console.log(data.docs);
    setDocs(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  const deleteHandler = async (id) => {
    await services_doc.deleteDoc(id);
    getDocs();
  };
  
  return (
    <>
    
      <div className="mb-2">
        <Button variant="dark edit" onClick={getDocs}>
          Refresh List
        </Button>
      </div>

      {/* <pre>{JSON.stringify(docs, undefined, 2)}</pre>} */}
      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>#</th>
            <th>Student ID</th>
            <th className="studName">Student Name</th>
            <th className="studRew">Student Rewards</th>
          </tr>
        </thead>
        <tbody>
          {docs.map((doc, index) => {
            return (
              //<tr key={doc.id}>
              <div>
                <tr key={doc.students}>
                  <td>{index + 1}</td>
                  <td>{doc.student_id}</td>
                  <td>{doc.student_name}</td>
                  <td>{doc.student_rewards}</td>
                </tr>
                <tr>  
                  <td>
                  <Button
                    variant="secondary"
                    className="edit button1"
                    onClick={(e) => getDocId(doc.id)}
                  >
                    Edit
                  </Button>
                  </td>
                  <td>
                  <Button
                    variant="danger"
                    className="delete button1"
                    onClick={(e) => deleteHandler(doc.id)}
                  >
                    Delete
                  </Button>
                </td>
                </tr>
                
                </div>
            );
          })}
        </tbody>
      </Table>
    </>
  );
};

export default DocsList;


