'use client'
import React, {useEffect, useState} from "react";
import {Web3} from "web3";
import contractAbi from "contractABI.json"
import axios from "axios";
import styles from "../page.module.css";
import {ethers} from "ethers";

export default function Client() {
    const [coinAddress, setCoinAddress] = useState("");
    const [name, setName] = useState("")
    const [access, setAccess] = useState(false)
    const [message, setMessage] = useState("")
    const [token, setToken] = useState("")
    const [balance, setBalance] = useState("")
    const [inputValue, setInputValue] = useState('');

    const handleInputChange = (e) => {
        setInputValue(e.target.to_receipient.value);
    };

    let provider = typeof window !== "undefined" && window.ethereum;
    const web3 = new Web3(provider);
    const contract = new web3.eth.Contract(contractAbi, process.env.CONTRACT_ADDRESS);

    const connectAccount = async () => {
        try {
            if (!provider) return "kindly install metaMask extension"

            const accounts  = await provider.request({method: 'eth_requestAccounts'});

            if(accounts.length) {
                setCoinAddress(accounts[0])
            }

            await window.ethereum.on('accountsChanged', function (accounts) {
                setCoinAddress(accounts[0])
            });
        } catch (error){
            console.error(error);
        }
    }

    /**
     *  Auth Login
     * @param e
     * @returns {Promise<void>}
     */
    async function loginAction(e) {
        e.preventDefault();
        const data = await axios
            .post("http://localhost:1900/api/auth/login", {name: name, walletAddress: coinAddress}, {
                headers: {
                    'content-type': 'application/json',
                    'Accept': 'application/json'
                }
            })


        console.log(data.data.message)
        if(data.data.accessToken){
            const userAddress = data.data.profile.walletAddress

            await window.ethereum.request({method: 'eth_getBalance', params: [String(coinAddress), 'latest']})
                .then((res) => {
                    console.log(web3.utils.fromWei(res, 'ether'))
                    setBalance(web3.utils.fromWei(res, 'ether'))
                }).catch((err) => console.log(err))

            setToken(data.data.accessToken)
            setMessage(data.data.message)
            setAccess(true)

        } else {

            setMessage(data.data.message)
        }

    }
    /**
     *
     * @returns {Promise<void>}
     */
    const  performTransaction = async (event) => {
        // event.defaultPrevented();
        const params = [{
            gas: Number(21000).toString(16),
            gasPrice: Number(5).toString(16),
            from: coinAddress,
            to: "0xEA2cBB9e716808C22AfDef7F8e5E25A4C0e262F6",
            value: Number(10).toString(16)
        }]

        const res = await window.ethereum.request({method: 'eth_sendTransaction', params }).catch((err) => console.log(err))


        console.log(res)

    }


    useEffect(  () => {
        connectAccount();
    }, []);

    return (
        <div>
            <h1>Block Chain Code Challenge</h1>
            <br/>
            <br/>
            <p>Your available Balance : {balance}</p>
            {access ?
                    <div className={styles.main}>
                        <form onSubmit={performTransaction} className={styles.main}>
                            <br/>
                            <input type="text" name="to_receipient" placeholder="receipient:"/>
                            <button type="submit"> Send </button>
                        </form>
                    </div>

                :
                <div>
                    <form onSubmit={loginAction} className={styles.main}>
                        <p>{message}</p>
                        <br/>
                        <input type="text" name="address"
                               placeholder="address"
                               value={coinAddress || ""}
                               onChange={e => setCoinAddress(e.target.value)}/>
                        <button type="submit"> Login</button>
                    </form>
                </div>
                }
        </div>
    );
}