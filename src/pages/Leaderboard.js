/* eslint-disable no-unused-vars */
import React from "react";
import './style.css';
import { useState } from "react";
import { Container, Navbar, Row, Col } from "react-bootstrap";
import "react-bootstrap";
import services_doc from "../services/services_doc";
import DocsList from "../components/DocsList"
import DocsList2 from "../components/DocsList2"
import AddDoc from "../components/AddDoc";
import initWeb3 from "../utils/web3"
import { useEffect, useRef } from "react";
import { abi, contractAddress } from "../utils/lottery"
import "../../src/App.css"

const { ethereum } = window;

function Leaderboard() {
  const [DocId, setDocId] = useState("");

  const lotteryContract = useRef(null);
  const [web3, setWeb3] = useState(null);
  const [doneCheckingForMetaMask, setDoneCheckingForMetaMask] = useState(false);
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [isGoerliChain, setIsGoerliChain] = useState(false)

  const [owner, setOwner] = useState("");
  const [blockteacheralloc, setblockteacheralloc] = useState([]);
  const [balance, setBalance] = useState("");

 // const [messageBalance, setMessageBalance] = useState("");
 

  useEffect(() => {
    let cancelled = false;

    async function initWeb3WithProvider() {
      if (web3 === null) {
        if (!cancelled) {
          setDoneCheckingForMetaMask(false);
          const web3Instance = await initWeb3();
          setWeb3(web3Instance);

          // Transactions done in this app must be done on the Goerli test network.
          const chainId = await ethereum.request({ method: 'eth_chainId' });
          if (chainId === "0x5") {
            setIsGoerliChain(true);
          }

          setDoneCheckingForMetaMask(true);

          if (web3Instance !== null) {
            // Create Contract JS object.
            lotteryContract.current = new web3Instance.eth.Contract(abi, contractAddress);

            // Check to see if user is already connected.
            try {
              const accounts = await ethereum.request({ method: "eth_accounts" });
              if (accounts.length > 0 && ethereum.isConnected()) {
                setConnected(true);
              }
            } catch (error) {
              console.error(error);
            }

            // Implement `accountsChanged` event handler.
            ethereum.on("accountsChanged", handleAccountsChanged);
          }
        }
      }
    }

    initWeb3WithProvider();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let cancelled = false;

    if (connected) {
      async function handler() {
        const owner = await lotteryContract.current.methods.owner().call();
        if (!cancelled) {
          setOwner(owner);
          await updateTechAllocAndBalance();
          //showBalance();
        }
      }
      handler();
    }

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected]);

  const getAccount = async (_event) => {
    setConnecting(true);
    try {
      await ethereum.request({ method: "eth_requestAccounts" });
    } catch (error) {}
    setConnecting(false);
  };

  const handleAccountsChanged = (_accounts) => {
    window.location.reload();
  };

  /**
   * Define a function to update players list and balance in the page view
   * without the user having to perform a manual page reload.
   */
  const updateTechAllocAndBalance = async () => {
    const blockteacheralloc = await lotteryContract.current.methods.blockteacheralloc().call();
    const balance = await web3.eth.getBalance(lotteryContract.current.options.address);
    setblockteacheralloc(blockteacheralloc);
    setBalance(balance);
  };

  const getDocIdHandler = (id) => {
    console.log("The ID of document to be edited: ", id);
    setDocId(id);
  };

  return (
    <div className="App">
      {web3 === null && !doneCheckingForMetaMask && (
        <div className="page-center">
          <div className="alert info">
            <h1 className="no-margin-top">StudentToken Contract</h1>
            <p className="no-margin">Checking for MetaMask Ethereum Provider...</p>
          </div>
        </div>
      )}

      {web3 === null && doneCheckingForMetaMask && (
        <div className="page-center">
          <div className="alert error">
          <div class="container">
          <Container>
            <Row>
              <Col>
                <DocsList2 getDocId={getDocIdHandler} />
              </Col>
            </Row>
          </Container>
        </div>
          </div>
        </div>
      )}

      {web3 !== null && doneCheckingForMetaMask && !isGoerliChain && (
        <div className="page-center">
          <div className="alert error">
            <h1 className="no-margin-top">StudentToken Contract</h1>
            <p className="no-margin">
              You must be connected to the <strong>Goerli test network</strong> for Ether
              transactions made via this app.
            </p>
          </div>
        </div>
      )}

      {web3 !== null && !connected && isGoerliChain && (
        <div className="page-center">
          <section className="card">
            <h1 className="no-margin-top">Leaderboard - Student Smart Token</h1>
            <p>
             Connect with MetaMask and start competing right
              away!
            </p>
            <div className="center">
              <button
                className="btn primaryBtn"
                type="button"
                onClick={getAccount}
                disabled={connecting}
              >
                Connect with MetaMask
              </button>
            </div>
          </section>
        </div>
      )}

      {web3 !== null && connected && isGoerliChain && (
        <div>
          <h1>Leaderboard</h1>
          <div className="page-center">
          
          <section className="card">
            <h3>Student Token</h3>
    
      {web3 !== null && doneCheckingForMetaMask && owner.toLowerCase() === ethereum.selectedAddress && (
        <>
          <div style={{"padding":"30px"}}></div>
          <div>
            <Container>
              <Row>
                <Col>
                  <AddDoc id={DocId} setDocId={setDocId} />
                </Col>
              </Row>
            </Container>
            <Container>
              <Row>
                <Col>
                  <DocsList getDocId={getDocIdHandler} />
                </Col>
              </Row>
            </Container>
          </div>
        </>
      )}
      {owner.toLowerCase() !== ethereum.selectedAddress && (
        <>
        <div style={{"padding":"30px"}}></div>
        <div class="container">
          <Container>
            <Row>
              <Col>
                <DocsList2 getDocId={getDocIdHandler} />
              </Col>
            </Row>
          </Container>
        </div>
        </>
      )}
      </section>
      </div>
      </div>
    )}
    </div>
  );
}
export default Leaderboard;