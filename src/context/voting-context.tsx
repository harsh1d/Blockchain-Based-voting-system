import React from "react";

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  walletAddress: string;
}

export interface Candidate {
  id: string;
  name: string;
  party: string;
  description: string;
  imageId: number;
  votes: number;
}

export interface Election {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: "upcoming" | "active" | "completed";
  candidates: Candidate[];
  totalVotes: number;
  imageId: number;
}

export interface VotingHistory {
  electionId: string;
  candidateId: string;
  timestamp: string;
  transactionHash: string;
}

interface VotingContextType {
  user: User;
  elections: Election[];
  votingHistory: VotingHistory[];
  getElection: (id: string) => Election | undefined;
  castVote: (electionId: string, candidateId: string) => Promise<boolean>;
  hasVoted: (electionId: string) => boolean;
}

// Mock data
const mockUser: User = {
  id: "1",
  name: "Alex Johnson",
  email: "alex@example.com",
  walletAddress: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F"
};

const mockElections: Election[] = [
  {
    id: "1",
    title: "City Mayor Election 2024",
    description: "Vote for the next mayor of our city. The elected mayor will serve a 4-year term starting January 2025.",
    startDate: "2024-06-01T00:00:00Z",
    endDate: "2024-06-15T23:59:59Z",
    status: "active",
    candidates: [
      {
        id: "1-1",
        name: "Sarah Williams",
        party: "Progress Party",
        description: "Former city council member with 10 years of public service experience.",
        imageId: 1,
        votes: 1245
      },
      {
        id: "1-2",
        name: "Michael Chen",
        party: "Future Alliance",
        description: "Entrepreneur and community organizer focused on economic development.",
        imageId: 2,
        votes: 1089
      },
      {
        id: "1-3",
        name: "Jessica Rodriguez",
        party: "Community First",
        description: "Civil engineer with plans to improve city infrastructure and public spaces.",
        imageId: 3,
        votes: 978
      }
    ],
    totalVotes: 3312,
    imageId: 1
  },
  {
    id: "2",
    title: "School Board Election",
    description: "Select representatives for the district school board who will oversee education policies and budgets.",
    startDate: "2024-05-15T00:00:00Z",
    endDate: "2024-06-30T23:59:59Z",
    status: "active",
    candidates: [
      {
        id: "2-1",
        name: "David Thompson",
        party: "Education First",
        description: "Former principal with 20 years in education administration.",
        imageId: 4,
        votes: 567
      },
      {
        id: "2-2",
        name: "Lisa Patel",
        party: "Future Learners",
        description: "Parent advocate and education policy researcher.",
        imageId: 5,
        votes: 489
      }
    ],
    totalVotes: 1056,
    imageId: 2
  },
  {
    id: "3",
    title: "Community Center Proposal",
    description: "Vote on the proposal to build a new community center in the downtown area.",
    startDate: "2024-07-01T00:00:00Z",
    endDate: "2024-07-15T23:59:59Z",
    status: "upcoming",
    candidates: [
      {
        id: "3-1",
        name: "Approve Proposal",
        party: "Yes",
        description: "Support building the new community center with the proposed $5M budget.",
        imageId: 6,
        votes: 0
      },
      {
        id: "3-2",
        name: "Reject Proposal",
        party: "No",
        description: "Against the current proposal due to budget concerns.",
        imageId: 7,
        votes: 0
      }
    ],
    totalVotes: 0,
    imageId: 3
  },
  {
    id: "4",
    title: "Park Renovation Project",
    description: "Choose between three design proposals for the central park renovation.",
    startDate: "2024-04-01T00:00:00Z",
    endDate: "2024-05-01T23:59:59Z",
    status: "completed",
    candidates: [
      {
        id: "4-1",
        name: "Nature-focused Design",
        party: "Proposal A",
        description: "Emphasizes natural landscapes and wildlife habitats.",
        imageId: 8,
        votes: 2341
      },
      {
        id: "4-2",
        name: "Recreation-focused Design",
        party: "Proposal B",
        description: "Prioritizes sports facilities and playgrounds.",
        imageId: 9,
        votes: 1876
      },
      {
        id: "4-3",
        name: "Mixed-use Design",
        party: "Proposal C",
        description: "Balances natural spaces with recreational facilities.",
        imageId: 10,
        votes: 3102
      }
    ],
    totalVotes: 7319,
    imageId: 4
  }
];

const mockVotingHistory: VotingHistory[] = [
  {
    electionId: "4",
    candidateId: "4-3",
    timestamp: "2024-04-15T14:32:17Z",
    transactionHash: "0x3a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b"
  }
];

// Create context
const VotingContext = React.createContext<VotingContextType | undefined>(undefined);

// Provider component
export const VotingContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user] = React.useState<User>(mockUser);
  const [elections, setElections] = React.useState<Election[]>(mockElections);
  const [votingHistory, setVotingHistory] = React.useState<VotingHistory[]>(mockVotingHistory);

  const getElection = (id: string) => {
    return elections.find(election => election.id === id);
  };

  const hasVoted = (electionId: string) => {
    return votingHistory.some(vote => vote.electionId === electionId);
  };

  const castVote = async (electionId: string, candidateId: string): Promise<boolean> => {
    // Simulate blockchain transaction
    return new Promise((resolve) => {
      setTimeout(() => {
        // Update election votes
        setElections(prevElections => 
          prevElections.map(election => {
            if (election.id === electionId) {
              return {
                ...election,
                totalVotes: election.totalVotes + 1,
                candidates: election.candidates.map(candidate => {
                  if (candidate.id === candidateId) {
                    return { ...candidate, votes: candidate.votes + 1 };
                  }
                  return candidate;
                })
              };
            }
            return election;
          })
        );

        // Add to voting history
        const newVote: VotingHistory = {
          electionId,
          candidateId,
          timestamp: new Date().toISOString(),
          transactionHash: `0x${Math.random().toString(16).substr(2, 40)}`
        };
        
        setVotingHistory(prev => [...prev, newVote]);
        resolve(true);
      }, 2000); // Simulate blockchain confirmation time
    });
  };

  const value = {
    user,
    elections,
    votingHistory,
    getElection,
    castVote,
    hasVoted
  };

  return <VotingContext.Provider value={value}>{children}</VotingContext.Provider>;
};

// Hook for using the context
export const useVoting = () => {
  const context = React.useContext(VotingContext);
  if (context === undefined) {
    throw new Error("useVoting must be used within a VotingContextProvider");
  }
  return context;
};