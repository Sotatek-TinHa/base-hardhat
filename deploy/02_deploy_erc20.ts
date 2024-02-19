import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const erc20Contract = await deploy("ERC20", {
    from: deployer,
    args: [
      deployer,
      deployer
    ],
    log: true,
  });

  console.log(`contract erc20: `, erc20Contract.address);
};

func.id = "tokens";
func.tags = ["Tokens"];

export default func;
