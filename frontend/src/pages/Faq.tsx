import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import MetamaskImg1 from "@/assets/metamask1.png";
import MetamaskImg2 from "@/assets/metamask2.png";

export default function Faq() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="mb-4 text-4xl font-bold">Frequently Asked Questions</h1>
      <p className="mb-10 text-muted-foreground">
        Everything you need to know to use the NFT Ticketing dApp smoothly.
      </p>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="what-is-this">
          <AccordionTrigger>
            What is this NFT Ticketing dApp?
          </AccordionTrigger>
          <AccordionContent>
            This platform issues event tickets as NFTs on the Ethereum blockchain.
            Each ticket is unique, verifiable on-chain, and cannot be duplicated or
            forged. Ownership of the NFT equals ownership of the ticket.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="network">
          <AccordionTrigger>
            Which blockchain network is used?
          </AccordionTrigger>
          <AccordionContent>
            The dApp is deployed on the <strong>Ethereum Sepolia testnet</strong>.
            This is a test network used for development and demos. No real money is
            involved.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="metamask">
          <AccordionTrigger>
            How do I set up MetaMask correctly?
          </AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc space-y-2 pl-6">
              <li>Install the MetaMask browser extension.</li>
              <li>Open MetaMask and switch the network to <strong>Sepolia</strong>.
                <img src={MetamaskImg1} className="max-w-full w-100"/>
              </li>
              <li>Make sure under website settings it is set to use Sepolia.
                <img src={MetamaskImg2} className="max-w-full w-100"/>
              </li>
              <li>Refresh the page after switching networks.</li>
            </ul>
            If your wallet is on Mainnet or any other network, transactions will fail.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="sepolia-eth">
          <AccordionTrigger>
            Do I need Sepolia ETH?
          </AccordionTrigger>
          <AccordionContent>
            Yes. You need a small amount of <strong>Sepolia ETH</strong> to pay gas
            fees for minting or transferring tickets.
            <br />
            You can get free Sepolia ETH from public faucets such as the <a href="https://cloud.google.com/application/web3/faucet/ethereum/sepolia" target="_blank" rel="noreferrer" className="underline">Google Cloud Platform</a>.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="gas-fees">
          <AccordionTrigger>
            Why do I need gas for a free ticket?
          </AccordionTrigger>
          <AccordionContent>
            Even if the ticket itself is free, blockchain transactions require gas
            to compensate validators. On Sepolia, this gas is paid using test ETH,
            not real ETH.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="transaction-failed">
          <AccordionTrigger>
            My transaction failed. What went wrong?
          </AccordionTrigger>
          <AccordionContent>
            Common reasons include:
            <ul className="list-disc space-y-2 pl-6">
              <li>Wallet not connected</li>
              <li>Wrong network (not Sepolia)</li>
              <li>Insufficient Sepolia ETH</li>
              <li>Rejected MetaMask confirmation</li>
            </ul>
            Check MetaMask first—it usually tells you exactly why it failed.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="where-is-ticket">
          <AccordionTrigger>
            Where can I see my NFT ticket?
          </AccordionTrigger>
          <AccordionContent>
            After minting, the ticket NFT will appear in your wallet. You can also
            view it on a Sepolia block explorer like Etherscan by searching for your
            wallet address.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="real-events">
          <AccordionTrigger>
            Is this for real events?
          </AccordionTrigger>
          <AccordionContent>
            This deployment is on a testnet and is meant for demonstration and
            testing. A mainnet deployment would be required for real-world events.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="support">
          <AccordionTrigger>
            Still stuck?
          </AccordionTrigger>
          <AccordionContent>
            If something isn’t working, double-check your network and wallet setup.
            If the issue persists, contact the project maintainers with your wallet
            address and transaction hash.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
