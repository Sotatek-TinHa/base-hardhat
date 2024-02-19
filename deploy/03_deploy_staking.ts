import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const bnftContract = await hre.deployments.get("BNFT");
  const erc20Contract = await hre.deployments.get("ERC20");

  const erc721StakingContract = await deploy("ERC721Staking", {
    from: deployer,
    args: [
      bnftContract.address,
      erc20Contract.address
    ],
    log: true,
  });

  console.log(`contract erc721Staking: `, erc721StakingContract.address);
};

func.id = "erc721Staking";
func.tags = ["ERC721Staking"];

export default func;
