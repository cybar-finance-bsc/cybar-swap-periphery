const Router = artifacts.require("CybarRouter");
const WFTM = artifacts.require("WFTM9");
const ERC20 = artifacts.require("ERC20");
const cybarLib = artifacts.require("CybarLibrary");

module.exports = async function(deployer, network, accounts) {
    let walletAddress;
    let factoryAddress;
    let wFTMAddress;
    let wFTM;
    let dm0;
    let dm1;
    let dm2;
    let initialSupply = "100000000000000000000000";
    if(network == "development"){
        walletAddress = "";
        factoryAddress = "";
        await deployer.deploy(WFTM);
        wFTM = await WFTM.deployed();
        await deployer.deploy(ERC20, "dummy0", "dm0", initialSupply);
        dm0 = await ERC20.deployed();
        await deployer.deploy(ERC20, "dummy1", "dm1", initialSupply);
        dm1 = await ERC20.deployed();
        await deployer.deploy(ERC20, "dummy2", "dm2", initialSupply);
        dm2 = await ERC20.deployed();
        dm0.transfer(walletAddress, initialSupply);
        dm1.transfer(walletAddress, initialSupply);
        dm2.transfer(walletAddress, initialSupply);
    }
    else if (network == "fantomTestnet"){
        walletAddress = "0xf469818b50D0d7aFC2dd29050a3d5dc87C645438";
        factoryAddress = "0xfEFDC9E867B644A6b2bDc7ef0A72A61106ee9Dc3";
        wFTMAddress = "0xF2c58ba82860f9470C62A1f8E44656B64507d1f2";
        wFTM = await WFTM.at(wFTMAddress);
    }
    else if (network == "fantomMainnet"){
        walletAddress = "";
        factoryAddress = "";
        wFTM = await WFTM.at("");
    }
    await deployer.deploy(Router, factoryAddress, wFTM.address);
    const router = await Router.deployed();

    if (network == "fantomTestnet"){
        const cybarAddress = "0x5500f1D0993A666f5CD9dCE434762309Df257A9f";
        const dummyAddress = "0x6FBF220DDFc4FCa547894aa033CA6aa036C685E8";
        let deadline = Math.ceil(new Date().valueOf()/1000) + 600;

        // await router.addLiquidity(cybarAddress, dummyAddress, 10000, 10000, 9000, 9000, walletAddress, deadline);
        // console.log("First liquidity added");
        //await router.addLiquidity(cybarAddress, wFTMAddress, 10000, 10000, 9000, 9000, walletAddress, deadline);
        //console.log("Second liquidity added");
        //await router.addLiquidity(wFTMAddress, dummyAddress, 10000, 10000, 9000, 9000, walletAddress, deadline);
        //console.log("Third liquidity added");
    }
};

