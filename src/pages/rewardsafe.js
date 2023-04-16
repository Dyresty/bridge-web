import { useEffect, useRef, useState } from "react";
import initWeb3 from "../utils/web3"
import { abi, contractAddress } from "../utils/lottery"
import "../../src/App.css"
import { db } from "../firebase-config";
import AddDoc from "../components/AddDoc";
import DocsList from "../components/DocsList";
import assert from 'assert';
import { collection, query, where, getDocs, doc, getDoc, updateDoc} from "firebase/firestore";

const { ethereum } = window;

function Rewards() {
  const lotteryContract = useRef(null);
  const [web3, setWeb3] = useState(null);
  const [doneCheckingForMetaMask, setDoneCheckingForMetaMask] = useState(false);
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [isGoerliChain, setIsGoerliChain] = useState(false)

  const [DocId, setDocId] = useState("");
  const [owner, setOwner] = useState("");
  const [blockteacheralloc, setblockteacheralloc] = useState([]);
  const [balance, setBalance] = useState("");
  const [staddress, setStaddress] = useState("");
  const [value, setValue] = useState("");
  const [message, setMessage] = useState("");
 // const [messageBalance, setMessageBalance] = useState("");
 
  const [changing] = useState("");

  const [enteringLottery, setEnteringLottery] = useState(false);
  const [pickingWinner, setPickingWinner] = useState(false);

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

  const onSubmit = async (event) => {
    event.preventDefault();
    setEnteringLottery(true);
    const accounts = await web3.eth.getAccounts();
    showMessage("Waiting on transaction success...");
    const amt1 = web3.utils.toWei(event.target.amt.value, "ether");
    const acc1 = event.target.acc.value;
    await lotteryContract.current.methods.giveStudents(acc1,amt1).send({from: accounts[0]});

    let accID;
    let rewardsLocal;
    const q = query(collection(db, "students"), where("student_address".toLowerCase(), "==", acc1));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      accID = doc.id;
      //console.log(doc.id, " => ", doc.data());
    });
    console.log(accID);

    const docRef = doc(db, "students", accID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      console.log(docSnap.data().student_rewards)
      rewardsLocal = docSnap.data().student_rewards;
      console.log(rewardsLocal);
    } else {
      console.log("No such document!");
    }

    let rewardsLocal2 = Number.parseFloat(rewardsLocal) + Number.parseFloat(event.target.amt.value);
    console.log(rewardsLocal2);

    const docRef2 = doc(db, "students", accID);
    await updateDoc(docRef2, {
      student_rewards: Number.parseFloat(rewardsLocal2)
    });

    showMessage("The transaction has been completed");
    updateTechAllocAndBalance();
    setEnteringLottery(false);

  };   

  const onSubmit1 = async (event) => {
    event.preventDefault();
    setEnteringLottery(true);
    const accounts = await web3.eth.getAccounts();
    showMessage("Waiting on transaction success...");
    const acc2 = event.target.acc2.value;
    
    let accID;
    let rewardsLocal;
    const q = query(collection(db, "teachers"), where("teacher_address".toLowerCase(), "==", acc2));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      accID = doc.id;
      //console.log(doc.id, " => ", doc.data());
    });
    console.log(accID);
    const docRef = doc(db, "teachers", accID);
    const docSnap = await getDoc(docRef);
    let firstAllocT;

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      console.log(docSnap.data().firstAllocation)
      firstAllocT = docSnap.data().firstAllocation;
      console.log(firstAllocT);
    } else {
      console.log("No such document!");
    }
    try{
      assert.equal((firstAllocT),(false));
    }
    catch{
      setMessage("The teacher has already been allotted student tokens")
      return;
    }
    await lotteryContract.current.methods.giveTeachers(acc2).send({from: accounts[0]});
    

    rewardsLocal=7000;

    const docRef2 = doc(db, "teachers", accID);
    await updateDoc(docRef2, {
      student_rewards: Number.parseFloat(rewardsLocal)
      
    });
    await updateDoc(docRef2, {
      firstAllocation: true
    });

    showMessage("The transaction has been completed");
    showMessage(value);
    updateTechAllocAndBalance();
    setEnteringLottery(false);
  };
