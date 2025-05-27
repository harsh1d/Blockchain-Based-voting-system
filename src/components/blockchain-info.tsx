import React from "react";
import { 
  Accordion, 
  AccordionItem, 
  Chip,
  Link,
  Code
} from "@heroui/react";
import { Icon } from "@iconify/react";

interface BlockchainInfoProps {
  electionId: string;
}

export const BlockchainInfo: React.FC<BlockchainInfoProps> = ({ electionId }) => {
  // Generate a deterministic contract address based on election ID
  const contractAddress = `0x${generateHashFromString(electionId)}`;
  const networkName = "Ethereum Sepolia Testnet";
  const blockNumber = 12345678 + parseInt(electionId) * 1000;
  const blockExplorerUrl = "https://sepolia.etherscan.io";
  
  return (
    <Accordion>
      <AccordionItem
        key="blockchain-info"
        aria-label="Blockchain Information"
        startContent={<Icon icon="lucide:database" className="text-primary" />}
        title="Blockchain Information"
      >
        <div className="space-y-4 py-2">
          <div className="flex flex-col gap-1">
            <p className="text-sm text-default-500">Smart Contract Address</p>
            <div className="flex items-center gap-2">
              <Code>{contractAddress}</Code>
              <Link href="#" isExternal showAnchorIcon>
                View on Explorer
              </Link>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-6">
            <div>
              <p className="text-sm text-default-500">Network</p>
              <div className="flex items-center gap-2 mt-1">
                <Chip color="success" size="sm" variant="dot">{networkName}</Chip>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-default-500">Deployment Block</p>
              <p className="font-medium">{blockNumber.toLocaleString()}</p>
            </div>
            
            <div>
              <p className="text-sm text-default-500">Verification Status</p>
              <div className="flex items-center gap-1 mt-1">
                <Icon icon="lucide:check-circle" className="text-success" />
                <span className="text-success">Verified</span>
              </div>
            </div>
          </div>
          
          <div>
            <p className="text-sm text-default-500 mb-2">Smart Contract Features</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="flex items-center gap-2">
                <Icon icon="lucide:check" className="text-success" />
                <span>Transparent voting process</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon icon="lucide:check" className="text-success" />
                <span>Tamper-proof ballot counting</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon icon="lucide:check" className="text-success" />
                <span>Voter anonymity protection</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon icon="lucide:check" className="text-success" />
                <span>Auditable results</span>
              </div>
            </div>
          </div>
        </div>
      </AccordionItem>
    </Accordion>
  );
};

// Helper function to generate a deterministic hash from a string
function generateHashFromString(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  // Convert to hex string and ensure it's 40 chars (20 bytes) for ETH address
  const hexHash = Math.abs(hash).toString(16).padStart(8, '0');
  return hexHash.padEnd(40, '0');
}