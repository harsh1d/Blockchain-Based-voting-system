import React from "react";
import { useParams, useHistory, Link as RouteLink } from "react-router-dom";
import { 
  Card, 
  CardBody, 
  CardHeader, 
  CardFooter, 
  Button, 
  Chip, 
  Divider, 
  RadioGroup,
  Radio,
  Spinner,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Breadcrumbs,
  BreadcrumbItem,
  Progress
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { useVoting } from "../context/voting-context";

interface RouteParams {
  id: string;
}

export const CastVote: React.FC = () => {
  const { id } = useParams<RouteParams>();
  const history = useHistory();
  const { getElection, castVote, hasVoted, user } = useVoting();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  
  const [selectedCandidate, setSelectedCandidate] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [currentStep, setCurrentStep] = React.useState(1);
  const [transactionHash, setTransactionHash] = React.useState("");
  
  const election = React.useMemo(() => getElection(id), [id, getElection]);
  
  React.useEffect(() => {
    // Check if user has already voted
    if (hasVoted(id)) {
      history.replace(`/results/${id}`);
      return;
    }
    
    // Check if election is active
    if (election && election.status !== "active") {
      history.replace(`/election/${id}`);
      return;
    }
    
    // Simulate loading data from blockchain
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [id, election, hasVoted, history]);

  const handleVoteSubmit = async () => {
    if (!selectedCandidate) return;
    
    setIsSubmitting(true);
    onOpen();
    
    try {
      // Simulate blockchain transaction steps
      await simulateBlockchainSteps();
      
      // Actually cast the vote in our mock system
      const success = await castVote(id, selectedCandidate);
      
      if (success) {
        setTransactionHash(`0x${Math.random().toString(16).substr(2, 40)}`);
        setCurrentStep(4); // Success
      } else {
        setCurrentStep(5); // Error
      }
    } catch (error) {
      setCurrentStep(5); // Error
    }
  };
  
  const handleModalClose = () => {
    if (currentStep === 4) {
      // Success - redirect to results
      history.push(`/results/${id}`);
    } else if (currentStep === 5) {
      // Error - stay on page and reset
      setIsSubmitting(false);
      setCurrentStep(1);
    }
  };
  
  // Simulate blockchain transaction steps
  const simulateBlockchainSteps = async () => {
    // Step 1: Wallet connection (already done)
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Step 2: Transaction signing
    setCurrentStep(2);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Step 3: Transaction confirmation
    setCurrentStep(3);
    await new Promise(resolve => setTimeout(resolve, 2500));
  };

  if (isLoading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Spinner size="lg" color="primary" label="Loading election data..." />
      </div>
    );
  }

  if (!election) {
    return (
      <div className="text-center py-12">
        <Icon icon="lucide:file-x" className="text-5xl text-danger mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Election Not Found</h2>
        <p className="text-default-500 mb-6">The election you're looking for doesn't exist or has been removed.</p>
        <Button as={RouteLink} to="/" color="primary">
          Return to Dashboard
        </Button>
      </div>
    );
  }

  const getSelectedCandidate = () => {
    return election.candidates.find(c => c.id === selectedCandidate);
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs>
        <BreadcrumbItem>
          <RouteLink to="/">Dashboard</RouteLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <RouteLink to={`/election/${id}`}>{election.title}</RouteLink>
        </BreadcrumbItem>
        <BreadcrumbItem>Cast Vote</BreadcrumbItem>
      </Breadcrumbs>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="border border-divider">
            <CardHeader>
              <div className="flex flex-col">
                <h2 className="text-xl font-bold">{election.title}</h2>
                <p className="text-default-500 text-sm">
                  Cast your vote for this election
                </p>
              </div>
            </CardHeader>
            <Divider/>
            <CardBody>
              <p className="mb-6">{election.description}</p>
              
              <h3 className="text-lg font-semibold mb-4">Select a Candidate</h3>
              
              <RadioGroup
                value={selectedCandidate}
                onValueChange={setSelectedCandidate}
              >
                <div className="space-y-3">
                  {election.candidates.map((candidate) => (
                    <motion.div
                      key={candidate.id}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <Card 
                        isPressable 
                        onPress={() => setSelectedCandidate(candidate.id)}
                        className={`border ${selectedCandidate === candidate.id ? 'border-primary' : 'border-divider'}`}
                      >
                        <CardBody>
                          <Radio value={candidate.id} className="hidden" />
                          <div className="flex items-center gap-4">
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                              selectedCandidate === candidate.id 
                                ? 'border-primary' 
                                : 'border-default-300'
                            }`}>
                              {selectedCandidate === candidate.id && (
                                <div className="w-3 h-3 rounded-full bg-primary" />
                              )}
                            </div>
                            <div className="flex-grow">
                              <div className="flex justify-between items-center">
                                <h4 className="font-medium">{candidate.name}</h4>
                                <Chip 
                                  variant="flat" 
                                  color={getPartyColor(candidate.party)} 
                                  size="sm"
                                >
                                  {candidate.party}
                                </Chip>
                              </div>
                              <p className="text-default-500 text-sm mt-1">
                                {candidate.description}
                              </p>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </RadioGroup>
            </CardBody>
            <Divider/>
            <CardFooter className="flex justify-between">
              <Button 
                as={RouteLink}
                to={`/election/${id}`}
                variant="flat"
                startContent={<Icon icon="lucide:arrow-left" />}
              >
                Back
              </Button>
              
              <Button 
                color="primary"
                isDisabled={!selectedCandidate || isSubmitting}
                isLoading={isSubmitting}
                onPress={handleVoteSubmit}
                endContent={!isSubmitting && <Icon icon="lucide:vote" />}
              >
                Submit Vote
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div>
          <Card className="border border-divider sticky top-6">
            <CardHeader>
              <h3 className="text-lg font-semibold">Voting Information</h3>
            </CardHeader>
            <Divider/>
            <CardBody>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-default-500">Voter</p>
                  <p className="font-medium">{user.name}</p>
                </div>
                
                <div>
                  <p className="text-sm text-default-500">Wallet Address</p>
                  <p className="font-medium text-sm font-mono truncate">
                    {user.walletAddress}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-default-500">Election</p>
                  <p className="font-medium">{election.title}</p>
                </div>
                
                <div>
                  <p className="text-sm text-default-500">Selected Candidate</p>
                  <p className="font-medium">
                    {getSelectedCandidate()?.name || "None selected"}
                  </p>
                </div>
                
                <Divider/>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium">Important Notes:</p>
                  <ul className="text-sm text-default-500 space-y-2">
                    <li className="flex items-start gap-2">
                      <Icon icon="lucide:info" className="text-primary mt-0.5" />
                      <span>Your vote is anonymous and securely recorded on the blockchain.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icon icon="lucide:info" className="text-primary mt-0.5" />
                      <span>You can only vote once per election.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icon icon="lucide:info" className="text-primary mt-0.5" />
                      <span>You will need to confirm the transaction in your wallet.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
      
      <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        onClose={handleModalClose}
        hideCloseButton={currentStep < 4}
        isDismissable={currentStep >= 4}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {currentStep < 4 ? "Processing Vote" : 
                 currentStep === 4 ? "Vote Successful!" : "Vote Failed"}
              </ModalHeader>
              <ModalBody>
                <div className="space-y-6">
                  {currentStep < 4 && (
                    <Progress 
                      size="sm" 
                      isIndeterminate 
                      aria-label="Processing vote" 
                      className="mb-2"
                      color="primary"
                    />
                  )}
                  
                  <div className="space-y-4">
                    <TransactionStep 
                      step={1}
                      title="Connecting to wallet"
                      description="Establishing secure connection to your blockchain wallet"
                      status={currentStep > 1 ? "complete" : currentStep === 1 ? "processing" : "waiting"}
                    />
                    
                    <TransactionStep 
                      step={2}
                      title="Signing transaction"
                      description="Creating and signing your vote transaction"
                      status={currentStep > 2 ? "complete" : currentStep === 2 ? "processing" : "waiting"}
                    />
                    
                    <TransactionStep 
                      step={3}
                      title="Confirming on blockchain"
                      description="Waiting for blockchain confirmation"
                      status={currentStep > 3 ? "complete" : currentStep === 3 ? "processing" : "waiting"}
                    />
                    
                    <TransactionStep 
                      step={4}
                      title="Vote recorded"
                      description="Your vote has been securely recorded on the blockchain"
                      status={currentStep === 4 ? "complete" : currentStep === 5 ? "error" : "waiting"}
                    />
                  </div>
                  
                  {currentStep === 4 && (
                    <div className="pt-2 border-t border-divider">
                      <p className="text-sm text-default-500">Transaction Hash:</p>
                      <p className="font-mono text-xs truncate">{transactionHash}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Icon icon="lucide:shield-check" className="text-success" />
                        <p className="text-sm text-success">Vote verified and immutable</p>
                      </div>
                    </div>
                  )}
                  
                  {currentStep === 5 && (
                    <div className="pt-2 border-t border-divider">
                      <div className="flex items-center gap-2">
                        <Icon icon="lucide:alert-triangle" className="text-danger" />
                        <p className="text-sm text-danger">Transaction failed. Please try again.</p>
                      </div>
                    </div>
                  )}
                </div>
              </ModalBody>
              <ModalFooter>
                {currentStep === 4 && (
                  <Button 
                    color="primary" 
                    onPress={() => {
                      onClose();
                      history.push(`/results/${id}`);
                    }}
                  >
                    View Results
                  </Button>
                )}
                
                {currentStep === 5 && (
                  <>
                    <Button 
                      variant="light" 
                      onPress={() => {
                        onClose();
                        setIsSubmitting(false);
                        setCurrentStep(1);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button 
                      color="primary" 
                      onPress={() => {
                        onClose();
                        setCurrentStep(1);
                        handleVoteSubmit();
                      }}
                    >
                      Try Again
                    </Button>
                  </>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

interface TransactionStepProps {
  step: number;
  title: string;
  description: string;
  status: "waiting" | "processing" | "complete" | "error";
}

const TransactionStep: React.FC<TransactionStepProps> = ({ step, title, description, status }) => {
  return (
    <div className="flex items-start gap-4">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
        status === "complete" ? "bg-success/10 text-success" :
        status === "processing" ? "bg-primary/10 text-primary" :
        status === "error" ? "bg-danger/10 text-danger" :
        "bg-default-100 text-default-500"
      }`}>
        {status === "complete" ? (
          <Icon icon="lucide:check" />
        ) : status === "processing" ? (
          <Spinner size="sm" color="current" />
        ) : status === "error" ? (
          <Icon icon="lucide:x" />
        ) : (
          <span>{step}</span>
        )}
      </div>
      
      <div>
        <p className={`font-medium ${
          status === "complete" ? "text-success" :
          status === "processing" ? "text-primary" :
          status === "error" ? "text-danger" :
          ""
        }`}>
          {title}
        </p>
        <p className="text-sm text-default-500">{description}</p>
      </div>
    </div>
  );
};

// Helper function to get color based on party
function getPartyColor(party: string): "primary" | "secondary" | "success" | "warning" | "danger" | "default" {
  const partyLower = party.toLowerCase();
  
  if (partyLower.includes("yes") || partyLower.includes("approve")) return "success";
  if (partyLower.includes("no") || partyLower.includes("reject")) return "danger";
  if (partyLower.includes("proposal a")) return "primary";
  if (partyLower.includes("proposal b")) return "secondary";
  if (partyLower.includes("proposal c")) return "warning";
  
  // For political parties, assign colors based on first letter to keep it consistent
  const firstChar = partyLower.charAt(0);
  if (firstChar <= 'e') return "primary";
  if (firstChar <= 'j') return "success";
  if (firstChar <= 'o') return "secondary";
  if (firstChar <= 't') return "warning";
  
  return "default";
}