/*
  const onSubmit1 = async (event) => {
    event.preventDefault();
    setEnteringLottery(true);
    const accounts = await web3.eth.getAccounts();
    showMessage("Waiting on transaction success...");
    await lotteryContract.current.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(value, "ether")
    });
    showMessage("You have been entered!");
    updateTechAllocAndBalance();
    setEnteringLottery(false);
  };
*/
  const pickWinner = async (event) => {
    event.preventDefault();
    setPickingWinner(true);
    const accounts = await web3.eth.getAccounts();
    showMessage("Waiting on transaction success...");
    await lotteryContract.current.methods.pickWinner().send({
      from: accounts[0]
    });
    showMessage("A winner has been picked!");
    updateTechAllocAndBalance();
    setPickingWinner(false);
  };

  const showMessage = async (msg) => {
    setMessage(msg);
  };

  /*const showBalance = async () => {
    const bal = await web3.eth.getBalance(lotteryContract.current.options.address);
    setMessageBalance(bal);
  }*/


  const UnblockTeacherAlloc = async (event) =>{
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();
    showMessage("Unblocking allocation of tokens to students");
    await lotteryContract.current.methods.unblockTeacherAlloc().send({
      from: accounts[0]
    });
    showMessage("Unblocked allocation of tokens to students");
    window.location.reload();
  };

  const BlockTeacherAlloc = async (event) =>{
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();
    showMessage("Blocking allocation of tokens to students");
    await lotteryContract.current.methods.blockTeacherAlloc().send({
      from: accounts[0]
    });
    showMessage("Blocked allocation of tokens to students");
    window.location.reload();
  };

  return (
    <div className="App">
      {web3 === null && !doneCheckingForMetaMask && (
        <div className="page-center">
          <div className="alert info">
            <h1 className="no-margin-top">Lottery Contract</h1>
            <p className="no-margin">Checking for MetaMask Ethereum Provider...</p>
          </div>
        </div>
      )}

      {web3 === null && doneCheckingForMetaMask && (
        <div className="page-center">
          <div className="alert error">
            <h1 className="no-margin-top">Lottery Contract</h1>
            <p className="no-margin">
              MetaMask is required to run this app! Please install MetaMask and then refresh this
              page.
            </p>
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
            <h1 className="no-margin-top">Lottery Contract</h1>
            <p>
              Want to try your luck in the lottery? Connect with MetaMask and start competing right
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
          <h1>Rewards</h1>
        <div className="page-center">
          
          <section className="card">
            <h3>Student Token</h3>

            {owner.toLowerCase() === ethereum.selectedAddress && (
              <p>Welcome back, Admin.<br/>
                {blockteacheralloc === '0'? `Students can receive the tokens from the teachers`:`Currently the students cannot receive the tokens from the teachers`}
              </p>
            )}
            {owner.toLowerCase() !== ethereum.selectedAddress && (
              <p>Welcome, Teacher.<br/>We support good behavior with benefits.<br/><br/>
                {blockteacheralloc === '0'? `Students can receive the tokens from the teachers`:`Currently the students cannot receive the tokens from the teachers`}
              </p>
            )}

            

            {owner.toLowerCase() !== ethereum.selectedAddress && blockteacheralloc === '0' && (
                <><hr />

              
              <form 
                onSubmit={onSubmit}
                method="POST"
                target="_blank"
              >
                <h4>Transfer token to student accounts</h4>
                <div>
                  <input  style={{"width":"100%","padding": "12px 20px","margin": "8px 0","color":"black"}} 
                          type="text"  
                          placeholder="Enter the student account" 
                          name="acc"  
                          required /> 
                </div>
                <div>
                  <input  style={{"width":"100%","padding": "12px 20px","margin": "8px 0","color":"black"}} 
                          type="text"  
                          placeholder="Enter the amount of ether to send" 
                          name="amt" 
                          required />
                </div>
                <button className="btn primaryBtn" type="submit" disabled={enteringLottery}>
                    Enter
                </button>
                </form> 
              
              </>
            )}

            
            {owner.toLowerCase() === ethereum.selectedAddress && blockteacheralloc === '0' &&(
              <>
                <button
                  className="btn primaryBtn"
                  type="button"
                  onClick={BlockTeacherAlloc}
                  disabled={changing}
                >
                  Block allocation of tokens to students
                </button>
                <hr/>
              </>
            )}
            {owner.toLowerCase() === ethereum.selectedAddress && blockteacheralloc === '1' && (  
              <>
                <button
                  className="btn primaryBtn"
                  type="button"
                  onClick={UnblockTeacherAlloc}
                  disabled={changing}
                >
                  Unblock allocation of tokens to students
                </button>
                <hr/>
              </>
            )}

            {owner.toLowerCase() === ethereum.selectedAddress && (
              <>
  
                <h4>Allot tokens to Teachers?</h4>

                <form 
                  onSubmit={onSubmit1}
                  method="POST"
                  target="_blank"
                >
                <div>
                  <input  style={{"width":"100%","padding": "12px 20px","margin": "8px 0","color":"black"}} 
                          type="text"  
                          placeholder="Enter the teachers account" 
                          name="acc2"  
                          required /> 
                </div>
                <button className="btn primaryBtn" type="submit" disabled={enteringLottery}>
                    Enter
                </button>
                </form>
              
              </>
            )}
            <h2>{message}</h2>
          </section>
        </div>
        </div>
      )}
    </div>
  );
}

export default Rewards;

/*{players.length === 1
                ? ` There is currently ${players.length} person entered, `
                : ` There are currently ${players.length} people entered, `}
              competing to win {web3.utils.fromWei(balance, "ether")} ether!
              
              
              
              
              
              <form onSubmit={onSubmit}>
                <h4>Enter the amount of token to transfer to student</h4>
                <div>
                <label>Enter the student account</label>{" "}
                  <input value={staddress} onChange={(event) => setValue(event.target.value)} />{" "}
                </div>
                <br/>
                <div>
                  <label>Amount of ether to send:</label>{" "}
                  <input value={value} onChange={(event) => setValue(event.target.value)} />{" "}
                  <button className="btn primaryBtn" type="submit" disabled={enteringLottery}>
                    Enter
                  </button>
                </div>
              </form>
              
              <form 
                onSubmit={onSubmit}
                method="POST"
                target="_blank"
              >
                <h4>Enter the amount of token to transfer to student</h4>
                <div>
                  <input style={{"width":"100%","padding": "12px 20px","margin": "8px 0","color":"black"}} type="text" placeholder="Enter the student account" name="acc" value={value} onChange={(event) => setValue(event.target.value)}  required />
                </div>
                <div>
                  <input style={{"width":"100%","padding": "12px 20px","margin": "8px 0","color":"black"}} type="email" placeholder="Enter the amount of ether to send" name="acc" value={value} onChange={(event) => setValue(event.target.value)} required />
                </div>
                <button className="btn primaryBtn" type="submit" disabled={enteringLottery}>
                    Enter
                </button>
                </form> 

                            <h2>{messageBalance}</h2>
              */