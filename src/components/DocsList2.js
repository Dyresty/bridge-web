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

  return (
    <>

      {/* <pre>{JSON.stringify(docs, undefined, 2)}</pre>} */}
      <div class="heit">
      <Table striped responsive bordered hover size="lg">
        <thead>
          <tr>
            <th>#</th>
            <th>Student ID</th>
            <th>Student Name</th>
            <th>Student Rewards</th>
          </tr>
        </thead>
        <tbody>
          {docs.map((doc, index) => {
            return (
              //<tr key={doc.id}>
                <tr key={doc.students}>
                  <td>{index + 1}</td>
                  <td>{doc.student_id}</td>
                  <td>{doc.student_name}</td>
                  <td>{doc.student_rewards}</td>
                </tr>
              //</tr>
            );
          })}
        </tbody>
      </Table>
      </div>
    </>
  );
};

export default DocsList;
