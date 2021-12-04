const Router = artifacts.require("CybarRouter");
const WETH = artifacts.require("WETH9");
const cybarLib = artifacts.require("CybarLibrary");

module.exports = async function(deployer, network, accounts) {
    let walletAddress;
    let factoryAddress;
    let wFTMAddress;
    let wFTM;
    if(network == "development"){
        walletAddress = account[0];
        factoryAddress = "";
        await deployer.deploy(WETH);
        wFTM = await WETH.deployed();
    }
    else if (network == "fantomTestnet"){
        walletAddress = "0xf469818b50D0d7aFC2dd29050a3d5dc87C645438";
        factoryAddress = "0xfEFDC9E867B644A6b2bDc7ef0A72A61106ee9Dc3";
        wFTMAddress = "0xF2c58ba82860f9470C62A1f8E44656B64507d1f2";
        wFTM = await WETH.at(wFTMAddress);
    }
    else if (network == "fantomMainnet"){
        walletAddress = "";
        factoryAddress = "";
        wFTM = await WETH.at("");
    }
    await deployer.deploy(Router, factoryAddress, wFTM.address);
    const router = await Router.deployed();

    if (network == "fantomTestnet"){
        const cybarAddress = "0x5500f1D0993A666f5CD9dCE434762309Df257A9f";
        const dummyAddress = "0x6FBF220DDFc4FCa547894aa033CA6aa036C685E8";
        let deadline = Math.ceil(new Date().valueOf()/1000) + 600;

        await router.addLiquidity(cybarAddress, dummyAddress, 10000, 10000, 9000, 9000, walletAddress, deadline);
        console.log("First liquidity added");
        //await router.addLiquidity(cybarAddress, wFTMAddress, 10000, 10000, 9000, 9000, walletAddress, deadline);
        //console.log("Second liquidity added");
        //await router.addLiquidity(wFTMAddress, dummyAddress, 10000, 10000, 9000, 9000, walletAddress, deadline);
        //console.log("Third liquidity added");
    }
};

