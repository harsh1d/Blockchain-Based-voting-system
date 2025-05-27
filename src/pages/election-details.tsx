import React from "react";
import { useParams, Link as RouteLink } from "react-router-dom";
import { 
  Card, 
  CardBody, 
  CardHeader, 
  CardFooter, 
  Button, 
  Chip, 
  Divider, 
  Avatar,
  Breadcrumbs,
  BreadcrumbItem,
  Spinner,
  Image
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useVoting } from "../context/voting-context";
import { CandidateCard } from "../components/candidate-card";
import { BlockchainInfo } from "../components/blockchain-info";

interface RouteParams {
  id: string;
}

export const ElectionDetails: React.FC = () => {
  const { id } = useParams<RouteParams>();
  const { getElection, hasVoted } = useVoting();
  const [isLoading, setIsLoading] = React.useState(true);
  
  const election = React.useMemo(() => getElection(id), [id, getElection]);
  
  React.useEffect(() => {
    // Simulate loading data from blockchain
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Spinner size="lg" color="primary" label="Loading election details..." />
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "success";
      case "upcoming": return "primary";
      case "completed": return "default";
      default: return "default";
    }
  };

  const startDate = new Date(election.startDate);
  const endDate = new Date(election.endDate);
  const hasUserVoted = hasVoted(election.id);

  return (
    <div className="space-y-6">
      <Breadcrumbs>
        <BreadcrumbItem>
          <RouteLink to="/">Dashboard</RouteLink>
        </BreadcrumbItem>
        <BreadcrumbItem>Election Details</BreadcrumbItem>
      </Breadcrumbs>

      <Card className="border border-divider">
        <CardHeader className="flex gap-3">
          <Image
            alt={election.title}
            height={40}
            radius="sm"
            src={`https://img.heroui.chat/image/places?w=80&h=80&u=${election.imageId}`}
            width={40}
          />
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <p className="text-lg font-bold">{election.title}</p>
              <Chip color={getStatusColor(election.status)} variant="flat" size="sm">
                {election.status.charAt(0).toUpperCase() + election.status.slice(1)}
              </Chip>
            </div>
            <p className="text-default-500 text-sm">
              {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
            </p>
          </div>
        </CardHeader>
        <Divider/>
        <CardBody>
          <p className="mb-4">{election.description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center gap-2 p-3 bg-content2 rounded-medium">
              <div className="p-2 bg-primary/10 rounded-full">
                <Icon icon="lucide:users" className="text-primary text-lg" />
              </div>
              <div>
                <p className="text-sm text-default-500">Candidates</p>
                <p className="font-semibold">{election.candidates.length}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 p-3 bg-content2 rounded-medium">
              <div className="p-2 bg-success/10 rounded-full">
                <Icon icon="lucide:check-square" className="text-success text-lg" />
              </div>
              <div>
                <p className="text-sm text-default-500">Total Votes</p>
                <p className="font-semibold">{election.totalVotes.toLocaleString()}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 p-3 bg-content2 rounded-medium">
              <div className="p-2 bg-warning/10 rounded-full">
                <Icon icon="lucide:clock" className="text-warning text-lg" />
              </div>
              <div>
                <p className="text-sm text-default-500">
                  {election.status === "upcoming" ? "Starts In" : 
                   election.status === "active" ? "Ends In" : "Ended"}
                </p>
                <p className="font-semibold">
                  {election.status === "upcoming" 
                    ? getRemainingTime(startDate) 
                    : election.status === "active"
                      ? getRemainingTime(endDate)
                      : "Completed"}
                </p>
              </div>
            </div>
          </div>
          
          <BlockchainInfo electionId={election.id} />
        </CardBody>
        <Divider/>
        <CardFooter className="flex justify-between">
          <Button 
            as={RouteLink}
            to="/"
            variant="flat"
            startContent={<Icon icon="lucide:arrow-left" />}
          >
            Back to Dashboard
          </Button>
          
          {election.status === "active" && !hasUserVoted ? (
            <Button 
              as={RouteLink}
              to={`/vote/${election.id}`}
              color="primary"
              endContent={<Icon icon="lucide:vote" />}
            >
              Vote Now
            </Button>
          ) : election.status === "completed" || hasUserVoted ? (
            <Button 
              as={RouteLink}
              to={`/results/${election.id}`}
              variant="bordered"
              color="primary"
              endContent={<Icon icon="lucide:bar-chart-2" />}
            >
              View Results
            </Button>
          ) : (
            <Button 
              isDisabled
              variant="bordered"
              endContent={<Icon icon="lucide:clock" />}
            >
              Coming Soon
            </Button>
          )}
        </CardFooter>
      </Card>

      <h2 className="text-2xl font-bold mt-8 mb-4">Candidates</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {election.candidates.map((candidate) => (
          <CandidateCard 
            key={candidate.id} 
            candidate={candidate} 
            electionStatus={election.status} 
            electionId={election.id}
          />
        ))}
      </div>
    </div>
  );
};

// Helper function to calculate remaining time
function getRemainingTime(targetDate: Date): string {
  const now = new Date();
  const diffTime = targetDate.getTime() - now.getTime();
  
  if (diffTime <= 0) return "0 days";
  
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  if (diffDays > 0) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''}`;
  } else {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''}`;
  }
}