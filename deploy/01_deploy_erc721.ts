import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const bnftContract = await deploy("BNFT", {
    from: deployer,
    args: [
      deployer,
      "https://www.youtube.com/",
      "TetNft",
      "TNFT"
    ],
    log: true,
  });

  console.log(`contract bnftContract: `, bnftContract.address);
};

func.id = "bnftContract";
func.tags = ["BnftContract"];

export default func;
