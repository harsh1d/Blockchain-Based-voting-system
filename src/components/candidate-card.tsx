import React from "react";
import { Link as RouteLink } from "react-router-dom";
import { 
  Card, 
  CardBody, 
  CardFooter, 
  Button, 
  Chip,
  Avatar
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useVoting, Candidate } from "../context/voting-context";

interface CandidateCardProps {
  candidate: Candidate;
  electionStatus: "upcoming" | "active" | "completed";
  electionId: string;
}

export const CandidateCard: React.FC<CandidateCardProps> = ({ 
  candidate, 
  electionStatus,
  electionId
}) => {
  const { hasVoted, votingHistory } = useVoting();
  const userVoted = hasVoted(electionId);
  
  const isSelectedByUser = React.useMemo(() => {
    if (!userVoted) return false;
    return votingHistory.some(v => v.electionId === electionId && v.candidateId === candidate.id);
  }, [userVoted, votingHistory, electionId, candidate.id]);
  
  return (
    <Card className={`border ${isSelectedByUser ? 'border-primary' : 'border-divider'}`}>
      <CardBody className="pt-5">
        <div className="flex justify-center mb-4">
          <Avatar
            src={`https://img.heroui.chat/image/avatar?w=200&h=200&u=${candidate.imageId}`}
            className="w-24 h-24"
            isBordered={isSelectedByUser}
            color={isSelectedByUser ? "primary" : "default"}
          />
        </div>
        
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold">{candidate.name}</h3>
          <Chip 
            variant="flat" 
            color={getPartyColor(candidate.party)} 
            size="sm"
            className="mt-1"
          >
            {candidate.party}
          </Chip>
        </div>
        
        <p className="text-default-500 text-sm text-center">
          {candidate.description}
        </p>
        
        {electionStatus !== "upcoming" && (
          <div className="mt-4 flex justify-center">
            <Chip variant="flat" color="default" size="sm">
              <Icon icon="lucide:check-square" className="mr-1" />
              {candidate.votes.toLocaleString()} votes
            </Chip>
          </div>
        )}
      </CardBody>
      
      <CardFooter className="pt-0">
        {electionStatus === "active" && !userVoted ? (
          <Button 
            as={RouteLink}
            to={`/vote/${electionId}`}
            fullWidth
            color="primary"
            variant="flat"
            endContent={<Icon icon="lucide:vote" />}
          >
            Vote for this candidate
          </Button>
        ) : isSelectedByUser ? (
          <Button 
            fullWidth
            color="success"
            variant="flat"
            isDisabled
            startContent={<Icon icon="lucide:check" />}
          >
            You voted for this candidate
          </Button>
        ) : (
          <Button 
            fullWidth
            variant="bordered"
            isDisabled={electionStatus === "upcoming"}
          >
            {electionStatus === "upcoming" ? "Coming Soon" : "View Details"}
          </Button>
        )}
      </CardFooter>
    </Card>
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